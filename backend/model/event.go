package model

import "time"

type Event struct {
    ID        int64     `json:"id"`
    UserID    string    `json:"user_id"`
    VideoID   string    `json:"video_id"`
    EventType string    `json:"event_type"`
    CreatedAt time.Time `json:"created_at"`
}
