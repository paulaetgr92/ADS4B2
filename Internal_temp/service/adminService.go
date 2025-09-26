package service

import (
	"awesomeProject/Internal_temp/model"
	Repository "awesomeProject/Internal_temp/repository"
	db "awesomeProject/db/sqlc"
	"context"
)

type AdminService struct {
	Repo Repository.AdminNewRepository
}

func NewAdminService(r Repository.AdminNewRepository) *AdminService {
	return &AdminService{Repo: r}
}

func (r *AdminService) CreateAdminService(ctx context.Context, data model.AdminRequest) error {
	arg := db.CreateAdminParams{
		Cnpj:     data.Cnpj,
		Name:     data.Name,
		Email:    data.Email,
		Password: data.Password,
	}

	_, err := r.Repo.CreateAdmin(ctx, arg)
	return err
}

func (r *AdminService) LoginAdminService(ctx context.Context, data model.LoginRequest) error {
	arg := db.CreateLoginParams{
		Email:    data.Email,
		Password: data.Password,
	}
	_, err := r.Repo.LoginNewAdmin(ctx, arg)
	return err
}
