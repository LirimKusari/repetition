package services

import (
	"context"
	"errors"
	"math/rand"

	"github.com/google/uuid"
	"github.com/wsr/backend/models"
)

const (
	DecayRate = 0.5 // Weight multiplier when answering correctly
)

var (
	ErrNoCards = errors.New("no cards available for study")
)

// GetNextCard selects a card based on weighted probability (WSR algorithm)
func GetNextCard(ctx context.Context) (*models.Card, error) {
	cards, err := models.GetAllCards(ctx)
	if err != nil {
		return nil, err
	}

	if len(cards) == 0 {
		return nil, ErrNoCards
	}

	// Calculate total weight
	totalWeight := 0.0
	for _, card := range cards {
		totalWeight += card.Weight
	}

	// Random selection based on weights
	random := rand.Float64() * totalWeight
	cumulative := 0.0

	for i := range cards {
		cumulative += cards[i].Weight
		if random <= cumulative {
			return &cards[i], nil
		}
	}

	// Fallback to last card (should rarely happen)
	return &cards[len(cards)-1], nil
}

// ProcessAnswer adjusts weight and box based on user's self-assessment
func ProcessAnswer(ctx context.Context, cardID uuid.UUID, correct bool) (*models.Card, error) {
	card, err := models.GetCardByID(ctx, cardID)
	if err != nil {
		return nil, err
	}

	if correct {
		// Decay weight, move to higher box (max box 6)
		card.Weight *= DecayRate
		if card.Box < 6 {
			card.Box++
		}
		// Ensure weight doesn't go below minimum
		minWeight := models.GetBoxWeight(card.Box)
		if card.Weight < minWeight {
			card.Weight = minWeight
		}
	} else {
		// Reset to box 1 with full weight
		card.Box = 1
		card.Weight = models.GetBoxWeight(1)
	}

	// Update the card in database
	err = models.UpdateCardWeightAndBox(ctx, cardID, card.Weight, card.Box)
	if err != nil {
		return nil, err
	}

	// Fetch updated card to return
	return models.GetCardByID(ctx, cardID)
}

// GetStats returns study statistics
type StudyStats struct {
	TotalCards   int            `json:"total_cards"`
	CardsByBox   map[int]int    `json:"cards_by_box"`
	AverageBox   float64        `json:"average_box"`
	TotalWeight  float64        `json:"total_weight"`
}

func GetStudyStats(ctx context.Context) (*StudyStats, error) {
	cards, err := models.GetAllCards(ctx)
	if err != nil {
		return nil, err
	}

	stats := &StudyStats{
		TotalCards: len(cards),
		CardsByBox: make(map[int]int),
	}

	if len(cards) == 0 {
		return stats, nil
	}

	totalBox := 0
	for _, card := range cards {
		stats.CardsByBox[card.Box]++
		stats.TotalWeight += card.Weight
		totalBox += card.Box
	}

	stats.AverageBox = float64(totalBox) / float64(len(cards))

	return stats, nil
}
