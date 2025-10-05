package Repository

import (
	db "awesomeProject/db/sqlc"
	"context"
)

type CadastroRepositoryInterface interface {
	CreateCadastroRepository(ctx context.Context, arg db.CreateCadastroParams) (db.Cadastro, error)
	UpdateActivationCode(ctx context.Context, arg db.UpdateActivationCodeParams) error
}

type TokenHistRepositoryInterface interface {
	CreateTokenHist(ctx context.Context, arg db.CreateTokenHistParams) error
	GetUserTokensHist(ctx context.Context, arg db.GetUserTokensHistParams) (db.GetUserTokensHistRow, error)
}

type CreateLoginRepositoryInterface interface {
	GetLogin(ctx context.Context, arg string) (db.GetLoginRow, error)
	CreateLogin(ctx context.Context, arg db.CreateLoginParams) (db.Cadastro, error)
}

type SellerRepositoryInterface interface {
	UpdateSellerStatus(ctx context.Context, data db.UpdateCadastroStatusParams) error
	GetSellerByCNPJ(ctx context.Context, code string) (db.GetSellerByCNPJRow, error)
}
type ProdutoRepositoryInterface interface {
	DeleteProdutoByIdRepository(ctx context.Context, Id int64) error
	AtualizarProduto(ctx context.Context, arg db.AtualizarProdutoByIDParams) (db.Produto, error)
	GetProdutoByIdRepository(ctx context.Context, arg int64) (db.GetProdutoByIdRow, error)
	CreateProdutoRepository(ctx context.Context, arg db.CreateProductParams) (int64, error)
	GetProdutoRepository(ctx context.Context) ([]db.Produto, error)
}

type AdminRepositoryInterface interface {
	LoginNewAdmin(ctx context.Context, arg db.CreateLoginParams) (db.CreateLoginAdminRow, error)
	CreateAdmin(ctx context.Context, arg db.CreateAdminParams) (db.Admin, error)
}
