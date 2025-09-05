package middleware

import (
	"fmt"
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

// AuthMiddleware checks for access token
func AuthMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        authHeader := c.GetHeader("Authorization")
        if authHeader == "" {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "missing token"})
            c.Abort()
            return
        }

        tokenString := strings.TrimPrefix(authHeader, "Bearer ")
        token, err := jwt.Parse(tokenString, func(t *jwt.Token) (interface{}, error) {
            if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
                return nil, fmt.Errorf("unexpected signing method")
            }
            return []byte(os.Getenv("JWT_SECRET")), nil
        })

        if err != nil || !token.Valid {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid token"})
            c.Abort()
            return
        }

        claims, ok := token.Claims.(jwt.MapClaims)
        if !ok || claims["user_id"] == nil {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid claims"})
            c.Abort()
            return
        }

        // Save user_id in context for handlers
        c.Set("user_id", claims["user_id"].(string))
        c.Next()
    }
}
