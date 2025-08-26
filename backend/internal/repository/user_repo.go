package repository

import (
	"fmt"

	"github.com/tiktok-sim/backend/internal/model"
)

var users = []*model.User{} // in-memory store for demo

func FindUserByID(id string) (*model.User, error) {
	for _, u := range users {
		if u.ID == id {
			return u, nil
		}
	}
	return nil, fmt.Errorf("user not found")
}

func SaveUser(user *model.User) (*model.User, error) {
	users = append(users, user)
	return user, nil
}

