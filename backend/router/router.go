package router

import (
	"tiktok-sim/backend/controllers"
	"tiktok-sim/backend/middleware"
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
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Serve static files
	r.Static("/videos", "./videos")

	// API routes
	api := r.Group("/api")
	{
		vc := &controllers.VideoController{DB: pool}
		uc := &controllers.UserController{DB: pool}
		ec := &controllers.EventController{DB: pool}
		ac := &controllers.AuthController{DB: pool}

		// USERS
		api.GET("/user", uc.GetUser)

		// AUTH
		auth := api.Group("/auth")
		{
			auth.POST("/login", ac.Login)
			auth.POST("/logout", ac.Logout)
			auth.POST("/register", ac.Register)
			auth.POST("/refresh", ac.Refresh)
			auth.GET("/me", middleware.AuthMiddleware(), ac.Me)
			// (Optional, for scaling later)
			// auth.GET("/session", authController.Session)
		}
		// VIDEOS
		api.GET("/videos", vc.GetVideos)

		// EVENTS
		api.POST("/events", ec.CreateEvent)
	}

	return r
}
