package router

import (
    "github.com/gin-gonic/gin"
    "tiktok-sim/backend/controllers"
)

func SetupRouter() *gin.Engine {
    r := gin.Default()

    // Serve static files
    r.Static("/videos", "./videos")

    // API routes
    api := r.Group("/api")
    {
        api.GET("/videos", controllers.GetVideos)
        // add more routes here, e.g., api.POST("/videos"), etc.
    }

    return r
}
