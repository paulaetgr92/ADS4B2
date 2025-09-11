package service

import (
	"awesomeProject/Internal_temp/model"
	Repository "awesomeProject/Internal_temp/repository"
	db "awesomeProject/db/sqlc"
	"context"
	"database/sql"
)

type CadastroService struct {
	Repo Repository.CadastroRepositoryInterface
	R    Repository.SellerRepositoryInterface
}

func NewCadastroService(cadastroRepo Repository.CadastroRepositoryInterface, sellerRepo Repository.SellerRepositoryInterface) *CadastroService {
	return &CadastroService{
		Repo: cadastroRepo,
		R:    sellerRepo,
	}
}
func (s *CadastroService) CreateCadastro(ctx context.Context, data model.CadastroRequest) (db.Cadastro, error) {
	arg := db.CreateCadastroParams{
		Name: data.Name,
		Cnpj: sql.NullString{
			String: data.CNPJ,
			Valid:  true,
		},
		Cpf: sql.NullString{
			String: data.CPF,
			Valid:  true,
		},
		Email:    data.Email,
		Celular:  data.Celular,
		Password: data.Password,
		Status:   data.PayloadDTO.Status,
	}

	cadastro, err := s.Repo.CreateCadastroRepository(ctx, arg)
	if err != nil {
		return cadastro, err
	}

	err = s.R.UpdateSellerStatus(ctx, db.UpdateCadastroStatusParams{
		ActivationCode: sql.NullString{
			Valid: true,
		},
		Status: data.PayloadDTO.Status,
	})
	return cadastro, nil
}
