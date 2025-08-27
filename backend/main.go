package main

import (
    "tiktok-sim/backend/router"
)

func main() {
    r := router.SetupRouter()
    r.Run(":8080")
}
