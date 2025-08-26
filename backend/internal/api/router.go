package api

import (
	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	
	r := gin.Default()
	userGroup := r.Group("/users")
	{
		userGroup.GET("/:id", GetUser)
    // userGroup.POST("/", CreateUser)
    // userGroup.PUT("/:id", UpdateUser)
    // userGroup.DELETE("/:id", DeleteUser)
	}

	return r
}
