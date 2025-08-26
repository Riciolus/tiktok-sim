package service

import (
	"github.com/tiktok-sim/backend/internal/model"
	"github.com/tiktok-sim/backend/internal/repository"
)

func GetUserByID(id string) (*model.User, error) {
	return repository.FindUserByID(id)
}

func CreateUser(name, email string) (*model.User, error) {
	user := &model.User{Name: name, Email: email}
	return repository.SaveUser(user)
}
