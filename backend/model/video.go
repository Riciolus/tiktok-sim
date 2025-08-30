package model

import "time"

type Video struct {
	ID        string    `json:"id"`
	Filename  string    `json:"filename"`
	URL       string    `json:"url"`
	Caption   string    `json:"caption"`
	Tags      []string  `json:"tags"`
	CreatedAt time.Time `json:"createdAt"`

	// Relations
	Uploader User       `json:"uploader"`
	Stats    VideoStats `json:"stats"`
}

type VideoStats struct {
	Likes    int `json:"likes"`
	Comments int `json:"comments"`
	Shares   int `json:"shares"`
	Views    int `json:"views"`
}

type VideoEmbeddings struct {
	VideoID string `json:"video_id"`
	Embedding []float32 `json:"embedding"`
	GlobalPopularityScore float64 `json:"global_popularity_score"`
}


// still havent known the flow for this...
type Comment struct {
    ID        string    `json:"id"`
    VideoID   string    `json:"video_id"`
    UserID    string    `json:"user_id"`
    Content   string    `json:"content"`
    CreatedAt string    `json:"created_at"`
}

