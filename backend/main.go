package main

import (
	"log"

	"github.com/gin-gonic/gin"
	"github.com/wsr/backend/config"
	"github.com/wsr/backend/db"
	"github.com/wsr/backend/handlers"
	"github.com/wsr/backend/middleware"
)

func main() {
	// Load configuration
	cfg := config.Load()

	// Connect to database
	if err := db.Connect(cfg.DatabaseURL); err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.Close()

	// Run migrations
	if err := db.RunMigrations(); err != nil {
		log.Fatalf("Failed to run migrations: %v", err)
	}

	// Setup Gin router
	r := gin.Default()

	// Apply CORS middleware
	r.Use(middleware.CORS())

	// API routes
	api := r.Group("/api")
	{
		// Cards routes
		cards := api.Group("/cards")
		{
			cards.GET("", handlers.GetCards)
			cards.GET("/:id", handlers.GetCard)
			cards.POST("", handlers.CreateCard)
			cards.PUT("/:id", handlers.UpdateCard)
			cards.DELETE("/:id", handlers.DeleteCard)
		}

		// Groups routes
		groups := api.Group("/groups")
		{
			groups.GET("", handlers.GetGroups)
			groups.GET("/:id", handlers.GetGroup)
			groups.POST("", handlers.CreateGroup)
			groups.PUT("/:id", handlers.UpdateGroup)
			groups.DELETE("/:id", handlers.DeleteGroup)
		}

		// Study routes
		study := api.Group("/study")
		{
			study.GET("/next", handlers.GetNextCard)
			study.POST("/answer", handlers.SubmitAnswer)
			study.GET("/stats", handlers.GetStats)
		}
	}

	// Start server
	log.Printf("Server starting on port %s", cfg.Port)
	if err := r.Run(":" + cfg.Port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
