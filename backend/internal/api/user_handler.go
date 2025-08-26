package api

import (
	"net/http"

	"github.com/tiktok-sim/backend/internal/service"
	"github.com/gin-gonic/gin"
)

func GetUser(c *gin.Context) {
    id := c.Param("id")

    user, err := service.GetUserByID(id)
    if err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, user)
}
