package model

import "time"

// User struct maps to the "users" table
type User struct {
    ID        string    `json:"id"`        // UUID stored as string
    Username  string    `json:"username"`
    Avatar    *string   `json:"avatar,omitempty"` // optional (nullable)
    CreatedAt time.Time `json:"created_at"`
}
