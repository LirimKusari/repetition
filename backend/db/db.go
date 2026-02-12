package db

import (
	"context"
	"fmt"
	"log"

	"github.com/jackc/pgx/v5/pgxpool"
)

var Pool *pgxpool.Pool

func Connect(databaseURL string) error {
	var err error
	Pool, err = pgxpool.New(context.Background(), databaseURL)
	if err != nil {
		return fmt.Errorf("unable to connect to database: %w", err)
	}

	// Test the connection
	if err := Pool.Ping(context.Background()); err != nil {
		return fmt.Errorf("unable to ping database: %w", err)
	}

	log.Println("Connected to PostgreSQL database")
	return nil
}

func Close() {
	if Pool != nil {
		Pool.Close()
	}
}

func RunMigrations() error {
	ctx := context.Background()

	// Create groups table
	_, err := Pool.Exec(ctx, `
		CREATE TABLE IF NOT EXISTS groups (
			id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
			name VARCHAR(255) NOT NULL,
			created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
		)
	`)
	if err != nil {
		return fmt.Errorf("failed to create groups table: %w", err)
	}

	// Create cards table
	_, err = Pool.Exec(ctx, `
		CREATE TABLE IF NOT EXISTS cards (
			id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
			front TEXT NOT NULL,
			back TEXT NOT NULL,
			box INTEGER NOT NULL DEFAULT 1,
			weight DOUBLE PRECISION NOT NULL DEFAULT 1.0,
			group_id UUID REFERENCES groups(id) ON DELETE SET NULL,
			created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
		)
	`)
	if err != nil {
		return fmt.Errorf("failed to create cards table: %w", err)
	}

	// Create index on group_id for faster lookups
	_, err = Pool.Exec(ctx, `
		CREATE INDEX IF NOT EXISTS idx_cards_group_id ON cards(group_id)
	`)
	if err != nil {
		return fmt.Errorf("failed to create index: %w", err)
	}

	log.Println("Database migrations completed")
	return nil
}
