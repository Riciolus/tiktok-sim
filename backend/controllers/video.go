package controllers

import (
	"context"
	"net/http"

	"tiktok-sim/backend/model"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
)

type VideoController struct {
	DB *pgxpool.Pool
}

func (vc *VideoController) GetVideos(c *gin.Context) {
	rows, err := vc.DB.Query(context.Background(), `
		SELECT
			v.id, v.filename, v.url, v.caption, v.tags, v.created_at,
			u.id, u.username, u.avatar, u.created_at,
			COALESCE(s.likes, 0), COALESCE(s.comments, 0),
			COALESCE(s.shares, 0), COALESCE(s.views, 0)
		FROM videos v
		JOIN users u ON v.uploader_id = u.id
		LEFT JOIN video_stats s ON v.id = s.video_id
		ORDER BY v.created_at DESC
		LIMIT 20
	`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	videos := []model.Video{}
	for rows.Next() {
		var v model.Video
		err := rows.Scan(
			&v.ID, &v.Filename, &v.URL, &v.Caption, &v.Tags, &v.CreatedAt,
			&v.Uploader.ID, &v.Uploader.Username, &v.Uploader.Avatar, &v.Uploader.CreatedAt,
			&v.Stats.Likes, &v.Stats.Comments, &v.Stats.Shares, &v.Stats.Views,
		)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		videos = append(videos, v)
	}

	c.JSON(http.StatusOK, gin.H{"videos": videos})
}