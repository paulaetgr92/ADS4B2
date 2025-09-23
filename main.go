package main

import (
	"log"

	"awesomeProject/Internal_temp/handler"
	Repository "awesomeProject/Internal_temp/repository"
	"awesomeProject/Internal_temp/service"
	"awesomeProject/config"
	"awesomeProject/db/dataSrc"
	dbsqlc "awesomeProject/db/sqlc"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {

	e := echo.New()

	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"http://localhost:3001"},
		AllowMethods: []string{echo.GET, echo.POST, echo.PUT, echo.DELETE, echo.OPTIONS},
		AllowHeaders: []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept, echo.HeaderAuthorization},
	}))

	conn, err := dataSrc.Connect()
	if err != nil {
		log.Fatal("Erro ao conectar ao banco: ", err)
	}

	queries := dbsqlc.New(conn)

	baseRepo := Repository.NewBaseRepository(queries, conn)

	cadastroRepo := Repository.NewCadastroNewRepository(baseRepo)
	tokenHistRepo := Repository.NewUserTokensHistRepository(*baseRepo)
	LoginRepo := Repository.NewLoginRepository(baseRepo)
	Login := Repository.NewLoginRepository(baseRepo)
	SellerRepo := Repository.NewSellerRepository(*baseRepo)
	ProdutoRepo := Repository.NewProdutosRepository(baseRepo)
	AdminRepo := *Repository.NewAdminRepository(baseRepo)

	cadastroSvc := service.NewCadastroService(cadastroRepo, SellerRepo)
	tokenHistSvc := service.NewUserTokensHistService(tokenHistRepo)
	LoginSvc := service.NewLoginoService(LoginRepo)
	GetLoginSVC := service.NewLoginoService(Login)
	CreateProdutoSVC := service.NewProdutoService(ProdutoRepo)
	CreateAdmin := service.NewAdminService(AdminRepo)

	cadastroHandler := handler.NewCadastroHandler(cadastroSvc)
	userTokensHistHandler := handler.NewUserTokensHistHandler(tokenHistSvc)
	loginHandler := handler.NewLoginHandler(LoginSvc)
	GetLoginHandler := handler.NewLoginHandler(GetLoginSVC)
	ProdutoHandler := handler.NewProdutoHandler(CreateProdutoSVC)
	AdminHandler := handler.NewAdminHandler(CreateAdmin)

	config.SetupRoutes(e, cadastroHandler, userTokensHistHandler, loginHandler, GetLoginHandler, ProdutoHandler, AdminHandler)

	log.Println("Servidor rodando na porta 8080")
	e.Logger.Fatal(e.Start(":8080"))
}
