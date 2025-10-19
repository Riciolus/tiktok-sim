package model

import "time"

type Comment struct {
	ID        string 	`json:"id"`
	VideoID   string 	`json:"video_id"`
	UserID    string 	`json:"user_id"`
	Content   string 	`json:"content"`
	CreatedAt time.Time `json:"created_at"`
}