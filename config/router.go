package config

import (
	handler2 "awesomeProject/Internal_temp/handler"

	"github.com/labstack/echo/v4"
)

func SetupRoutes(e *echo.Echo, cadastroHandler *handler2.CadastroHandler, loginHandler *handler2.LoginHandler, produtoHandler *handler2.ProdutoHandler, adminHandler *handler2.AdminHandler) {
	api := e.Group("/api/v1")

	cadastros := api.Group("/cadastros")
	{
		cadastros.POST("", cadastroHandler.CreateCadastro)
	}

	login := api.Group("/login")
	{
		login.POST("", loginHandler.Login)
	}

	produtos := api.Group("/produtos")
	{
		produtos.POST("", produtoHandler.CreateProductHandler) // Criar produto
		produtos.GET("", produtoHandler.ListProdutosHandler)
		produtos.GET("/:id", produtoHandler.GetProductByIdHandler)           // Buscar por ID
		produtos.PUT("/:id", produtoHandler.UpdateProdutoByIdHandler)        // Atualizar produto
		produtos.PUT("/:id/inativar", produtoHandler.InativarProdutoHandler) // Inativar produto
	}

	admin := api.Group("/admin")
	{
		admin.POST("/create", adminHandler.CreateAdminHandler)
		admin.POST("/login", adminHandler.CreateLoginAdminHandler)
	}

	api.GET("/health", func(c echo.Context) error {
		return c.JSON(200, map[string]string{"status": "ok"})
	})
}
