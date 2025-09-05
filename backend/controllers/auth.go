package controllers

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"tiktok-sim/backend/model"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"golang.org/x/crypto/bcrypt"
)

type AuthController struct {
	DB *pgxpool.Pool
}

func (uc *AuthController) Register (c *gin.Context) {
	type RequestBody struct {
      Username string `json:"username"`
			Email string `json:"email"`
			DisplayName string `json:"display_name"`
			Password string `json:"password"`
			Avatar   string `json:"avatar"`
  }
	var body  RequestBody

	if err := c.ShouldBindJSON(&body); err != nil {
      c.JSON(400, gin.H{"error": "invalid request"})
      return
		}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(body.Password), bcrypt.DefaultCost)
if err != nil {
    c.JSON(500, gin.H{"error": "failed to hash password"})
    return
}

var user model.User
err = uc.DB.QueryRow(context.Background(), `
    INSERT INTO users (username, email, display_name, password_hash, avatar)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, username, avatar, created_at`,
    body.Username,
    body.Email,
    body.DisplayName,
    string(hashedPassword), // ✅ convert []byte → string
    body.Avatar,
).Scan(&user.ID, &user.Username, &user.Avatar, &user.CreatedAt)

if err != nil {
    // Example: duplicate email or username
    c.JSON(400, gin.H{"error": err.Error()})
    return
}

c.JSON(201, gin.H{
    "id":        user.ID,
    "username":  user.Username,
    "avatar":    user.Avatar,
    "createdAt": user.CreatedAt,
})
}

func (ac *AuthController) Login (c *gin.Context) {
	type RequestBody struct {
        Email    string `json:"email"`
        Password string `json:"password"`
    }
    var body RequestBody

    if err := c.ShouldBindJSON(&body); err != nil {
        c.JSON(400, gin.H{"error": "invalid request"})
        return
    }

		var user model.User
		err := ac.DB.QueryRow(context.Background(), `
		SELECT id, username, email, password_hash, avatar, created_at
		FROM users
		WHERE email = $1
		`, body.Email).Scan(&user.ID, &user.Username, &user.Email, &user.PasswordHash, &user.Avatar, &user.CreatedAt)

		if err != nil {
        c.JSON(401, gin.H{"error": "invalid email or password"})
        return
    }

		// Compare Password
		 err = bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(body.Password))
    if err != nil {
        c.JSON(401, gin.H{"error": "invalid email or password"})
        return
    }

		// Generate Access Token (short lived)
    accessToken := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
        "user_id": user.ID,
        "exp":     time.Now().Add(15 * time.Minute).Unix(), // 15m expiry
    })

    secret := []byte(os.Getenv("JWT_SECRET"))
     accessTokenString, err := accessToken.SignedString(secret)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create token"})
        return
    }

		// Generate Refresh Token (longer lived)
    refreshToken := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
        "user_id": user.ID,
        "exp":     time.Now().Add(7 * 24 * time.Hour).Unix(), // 7 days
    })
    refreshTokenString, err := refreshToken.SignedString(secret)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create refresh token"})
        return
    }

    // Set refresh token as HttpOnly cookie
    c.SetCookie("refresh_token", refreshTokenString, 7*24*3600, "/", "", true, true)

    // Return response
    c.JSON(http.StatusOK, gin.H{
        "access_token": accessTokenString,
        "user": gin.H{
            "id":       user.ID,
            "username": user.Username,
            "avatar":   user.Avatar,
            "email":    user.Email,
        },
    })
 }

 func (ac *AuthController) Refresh(c *gin.Context) {
    // Get refresh token from cookie
    refreshToken, err := c.Cookie("refresh_token")
    if err != nil {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "no refresh token"})
        return
    }

    // Parse & validate refresh token
    token, err := jwt.Parse(refreshToken, func(t *jwt.Token) (interface{}, error) {
        if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
            return nil, fmt.Errorf("unexpected signing method")
        }
        return []byte(os.Getenv("JWT_SECRET")), nil
    })

    if err != nil || !token.Valid {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid refresh token"})
        return
    }

    // Extract claims
    claims, ok := token.Claims.(jwt.MapClaims)
    if !ok || claims["user_id"] == nil {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid token claims"})
        return
    }

    userID := claims["user_id"].(string)

    // ✅ Issue new access token
    accessToken := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
        "user_id": userID,
        "exp":     time.Now().Add(15 * time.Minute).Unix(), // new expiry
    })

    accessTokenString, err := accessToken.SignedString([]byte(os.Getenv("JWT_SECRET")))
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create new token"})
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "access_token": accessTokenString,
    })
}


func (ac *AuthController) Me(c *gin.Context) {
    userID, exists := c.Get("user_id")
    if !exists {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
        return
    }

    var user model.User
    err := ac.DB.QueryRow(context.Background(), `
        SELECT id, username, email, avatar, role, created_at
        FROM users
        WHERE id = $1
    `, userID).Scan(&user.ID, &user.Username, &user.Email, &user.Avatar, &user.Role, &user.CreatedAt)

    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch user"})
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "user": user,
    })
}

func (ac *AuthController) Logout(c *gin.Context) {
    // Clear the refresh token cookie
    c.SetCookie("refresh_token", "", -1, "/", "", true, true)
    c.JSON(http.StatusOK, gin.H{"message": "logged out"})
}
