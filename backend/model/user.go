package model

type User struct {
	ID       string `json:"id"`
	Username string `json:"username"`
	Avatar   string `json:"avatar"`
}

type VideoStats struct {
	Likes    int `json:"likes"`
	Comments int `json:"comments"`
	Shares   int `json:"shares"`
	Views    int `json:"views"`
}

type Video struct {
	ID        string     `json:"id"`
	Filename  string     `json:"filename"`
	URL       string     `json:"url"`
	Caption   string     `json:"caption"`
	Uploader  User       `json:"uploader"`
	Stats     VideoStats `json:"stats"`
	Tags      []string   `json:"tags"`
	CreatedAt string     `json:"createdAt"` // ISO8601 timestamp
}
