package services

import "github.com/thrishalsundar/web-is-active/backend/models"

type Contracts interface {
	GetUser(string, string) (*models.User, error)
	NewUser(models.User) error
	AddSite(string, models.Site) (error, []models.Site)
	RemoveSite(string, string) (error, []models.Site)
	CheckActiveAndUpdate(string, string) (*models.Site, error)
}
