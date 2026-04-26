package server

import "net/http"

// spaFallbackHandler lets the API/auth/file mux answer first and delegates only
// unmatched routes to the public SPA handler. This avoids net/http ServeMux
// pattern conflicts between method-specific API routes and a root catch-all.
type spaFallbackHandler struct {
	primary  http.Handler
	fallback http.Handler
}

func (h spaFallbackHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	recorder := &bufferedResponseWriter{header: make(http.Header)}
	h.primary.ServeHTTP(recorder, r)
	if recorder.status == http.StatusNotFound {
		h.fallback.ServeHTTP(w, r)
		return
	}
	recorder.flushTo(w)
}

type bufferedResponseWriter struct {
	header http.Header
	status int
	body   []byte
}

func (w *bufferedResponseWriter) Header() http.Header {
	return w.header
}

func (w *bufferedResponseWriter) WriteHeader(statusCode int) {
	if w.status != 0 {
		return
	}
	w.status = statusCode
}

func (w *bufferedResponseWriter) Write(p []byte) (int, error) {
	if w.status == 0 {
		w.status = http.StatusOK
	}
	w.body = append(w.body, p...)
	return len(p), nil
}

func (w *bufferedResponseWriter) flushTo(dst http.ResponseWriter) {
	for key, values := range w.header {
		for _, value := range values {
			dst.Header().Add(key, value)
		}
	}
	status := w.status
	if status == 0 {
		status = http.StatusOK
	}
	dst.WriteHeader(status)
	_, _ = dst.Write(w.body)
}
