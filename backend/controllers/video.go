package controllers

import (
	"net/http"
	"tiktok-sim/backend/model"

	"github.com/gin-gonic/gin"
)

func GetVideos(c *gin.Context) {
    videos := []model.Video{
		{
			ID:       "vid_5",
			Filename: "supernayrdf.mp4",
			URL:      "/videos/supernayrdf.mp4",
			Caption:  "Tes 123 🎤✨",
			Uploader: model.User{
				ID:       "user_5",
				Username: "ella",
				Avatar:   "/avatars/ella.png",
			},
			Stats: model.VideoStats{
				Likes:    2817,
				Comments: 127,
				Shares:   89,
				Views:    30000,
			},
			Tags:      []string{"JKT48", "cover", "singing"},
			CreatedAt: "2025-08-20T20:15:00Z",
		},
        {
			ID:       "vid_3",
			Filename: "hungrydogeatingbacon.mp4",
			URL:      "/videos/hungrydogeatingbacon.mp4",
			Caption:  "Tes 123 🎤✨",
			Uploader: model.User{
				ID:       "user_5",
				Username: "ella",
				Avatar:   "/avatars/ella.png",
			},
			Stats: model.VideoStats{
				Likes:    2817,
				Comments: 127,
				Shares:   89,
				Views:    30000,
			},
			Tags:      []string{"JKT48", "cover", "singing"},
			CreatedAt: "2025-08-20T20:15:00Z",
		},
	}
    c.JSON(http.StatusOK, videos)
}
