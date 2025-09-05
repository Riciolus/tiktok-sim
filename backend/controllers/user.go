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



func (uc *UserController) GetUser (c *gin.Context) {
	rows, err := uc.DB.Query(context.Background(), `
	SELECT
		*
	FROM users s
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