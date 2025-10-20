package controllers

import (
	"context"
	"net/http"
	"tiktok-sim/backend/model"

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
	SELECT *
	FROM comments
	WHERE video_id = $1
	ORDER BY created_at DESC
	`, videoID)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	comments := []model.Comment{}
	for rows.Next() {
		var cmt model.Comment
		err := rows.Scan(
			&cmt.ID,
			&cmt.VideoID,
			&cmt.UserID,
			&cmt.Content,
			&cmt.CreatedAt,
		)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		comments = append(comments, cmt)
	}

	c.JSON(http.StatusOK, gin.H{"comments": comments})
}