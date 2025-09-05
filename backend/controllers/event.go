package controllers

import (
	"context"
	"net/http"
	"tiktok-sim/backend/model"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
)

type EventController struct {
	DB *pgxpool.Pool
}

func (ec *EventController) CreateEvent(c *gin.Context) {
    var body model.Event

    if err := c.ShouldBindJSON(&body); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request"})
        return
    }

    tx, err := ec.DB.Begin(context.Background())
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    defer tx.Rollback(context.Background())

    // insert event
    err = tx.QueryRow(context.Background(), `
        INSERT INTO events (user_id, video_id, event_type)
        VALUES ($1, $2, $3)
        RETURNING id, user_id, video_id, event_type, created_at`,
        body.UserID, body.VideoID, body.EventType,
    ).Scan(&body.ID, &body.UserID, &body.VideoID, &body.EventType, &body.CreatedAt)

    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    // update stats
    switch body.EventType {
    case "watch":
        _, err = tx.Exec(context.Background(),
            "UPDATE video_stats SET views = views + 1 WHERE video_id = $1",
            body.VideoID)
    case "like":
        _, err = tx.Exec(context.Background(),
            "UPDATE video_stats SET likes = likes + 1 WHERE video_id = $1",
            body.VideoID)
        
        if err == nil {
        // mark user has liked this video
        _, err = tx.Exec(context.Background(), `
            INSERT INTO user_video_actions (user_id, video_id, liked, updated_at)
            VALUES ($1, $2, true, now())
            ON CONFLICT (user_id, video_id)
            DO UPDATE SET liked = true, updated_at = now()
        `, body.UserID, body.VideoID)
    }
    case "share":
        _, err = tx.Exec(context.Background(),
            "UPDATE video_stats SET shares = shares + 1 WHERE video_id = $1",
            body.VideoID)
    case "bookmark":
        _, err = tx.Exec(context.Background(), `
            INSERT INTO user_video_actions (user_id, video_id, bookmarked, updated_at)
            VALUES ($1, $2, true, now())
            ON CONFLICT (user_id, video_id)
            DO UPDATE SET bookmarked = true, updated_at = now()
        `, body.UserID, body.VideoID)

    case "skip":
        _, err = tx.Exec(context.Background(),
            "UPDATE video_stats SET skips = skips + 1 WHERE video_id = $1",
            body.VideoID)
    }

    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    // commit transaction
    if err := tx.Commit(context.Background()); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{"data": body})
}


