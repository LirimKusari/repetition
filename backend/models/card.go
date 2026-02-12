package models

import (
	"context"
	"time"

	"github.com/google/uuid"
	"github.com/wsr/backend/db"
)

type Card struct {
	ID        uuid.UUID  `json:"id"`
	Front     string     `json:"front"`
	Back      string     `json:"back"`
	Box       int        `json:"box"`
	Weight    float64    `json:"weight"`
	GroupID   *uuid.UUID `json:"group_id"`
	CreatedAt time.Time  `json:"created_at"`
	UpdatedAt time.Time  `json:"updated_at"`
}

type CreateCardRequest struct {
	Front   string     `json:"front" binding:"required"`
	Back    string     `json:"back" binding:"required"`
	GroupID *uuid.UUID `json:"group_id"`
}

type UpdateCardRequest struct {
	Front   string     `json:"front"`
	Back    string     `json:"back"`
	GroupID *uuid.UUID `json:"group_id"`
}

// Box weight mapping based on WSR algorithm
var BoxWeights = map[int]float64{
	1: 1.0,
	2: 0.5,
	3: 0.25,
	4: 0.1,
	5: 0.05,
	6: 0.01,
}

func GetBoxWeight(box int) float64 {
	if w, ok := BoxWeights[box]; ok {
		return w
	}
	// For boxes > 6, return minimum weight
	return 0.01
}

func GetAllCards(ctx context.Context) ([]Card, error) {
	rows, err := db.Pool.Query(ctx, `
		SELECT id, front, back, box, weight, group_id, created_at, updated_at 
		FROM cards ORDER BY created_at DESC
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var cards []Card
	for rows.Next() {
		var c Card
		if err := rows.Scan(&c.ID, &c.Front, &c.Back, &c.Box, &c.Weight, &c.GroupID, &c.CreatedAt, &c.UpdatedAt); err != nil {
			return nil, err
		}
		cards = append(cards, c)
	}

	return cards, nil
}

func GetCardByID(ctx context.Context, id uuid.UUID) (*Card, error) {
	var c Card
	err := db.Pool.QueryRow(ctx, `
		SELECT id, front, back, box, weight, group_id, created_at, updated_at 
		FROM cards WHERE id = $1
	`, id).Scan(&c.ID, &c.Front, &c.Back, &c.Box, &c.Weight, &c.GroupID, &c.CreatedAt, &c.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return &c, nil
}

func CreateCard(ctx context.Context, req CreateCardRequest) (*Card, error) {
	var c Card
	err := db.Pool.QueryRow(ctx, `
		INSERT INTO cards (front, back, group_id, box, weight) 
		VALUES ($1, $2, $3, 1, 1.0)
		RETURNING id, front, back, box, weight, group_id, created_at, updated_at
	`, req.Front, req.Back, req.GroupID).Scan(&c.ID, &c.Front, &c.Back, &c.Box, &c.Weight, &c.GroupID, &c.CreatedAt, &c.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return &c, nil
}

func UpdateCard(ctx context.Context, id uuid.UUID, req UpdateCardRequest) (*Card, error) {
	var c Card
	err := db.Pool.QueryRow(ctx, `
		UPDATE cards SET 
			front = COALESCE(NULLIF($1, ''), front),
			back = COALESCE(NULLIF($2, ''), back),
			group_id = $3,
			updated_at = CURRENT_TIMESTAMP
		WHERE id = $4
		RETURNING id, front, back, box, weight, group_id, created_at, updated_at
	`, req.Front, req.Back, req.GroupID, id).Scan(&c.ID, &c.Front, &c.Back, &c.Box, &c.Weight, &c.GroupID, &c.CreatedAt, &c.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return &c, nil
}

func DeleteCard(ctx context.Context, id uuid.UUID) error {
	_, err := db.Pool.Exec(ctx, `DELETE FROM cards WHERE id = $1`, id)
	return err
}

func UpdateCardWeightAndBox(ctx context.Context, id uuid.UUID, weight float64, box int) error {
	_, err := db.Pool.Exec(ctx, `
		UPDATE cards SET weight = $1, box = $2, updated_at = CURRENT_TIMESTAMP
		WHERE id = $3
	`, weight, box, id)
	return err
}
