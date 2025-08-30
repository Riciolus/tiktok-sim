package controllers

import (
	"context"
	"net/http"
	"tiktok-sim/backend/model"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
)

type UserController struct {
	DB *pgxpool.Pool
}

func (uc *UserController) CreateUser (c *gin.Context) {
	type RequestBody struct {
      Username string `json:"username"`
      Avatar   string `json:"avatar"`
  }
	var body  RequestBody

	if err := c.ShouldBindJSON(&body); err != nil {
      c.JSON(400, gin.H{"error": "invalid request"})
      return
  }

	var user model.User 
	err := uc.DB.QueryRow(context.Background(), `
	INSERT INTO users (username, avatar)
	VALUES ($1, $2) 
	RETURNING id, username, avatar, created_at`,
	body.Username, body.Avatar,
	).Scan(&user.ID, &user.Username, &user.Avatar, &user.CreatedAt)

	if err != nil {
      c.JSON(500, gin.H{"error": err.Error()})
      return
	}	

	c.JSON(http.StatusOK, user)
}

func (uc *UserController) GetUser (c *gin.Context) {
	rows, err := uc.DB.Query(context.Background(), `
	SELECT
		u.id, u.username, u.avatar, u.created_at
	FROM users u
	`)
	if (err != nil) {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	var users []model.User

	for rows.Next() {
		var user model.User
		err := rows.Scan(&user.ID, &user.Username, &user.Avatar, &user.CreatedAt)
		if err != nil {
					c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
					return
				}
				users = append(users, user)
		}

		c.JSON(http.StatusOK, gin.H{"data": users})
}