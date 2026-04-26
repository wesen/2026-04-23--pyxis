//go:build embed

package web

import (
	"embed"
	"io/fs"
)

// embeddedPublic contains the built public user site when the binary is built
// with -tags embed.
//
//go:embed embed/public
var embeddedPublic embed.FS

func publicContentFS() (fs.FS, error) {
	return fs.Sub(embeddedPublic, "embed/public")
}
