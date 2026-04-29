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

// embeddedApp contains the built staff/admin app when the binary is built with
// -tags embed.
//
//go:embed embed/app
var embeddedApp embed.FS

func publicContentFS() (fs.FS, error) {
	return fs.Sub(embeddedPublic, "embed/public")
}

func appContentFS() (fs.FS, error) {
	return fs.Sub(embeddedApp, "embed/app")
}
