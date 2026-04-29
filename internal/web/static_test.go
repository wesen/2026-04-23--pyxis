package web

import (
	"io/fs"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"testing/fstest"
)

func TestSPAHandlerServesFilesAndFallsBackToIndex(t *testing.T) {
	h := &spaHandler{
		reserveBackendPaths: true,
		label:               "public site",
		content: fstest.MapFS{
			"index.html":         &fstest.MapFile{Data: []byte("<!doctype html><div id=\"root\"></div>")},
			"assets/app-abc.js":  &fstest.MapFile{Data: []byte("console.log('ok')")},
			"assets/app-abc.css": &fstest.MapFile{Data: []byte("body{}")},
			"nested/indexed.txt": &fstest.MapFile{Data: []byte("nested")},
		},
	}
	h.fileServer = http.FileServer(http.FS(h.content))

	tests := []struct {
		name        string
		method      string
		path        string
		wantStatus  int
		wantBody    string
		contentType string
	}{
		{name: "root", method: http.MethodGet, path: "/", wantStatus: http.StatusOK, wantBody: "<div id=\"root\"></div>", contentType: "text/html"},
		{name: "shows route", method: http.MethodGet, path: "/shows", wantStatus: http.StatusOK, wantBody: "<div id=\"root\"></div>", contentType: "text/html"},
		{name: "show detail route", method: http.MethodGet, path: "/shows/123", wantStatus: http.StatusOK, wantBody: "<div id=\"root\"></div>", contentType: "text/html"},
		{name: "archive route", method: http.MethodHead, path: "/archive", wantStatus: http.StatusOK, wantBody: "", contentType: "text/html"},
		{name: "static js asset", method: http.MethodGet, path: "/assets/app-abc.js", wantStatus: http.StatusOK, wantBody: "console.log('ok')"},
		{name: "static css asset", method: http.MethodGet, path: "/assets/app-abc.css", wantStatus: http.StatusOK, wantBody: "body{}"},
		{name: "post browser route rejected", method: http.MethodPost, path: "/shows", wantStatus: http.StatusNotFound, wantBody: "404 page not found"},
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			req := httptest.NewRequest(tc.method, tc.path, nil)
			rr := httptest.NewRecorder()
			h.ServeHTTP(rr, req)
			if rr.Code != tc.wantStatus {
				t.Fatalf("status = %d, want %d; body=%q", rr.Code, tc.wantStatus, rr.Body.String())
			}
			if tc.wantBody != "" && !strings.Contains(rr.Body.String(), tc.wantBody) {
				t.Fatalf("body %q does not contain %q", rr.Body.String(), tc.wantBody)
			}
			if tc.contentType != "" && !strings.Contains(rr.Header().Get("Content-Type"), tc.contentType) {
				t.Fatalf("Content-Type = %q, want to contain %q", rr.Header().Get("Content-Type"), tc.contentType)
			}
		})
	}
}

func TestSPAHandlerReservedPathsDoNotReturnIndex(t *testing.T) {
	h := &spaHandler{
		reserveBackendPaths: true,
		label:               "public site",
		content: fstest.MapFS{
			"index.html": &fstest.MapFile{Data: []byte("<!doctype html><div id=\"root\"></div>")},
		},
	}
	h.fileServer = http.FileServer(http.FS(h.content))

	reserved := []string{"/api", "/api/public/shows", "/auth", "/auth/me", "/health", "/flyers", "/flyers/poster.png"}
	for _, path := range reserved {
		t.Run(path, func(t *testing.T) {
			rr := httptest.NewRecorder()
			h.ServeHTTP(rr, httptest.NewRequest(http.MethodGet, path, nil))
			if rr.Code != http.StatusNotFound {
				t.Fatalf("status = %d, want 404", rr.Code)
			}
			if strings.Contains(rr.Body.String(), "<div id=\"root\"></div>") {
				t.Fatalf("reserved path returned index.html: %q", rr.Body.String())
			}
		})
	}
}

func TestMissingBundleHandlerPreservesReserved404(t *testing.T) {
	h := missingBundleHandler("public site", true, fs.ErrNotExist)

	t.Run("browser route gets service unavailable", func(t *testing.T) {
		rr := httptest.NewRecorder()
		h.ServeHTTP(rr, httptest.NewRequest(http.MethodGet, "/shows", nil))
		if rr.Code != http.StatusServiceUnavailable {
			t.Fatalf("status = %d, want 503", rr.Code)
		}
	})

	t.Run("api route remains not found", func(t *testing.T) {
		rr := httptest.NewRecorder()
		h.ServeHTTP(rr, httptest.NewRequest(http.MethodGet, "/api/public/shows", nil))
		if rr.Code != http.StatusNotFound {
			t.Fatalf("status = %d, want 404", rr.Code)
		}
	})
}

func TestAppSPAHandlerWithStrippedPrefix(t *testing.T) {
	h := &spaHandler{
		reserveBackendPaths: true,
		label:               "staff app",
		content: fstest.MapFS{
			"index.html":        &fstest.MapFile{Data: []byte("<!doctype html><div id=\"admin-root\"></div>")},
			"assets/app-abc.js": &fstest.MapFile{Data: []byte("console.log('admin')")},
		},
	}
	h.fileServer = http.FileServer(http.FS(h.content))

	tests := []struct {
		name       string
		path       string
		wantStatus int
		wantBody   string
	}{
		{name: "staff root", path: "/", wantStatus: http.StatusOK, wantBody: "admin-root"},
		{name: "staff browser route", path: "/shows/123", wantStatus: http.StatusOK, wantBody: "admin-root"},
		{name: "staff asset", path: "/assets/app-abc.js", wantStatus: http.StatusOK, wantBody: "console.log('admin')"},
		{name: "reserved backend after strip", path: "/api/app/session", wantStatus: http.StatusNotFound, wantBody: "404 page not found"},
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			rr := httptest.NewRecorder()
			h.ServeHTTP(rr, httptest.NewRequest(http.MethodGet, tc.path, nil))
			if rr.Code != tc.wantStatus {
				t.Fatalf("status = %d, want %d; body=%q", rr.Code, tc.wantStatus, rr.Body.String())
			}
			if !strings.Contains(rr.Body.String(), tc.wantBody) {
				t.Fatalf("body %q does not contain %q", rr.Body.String(), tc.wantBody)
			}
		})
	}
}
