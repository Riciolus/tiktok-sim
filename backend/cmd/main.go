package main

import (
	"github.com/tiktok-sim/backend/internal/api"
)

func main() {
	r := api.SetupRouter()
	r.Run(":8080")
}
