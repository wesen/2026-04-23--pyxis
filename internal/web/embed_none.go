//go:build !embed

package web

import (
	"io/fs"
	"os"
)

func publicContentFS() (fs.FS, error) {
	return os.DirFS("internal/web/embed/public"), nil
}

func appContentFS() (fs.FS, error) {
	return os.DirFS("internal/web/embed/app"), nil
}
