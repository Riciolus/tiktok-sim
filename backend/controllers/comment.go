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

func (cc *CommentController) CreateComment(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized", "user_id": userID})
		return
	}

	videoID := c.Param("video_id")
	if videoID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "missing video_id"})
		return
	}

	var body struct {
		Content string `json:"content" binding:"required"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(400, gin.H{"error": "invalid request"})
		return
	}

	var comment model.Comment
	var author model.Author

	tx, err := cc.DB.Begin(context.Background())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to start transaction"})
		return
	}

	defer tx.Rollback(context.Background())

	err = tx.QueryRow(context.Background(),
		`
					INSERT INTO comments (video_id, user_id, content, created_at)
					VALUES ($1, $2, $3, NOW())
					RETURNING id, video_id, user_id, content, created_at
				`,
		videoID,
		userID,
		body.Content,
	).Scan(&comment.ID, &comment.VideoID, &comment.UserID, &comment.Content, &comment.CreatedAt)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to insert comment"})
		return
	}

	_, err = tx.Exec(context.Background(),
		`UPDATE video_stats SET comments = comments + 1 WHERE video_id = $1`,
		videoID,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update video stats"})
		return
	}

	err = tx.QueryRow(context.Background(),
		`
		SELECT id, username, avatar FROM users WHERE id = $1
	`,
		userID,
	).Scan(&author.ID, &author.Username, &author.AvatarURL)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch author info"})
		return
	}

	if err = tx.Commit(context.Background()); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to commit transaction"})
		return
	}

	response := model.CommentResponse{
		ID:        comment.ID,
		VideoID:   comment.VideoID,
		Content:   comment.Content,
		CreatedAt: comment.CreatedAt,
		Author:    author,
	}

	c.JSON(http.StatusOK, response)
}

func (cc *CommentController) GetCommentsByVideo(c *gin.Context) {
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
