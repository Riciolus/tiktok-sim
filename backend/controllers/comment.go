package controllers

import (
	"context"
	"net/http"
	"tiktok-sim/backend/model"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
)

type CommentController struct {
	DB *pgxpool.Pool
}

func (cc *CommentController) CreateComment (c *gin.Context) {
	videoID := c.Param("video_id")

	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized", "user_id": userID})
		return
	}

	c.JSON(http.StatusOK, gin.H{"videoId": videoID, "userID": userID})
}

func (cc *CommentController) GetCommentsByVideo (c *gin.Context) {
	videoID := c.Param("video_id")

	rows, err := cc.DB.Query(context.Background(), `
	SELECT
	c.id AS comment_id,
	c.video_id AS video_id,
	c.content,
	c.created_at,
	c.user_id AS author_id,
	u.username AS author_username,
	u.avatar AS author_avatar
	FROM comments c
	JOIN users u ON c.user_id = u.id
	WHERE c.video_id = $1
	ORDER BY c.created_at DESC
	`, 
	videoID)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	var comments []model.CommentResponse
	for rows.Next() {
		var (
			id        string
			video_id  string
			content   string
			createdAt time.Time
			userID    string
			username  string
			avatarURL *string
		)

		if err := rows.Scan(&id, &video_id, &content, &createdAt, &userID, &username, &avatarURL); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		comments = append(comments, model.CommentResponse{
			ID:        id,
			VideoID:   video_id, 
			Content:   content,
			CreatedAt: createdAt,
			Author: model.Author{
				ID:        userID,
				Username:  username,
				AvatarURL: avatarURL,
			},
		})
	}

	if err := rows.Err(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, comments)
}