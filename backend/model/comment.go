package model

import "time"

type Comment struct {
	ID        string 	`json:"id"`
	VideoID   string 	`json:"video_id"`
	UserID    string 	`json:"user_id"`
	Content   string 	`json:"content"`
	CreatedAt time.Time `json:"created_at"`
}

type Author struct {
	ID        string  `json:"id"`
	Username  string  `json:"username"`
	AvatarURL *string `json:"avatar_url,omitempty"`
}

// DTO
type CommentResponse struct {
	ID        string    `json:"id"`
	VideoID   string	`json:"video_id "`
	Content   string    `json:"content"`
	CreatedAt time.Time `json:"created_at"`
	Author    Author    `json:"author"`
}