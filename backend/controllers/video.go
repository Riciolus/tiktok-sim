package controllers

import (
	"net/http"
	"tiktok-sim/backend/model" // replace with your module path

	"github.com/gin-gonic/gin"
)

func GetVideos(c *gin.Context) {
    videos := []model.Video{
        {ID: 1, Title: "Super Nayr", URL: "/videos/supernayrdf.mp4"},
        {ID: 2, Title: "Hungry Dog", URL: "/videos/hungrydogeatingbacon.mp4"},
        {ID: 3, Title: "Oline", URL: "/videos/oline.mp4"},
    }
    c.JSON(http.StatusOK, videos)
}
