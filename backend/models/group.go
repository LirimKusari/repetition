package models

import (
	"context"
	"time"

	"github.com/google/uuid"
	"github.com/wsr/backend/db"
)

type Group struct {
	ID        uuid.UUID `json:"id"`
	Name      string    `json:"name"`
	CreatedAt time.Time `json:"created_at"`
}

type CreateGroupRequest struct {
	Name string `json:"name" binding:"required"`
}

type UpdateGroupRequest struct {
	Name string `json:"name" binding:"required"`
}

func GetAllGroups(ctx context.Context) ([]Group, error) {
	rows, err := db.Pool.Query(ctx, `
		SELECT id, name, created_at FROM groups ORDER BY created_at DESC
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var groups []Group
	for rows.Next() {
		var g Group
		if err := rows.Scan(&g.ID, &g.Name, &g.CreatedAt); err != nil {
			return nil, err
		}
		groups = append(groups, g)
	}

	return groups, nil
}

func GetGroupByID(ctx context.Context, id uuid.UUID) (*Group, error) {
	var g Group
	err := db.Pool.QueryRow(ctx, `
		SELECT id, name, created_at FROM groups WHERE id = $1
	`, id).Scan(&g.ID, &g.Name, &g.CreatedAt)
	if err != nil {
		return nil, err
	}
	return &g, nil
}

func CreateGroup(ctx context.Context, req CreateGroupRequest) (*Group, error) {
	var g Group
	err := db.Pool.QueryRow(ctx, `
		INSERT INTO groups (name) VALUES ($1)
		RETURNING id, name, created_at
	`, req.Name).Scan(&g.ID, &g.Name, &g.CreatedAt)
	if err != nil {
		return nil, err
	}
	return &g, nil
}

func UpdateGroup(ctx context.Context, id uuid.UUID, req UpdateGroupRequest) (*Group, error) {
	var g Group
	err := db.Pool.QueryRow(ctx, `
		UPDATE groups SET name = $1 WHERE id = $2
		RETURNING id, name, created_at
	`, req.Name, id).Scan(&g.ID, &g.Name, &g.CreatedAt)
	if err != nil {
		return nil, err
	}
	return &g, nil
}

func DeleteGroup(ctx context.Context, id uuid.UUID) error {
	_, err := db.Pool.Exec(ctx, `DELETE FROM groups WHERE id = $1`, id)
	return err
}
