package router

import (
	"tiktok-sim/backend/controllers"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
)

func SetupRouter(pool *pgxpool.Pool) *gin.Engine {
    r := gin.Default()

    // Allow CORS
    r.Use(cors.New(cors.Config{
        AllowOrigins:     []string{"http://localhost:3000"},
        AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
        AllowHeaders:     []string{"Origin", "Content-Type", "Accept"},
        ExposeHeaders:    []string{"Content-Length"},
        AllowCredentials: true,
        MaxAge: 12 * time.Hour,
    }))

    // Serve static files
    r.Static("/videos", "./videos")

    // API routes
    api := r.Group("/api")
    {
        vc := &controllers.VideoController{DB: pool}
        api.GET("/videos", vc.GetVideos)
        // add more routes here, e.g., api.POST("/videos"), etc.
    }

    return r
}
