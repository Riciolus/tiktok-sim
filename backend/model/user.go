package model

import "time"

type User struct {
    ID           string     `json:"id"`                       // UUID
    Username     string     `json:"username"`
    Email        string     `json:"email"`
    DisplayName  *string    `json:"display_name,omitempty"`   // nullable
    Avatar       *string    `json:"avatar,omitempty"`         // nullable
    Role         string     `json:"role"`                     // e.g. "user", "admin"
    PasswordHash string     `json:"-"`                        // never expose in JSON
    CreatedAt    time.Time  `json:"created_at"`
    UpdatedAt    time.Time  `json:"updated_at"`
}

