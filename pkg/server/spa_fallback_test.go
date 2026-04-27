package server

import (
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestSPAFallbackHandlerPreservesPrimaryResponses(t *testing.T) {
	primary := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("X-Primary", "yes")
		w.WriteHeader(http.StatusCreated)
		_, _ = w.Write([]byte("primary body"))
	})
	fallback := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		t.Fatal("fallback should not be called for non-404 primary response")
	})

	rr := httptest.NewRecorder()
	spaFallbackHandler{primary: primary, fallback: fallback}.ServeHTTP(rr, httptest.NewRequest(http.MethodGet, "/api/ok", nil))

	if rr.Code != http.StatusCreated {
		t.Fatalf("status = %d, want 201", rr.Code)
	}
	if rr.Header().Get("X-Primary") != "yes" {
		t.Fatalf("missing primary header")
	}
	if rr.Body.String() != "primary body" {
		t.Fatalf("body = %q, want primary body", rr.Body.String())
	}
}

func TestSPAFallbackHandlerDelegatesPrimary404(t *testing.T) {
	primary := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("X-Primary", "discarded")
		http.NotFound(w, r)
	})
	fallback := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("X-Fallback", "yes")
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte("fallback body"))
	})

	rr := httptest.NewRecorder()
	spaFallbackHandler{primary: primary, fallback: fallback}.ServeHTTP(rr, httptest.NewRequest(http.MethodGet, "/shows/42", nil))

	if rr.Code != http.StatusOK {
		t.Fatalf("status = %d, want 200", rr.Code)
	}
	if rr.Header().Get("X-Fallback") != "yes" {
		t.Fatalf("missing fallback header")
	}
	if rr.Header().Get("X-Primary") != "" {
		t.Fatalf("primary 404 header leaked into fallback response")
	}
	if rr.Body.String() != "fallback body" {
		t.Fatalf("body = %q, want fallback body", rr.Body.String())
	}
}

func TestSPAFallbackHandlerDefaultsImplicitPrimaryOK(t *testing.T) {
	primary := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		_, _ = w.Write([]byte("implicit ok"))
	})
	fallback := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		t.Fatal("fallback should not be called when primary writes a body")
	})

	rr := httptest.NewRecorder()
	spaFallbackHandler{primary: primary, fallback: fallback}.ServeHTTP(rr, httptest.NewRequest(http.MethodGet, "/api/implicit", nil))

	if rr.Code != http.StatusOK {
		t.Fatalf("status = %d, want 200", rr.Code)
	}
	if rr.Body.String() != "implicit ok" {
		t.Fatalf("body = %q, want implicit ok", rr.Body.String())
	}
}
