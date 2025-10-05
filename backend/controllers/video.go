package controllers

import (
	"context"
	"net/http"

	"tiktok-sim/backend/model"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"

	"github.com/jackc/pgx/v5/pgxpool"
)

type VideoController struct {
	DB *pgxpool.Pool
}

func (vc *VideoController) GetVideos(c *gin.Context) {
	rows, err := vc.DB.Query(context.Background(), `
	SELECT
	v.id,
	v.filename,
	v.url,
	v.caption,
	v.tags,
	v.created_at,
	u.id,
	u.username,
	u.avatar,
	COALESCE(s.likes, 0),
	COALESCE(s.comments, 0),
	COALESCE(s.shares, 0),
	COALESCE(s.views, 0),
	COALESCE(ua.liked, false),
	COALESCE(ua.bookmarked, false)
	FROM videos v
	JOIN users u ON v.uploader_id = u.id
	LEFT JOIN video_stats s ON v.id = s.video_id
	LEFT JOIN users_video_actions ua ON v.id = ua.video_id
	ORDER BY v.created_at DESC
	LIMIT 20;
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
			&v.ID,
			&v.Filename,
			&v.URL,
			&v.Caption,
			&v.Tags,
			&v.CreatedAt,
			&v.Uploader.ID,
			&v.Uploader.Username,
			&v.Uploader.Avatar,
			&v.Stats.Likes,
			&v.Stats.Comments,
			&v.Stats.Shares,
			&v.Stats.Views,
			&v.UserAction.Liked,
			&v.UserAction.Bookmarked,
		)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		videos = append(videos, v)
	}

	c.JSON(http.StatusOK, gin.H{"videos": videos})
}

func (vc *VideoController) CreateVideo(c *gin.Context) {
	// 1. Get user_id from context
	userID, ok := c.Get("user_id")
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}
	userIDStr, ok := userID.(string)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "invalid user id type"})
		return
	}

	uploaderID, err := uuid.Parse(userIDStr)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "invalid uuid format"})
		return
	}

	// 2. Bind request body into DTO
	type CreateVideoDTO struct {
		Filename string   `json:"filename"`
		URL      string   `json:"url"`
		Caption  string   `json:"caption"`
		Tags     []string `json:"tags"`
	}

	var body CreateVideoDTO
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request"})
		return
	}

	video := model.Video{
		Filename: body.Filename,
		URL:      body.URL,
		Caption:  body.Caption,
		Tags:     body.Tags,
		Uploader: model.UserPreview{ID: uploaderID.String()},
		Stats:    model.VideoStats{},
	}

	// 3. Insert into DB
	err = vc.DB.QueryRow(context.Background(), `
        INSERT INTO videos (uploader_id, filename, url, caption, tags)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, created_at
    `, uploaderID, body.Filename, body.URL, body.Caption, body.Tags).
		Scan(&video.ID, &video.CreatedAt)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// 5. Insert video stats
	_, err = vc.DB.Exec(context.Background(), `
        INSERT INTO video_stats (video_id)
        VALUES ($1)
    `, video.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// 4. Build full response object
	video.Filename = body.Filename
	video.URL = body.URL
	video.Caption = body.Caption
	video.Tags = body.Tags

	c.JSON(http.StatusOK, gin.H{"video": video})
}
