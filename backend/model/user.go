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

type User struct {
	ID        string    `json:"id"`
	Username  string    `json:"username"`
	Avatar    string    `json:"avatar"`
	CreatedAt time.Time `json:"createdAt"`
}

type VideoStats struct {
	Likes    int `json:"likes"`
	Comments int `json:"comments"`
	Shares   int `json:"shares"`
	Views    int `json:"views"`
}
