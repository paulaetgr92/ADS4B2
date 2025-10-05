package service

import (
	"awesomeProject/Internal_temp/model"
	db "awesomeProject/db/sqlc"
	"context"
)

type CadastroServiceInterface interface {
	CreateCadastro(ctx context.Context, data model.CadastroRequest) (db.Cadastro, error)
	VerifySeller(ctx context.Context, data model.TwillioModelRequest) error
}

type TokenServiceInterface interface {
	GetUserTokensHist(ctx context.Context, payload model.PayloadDTO) error
}

type LoginServiceinterface interface {
	LoginUser(ctx context.Context, data model.LoginRequest) (string, error)
	CreateLoginUser(ctx context.Context, data model.LoginRequest) (db.Cadastro, error)
}

type ProdutoServiceInterface interface {
	CreateProduct(ctx context.Context, data model.ProdutosRequest) (int64, error)
	GetProdutoByIdService(ctx context.Context, id int64) (model.GetProdutosByIdResponse, error)
	ListProdutoService(ctx context.Context) ([]model.ProdutosResponse, error)
	UpdateProdutoByIdService(ctx context.Context, id int64, data model.ProdutosRequest) (model.ProdutosResponse, error)
	DeleteProdutoByIdService(ctx context.Context, data int64) error
}

type AdminServiceInterface interface {
	CreateAdminService(ctx context.Context, data model.AdminRequest) error
	LoginAdminService(ctx context.Context, data model.LoginRequest) error
}
