// build-web builds the public user-site bundle and copies it into the Go embed tree.
//
// Usage:
//
//	go run ./cmd/build-web                    # Dagger path, with local fallback when Dagger is unavailable
//	BUILD_WEB_LOCAL=1 go run ./cmd/build-web  # force local pnpm build
//
// The Pyxis web workspace is rooted at web/, while the public Vite app writes to
// web/packages/pyxis-user-site/dist. This command copies that package dist into
// internal/web/embed/public so go:embed can package it into the pyxis binary.
package main

import (
	"context"
	"errors"
	"fmt"
	"io"
	"io/fs"
	"log"
	"os"
	"os/exec"
	"path/filepath"

	"dagger.io/dagger"
)

const (
	defaultBuilderImage = "node:22"
	defaultPNPMVersion  = "9.0.0"
	pnpmCacheName       = "pyxis-user-site-pnpm-store"
)

var errDaggerUnavailable = errors.New("dagger engine unavailable")

func main() {
	if err := run(context.Background()); err != nil {
		fmt.Fprintf(os.Stderr, "Error: %v\n", err)
		os.Exit(1)
	}
}

func run(ctx context.Context) error {
	repoRoot, err := findRepoRoot()
	if err != nil {
		return err
	}

	if os.Getenv("BUILD_WEB_LOCAL") == "1" {
		return runLocal(repoRoot)
	}

	if err := runDagger(ctx, repoRoot); err != nil {
		if errors.Is(err, errDaggerUnavailable) {
			fmt.Fprintf(os.Stderr, "Dagger unavailable, falling back to local pnpm: %v\n", err)
			return runLocal(repoRoot)
		}
		return err
	}
	return nil
}

func runDagger(ctx context.Context, repoRoot string) error {
	client, err := dagger.Connect(ctx, dagger.WithLogOutput(os.Stdout))
	if err != nil {
		return fmt.Errorf("%w: %v", errDaggerUnavailable, err)
	}
	defer func() { _ = client.Close() }()

	webDir := filepath.Join(repoRoot, "web")
	pnpmVersion := getenv("WEB_PNPM_VERSION", readPNPMVersion(webDir))
	if pnpmVersion == "" {
		pnpmVersion = defaultPNPMVersion
	}
	builderImage := getenv("WEB_BUILDER_IMAGE", defaultBuilderImage)

	source := client.Host().Directory(webDir, dagger.HostDirectoryOpts{
		Exclude: []string{
			"node_modules",
			"packages/*/node_modules",
			"packages/*/dist",
			"packages/*/storybook-static",
			".turbo",
		},
	})

	container := client.Container().
		From(builderImage).
		WithEnvVariable("PNPM_HOME", "/pnpm").
		WithEnvVariable("PATH", "/pnpm:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin").
		WithMountedCache("/pnpm/store", client.CacheVolume(pnpmCacheName)).
		WithDirectory("/src", source).
		WithWorkdir("/src").
		WithExec([]string{"sh", "-lc", "corepack enable && corepack prepare pnpm@" + pnpmVersion + " --activate"}).
		WithExec([]string{"pnpm", "install", "--frozen-lockfile"}).
		WithExec([]string{"pnpm", "--filter", "pyxis-types", "build"}).
		WithExec([]string{"pnpm", "--filter", "pyxis-components", "build"}).
		WithExec([]string{"pnpm", "--filter", "pyxis-user-site", "build"})

	tmpDir, err := os.MkdirTemp("", "pyxis-user-site-dist-")
	if err != nil {
		return fmt.Errorf("create temp dist dir: %w", err)
	}
	defer os.RemoveAll(tmpDir)

	if _, err := container.Directory("/src/packages/pyxis-user-site/dist").Export(ctx, tmpDir); err != nil {
		return fmt.Errorf("export public site dist from Dagger: %w", err)
	}

	if err := copyDistToEmbed(repoRoot, tmpDir); err != nil {
		return err
	}
	log.Printf("Successfully exported public user-site dist to %s via Dagger", embedPublicDir(repoRoot))
	return nil
}

func runLocal(repoRoot string) error {
	if err := runCmd(repoRoot, "pnpm", "--dir", "web", "--filter", "pyxis-types", "build"); err != nil {
		return fmt.Errorf("build pyxis-types with local pnpm: %w", err)
	}
	if err := runCmd(repoRoot, "pnpm", "--dir", "web", "--filter", "pyxis-components", "build"); err != nil {
		return fmt.Errorf("build pyxis-components with local pnpm: %w", err)
	}
	if err := runCmd(repoRoot, "pnpm", "--dir", "web", "--filter", "pyxis-user-site", "build"); err != nil {
		return fmt.Errorf("build public user site with local pnpm: %w", err)
	}

	src := filepath.Join(repoRoot, "web", "packages", "pyxis-user-site", "dist")
	if err := copyDistToEmbed(repoRoot, src); err != nil {
		return err
	}
	log.Printf("Successfully exported public user-site dist to %s via local pnpm", embedPublicDir(repoRoot))
	return nil
}

func copyDistToEmbed(repoRoot, src string) error {
	if _, err := os.Stat(filepath.Join(src, "index.html")); err != nil {
		return fmt.Errorf("public site dist is missing index.html at %s: %w", src, err)
	}
	dst := embedPublicDir(repoRoot)
	if err := recreate(dst); err != nil {
		return fmt.Errorf("recreate embed public dir: %w", err)
	}
	if err := copyTree(src, dst); err != nil {
		return fmt.Errorf("copy public site dist to embed dir: %w", err)
	}
	return nil
}

func embedPublicDir(repoRoot string) string {
	return filepath.Join(repoRoot, "internal", "web", "embed", "public")
}

func readPNPMVersion(webDir string) string {
	data, err := os.ReadFile(filepath.Join(webDir, "package.json"))
	if err != nil {
		return ""
	}
	const prefix = `"packageManager": "pnpm@`
	for i := 0; i+len(prefix) < len(data); i++ {
		if string(data[i:i+len(prefix)]) != prefix {
			continue
		}
		start := i + len(prefix)
		end := start
		for end < len(data) && data[end] != '"' {
			end++
		}
		return string(data[start:end])
	}
	return ""
}

func findRepoRoot() (string, error) {
	dir, err := os.Getwd()
	if err != nil {
		return "", err
	}
	for i := 0; i < 12; i++ {
		if _, err := os.Stat(filepath.Join(dir, "go.mod")); err == nil {
			return dir, nil
		}
		parent := filepath.Dir(dir)
		if parent == dir {
			break
		}
		dir = parent
	}
	return "", fmt.Errorf("go.mod not found in current directory or parents")
}

func getenv(key, def string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return def
}

func runCmd(dir, name string, args ...string) error {
	cmd := exec.Command(name, args...)
	cmd.Dir = dir
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	return cmd.Run()
}

func recreate(dir string) error {
	if err := os.MkdirAll(dir, 0o755); err != nil {
		return err
	}
	entries, err := os.ReadDir(dir)
	if err != nil {
		return err
	}
	for _, entry := range entries {
		if entry.Name() == ".keep" {
			continue
		}
		if err := os.RemoveAll(filepath.Join(dir, entry.Name())); err != nil {
			return err
		}
	}
	return nil
}

func copyTree(src, dst string) error {
	return filepath.WalkDir(src, func(path string, entry fs.DirEntry, err error) error {
		if err != nil {
			return err
		}
		rel, err := filepath.Rel(src, path)
		if err != nil {
			return err
		}
		if rel == "." {
			return nil
		}
		target := filepath.Join(dst, rel)
		if entry.IsDir() {
			return os.MkdirAll(target, 0o755)
		}

		in, err := os.Open(path)
		if err != nil {
			return err
		}
		defer in.Close()

		if err := os.MkdirAll(filepath.Dir(target), 0o755); err != nil {
			return err
		}
		out, err := os.Create(target)
		if err != nil {
			return err
		}
		defer out.Close()

		if _, err := io.Copy(out, in); err != nil {
			return err
		}
		info, err := entry.Info()
		if err != nil {
			return err
		}
		return os.Chmod(target, info.Mode())
	})
}
