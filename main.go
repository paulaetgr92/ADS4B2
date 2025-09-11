package main

import (
	"log"
	"os"

	"awesomeProject/Internal_temp/handler"
	"awesomeProject/Internal_temp/repository"
	"awesomeProject/Internal_temp/service"
	"awesomeProject/config"
	"awesomeProject/db/dataSrc"
	dbsqlc "awesomeProject/db/sqlc"

	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
)

func init() {
	if err := godotenv.Load(); err != nil {
		log.Println("Aviso: não foi possível carregar .env, usando variáveis de ambiente do sistema")
	}
}

func main() {
	// Inicializa Echo
	e := echo.New()

	// Conecta ao banco
	conn, err := dataSrc.Connect()
	if err != nil {
		log.Fatal("Erro ao conectar ao banco: ", err)
	}

	queries := dbsqlc.New(conn)
	baseRepo := Repository.NewBaseRepository(queries, conn)

	cadastroRepo := Repository.NewCadastroNewRepository(baseRepo)
	tokenHistRepo := Repository.NewUserTokensHistRepository(*baseRepo)
	loginRepo := Repository.NewLoginRepository(baseRepo)
	sellerRepo := Repository.NewSellerRepository(*baseRepo)
	produtoRepo := Repository.NewProdutosRepository(baseRepo)

	twilioService := service.NewTwilioService(
		os.Getenv("TWILIO_ACCOUNT_SID"),
		os.Getenv("TWILIO_AUTH_TOKEN"),
		os.Getenv("TWILIO_FROM_NUMBER"),
		os.Getenv("TWILIO_CONTENT_SID"),
	)

	// Inicializa serviços
	cadastroSvc := service.NewCadastroService(cadastroRepo, sellerRepo, twilioService)
	tokenHistSvc := service.NewUserTokensHistService(tokenHistRepo)
	loginSvc := service.NewLoginoService(loginRepo)
	createProdutoSvc := service.NewProdutoService(produtoRepo)

	// Inicializa handlers
	cadastroHandler := handler.NewCadastroHandler(cadastroSvc)
	userTokensHistHandler := handler.NewUserTokensHistHandler(tokenHistSvc)
	loginHandler := handler.NewLoginHandler(loginSvc)
	produtoHandler := handler.NewProdutoHandler(createProdutoSvc)
	sellerHandler := handler.NewSellerHandler(cadastroSvc)

	// Configura rotas
	config.SetupRoutes(e,
		cadastroHandler,
		userTokensHistHandler,
		loginHandler,
		loginHandler,
		sellerHandler,
		produtoHandler,
	)

	// Inicia servidor
	log.Println("Servidor rodando na porta 8080")
	e.Logger.Fatal(e.Start(":8080"))
}
