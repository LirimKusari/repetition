package handlers

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/wsr/backend/services"
)

type AnswerRequest struct {
	CardID  string `json:"card_id" binding:"required"`
	Correct bool   `json:"correct"`
}

func GetNextCard(c *gin.Context) {
	card, err := services.GetNextCard(c.Request.Context())
	if err != nil {
		if errors.Is(err, services.ErrNoCards) {
			c.JSON(http.StatusNotFound, gin.H{"error": "No cards available for study"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get next card"})
		return
	}

	c.JSON(http.StatusOK, card)
}

func SubmitAnswer(c *gin.Context) {
	var req AnswerRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	cardID, err := uuid.Parse(req.CardID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid card ID"})
		return
	}

	card, err := services.ProcessAnswer(c.Request.Context(), cardID, req.Correct)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to process answer"})
		return
	}

	c.JSON(http.StatusOK, card)
}

func GetStats(c *gin.Context) {
	stats, err := services.GetStudyStats(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get stats"})
		return
	}

	c.JSON(http.StatusOK, stats)
}
