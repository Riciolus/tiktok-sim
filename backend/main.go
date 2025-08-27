package main

import (
	"context"
	"log"
	"os"

	"tiktok-sim/backend/router"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
)

func main() {
    // Load .env
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}

	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		log.Fatal("DATABASE_URL not set")
	}

	// Connect to DB
	pool, err := pgxpool.New(context.Background(), dsn)
	if err != nil {
		log.Fatalf("Unable to connect: %v\n", err)
	}
	defer pool.Close()

	// Init router with DB
	r := router.SetupRouter(pool)
	r.Run(":8080")
}
