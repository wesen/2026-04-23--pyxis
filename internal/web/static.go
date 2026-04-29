package web

import (
	"bytes"
	"io/fs"
	"net/http"
	"path"
	"strings"
)

var reservedPrefixes = []string{
	"/api/",
	"/auth/",
	"/flyers/",
}

// NewSPAHandler serves the built public user site and falls back to index.html
// for browser routes handled by React Router. API/auth/flyer paths are reserved
// so missing backend routes return 404 instead of HTML.
func NewSPAHandler() http.Handler {
	return newSPAHandler(publicContentFS, "public site", true)
}

// NewAppSPAHandler serves the built staff/admin app. It expects the /app prefix
// to be stripped by the caller so /app/assets/foo.js maps to assets/foo.js in
// the staff app bundle and /app/shows falls back to the staff app index.html.
func NewAppSPAHandler() http.Handler {
	return newSPAHandler(appContentFS, "staff app", true)
}

func newSPAHandler(contentFS func() (fs.FS, error), label string, reserveBackendPaths bool) http.Handler {
	content, err := contentFS()
	if err != nil {
		return missingBundleHandler(label, reserveBackendPaths, err)
	}
	if _, err := fs.Stat(content, "index.html"); err != nil {
		return missingBundleHandler(label, reserveBackendPaths, err)
	}
	return &spaHandler{
		content:             content,
		fileServer:          http.FileServer(http.FS(content)),
		label:               label,
		reserveBackendPaths: reserveBackendPaths,
	}
}

type spaHandler struct {
	content             fs.FS
	fileServer          http.Handler
	label               string
	reserveBackendPaths bool
}

func (h *spaHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet && r.Method != http.MethodHead {
		http.NotFound(w, r)
		return
	}
	if h.reserveBackendPaths && isReservedPath(r.URL.Path) {
		http.NotFound(w, r)
		return
	}

	name := strings.TrimPrefix(path.Clean("/"+r.URL.Path), "/")
	if name != "" && h.fileExists(name) {
		h.fileServer.ServeHTTP(w, r)
		return
	}

	h.serveIndex(w, r)
}

func (h *spaHandler) fileExists(name string) bool {
	stat, err := fs.Stat(h.content, name)
	return err == nil && !stat.IsDir()
}

func (h *spaHandler) serveIndex(w http.ResponseWriter, r *http.Request) {
	index, err := fs.ReadFile(h.content, "index.html")
	if err != nil {
		http.Error(w, h.label+" bundle is missing index.html; run `make build-web`", http.StatusServiceUnavailable)
		return
	}
	stat, _ := fs.Stat(h.content, "index.html")
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	if stat != nil {
		http.ServeContent(w, r, "index.html", stat.ModTime(), bytes.NewReader(index))
		return
	}
	_, _ = w.Write(index)
}

func isReservedPath(path string) bool {
	if path == "/api" || path == "/auth" || path == "/health" || path == "/flyers" {
		return true
	}
	for _, prefix := range reservedPrefixes {
		if strings.HasPrefix(path, prefix) {
			return true
		}
	}
	return false
}

func missingBundleHandler(label string, reserveBackendPaths bool, err error) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if reserveBackendPaths && isReservedPath(r.URL.Path) {
			http.NotFound(w, r)
			return
		}
		http.Error(w, label+" bundle is unavailable; run `make build-web`: "+err.Error(), http.StatusServiceUnavailable)
	})
}
