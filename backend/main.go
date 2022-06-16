package main

import (
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/thrishalsundar/web-is-active/backend/controllers"
	"github.com/thrishalsundar/web-is-active/backend/database"
	"github.com/thrishalsundar/web-is-active/backend/services"
	"go.mongodb.org/mongo-driver/mongo"
	"golang.org/x/net/context"
)

var (
	server                *gin.Engine
	port                  string
	client                *mongo.Client
	UserCollection        *mongo.Collection
	actions               services.Contracts
	controllersController *controllers.Remote
	ctx                   context.Context
)

func init() {
	client, ctx = database.DBSetup()
	UserCollection = client.Database("webIsActive").Collection("users")
	actions = services.NewApp(UserCollection, ctx)
	controllersController = controllers.NewApp(actions)
	server = gin.Default()
	server.Use(cors.Default())
	port = os.Getenv("PORT")

}

func main() {
	defer client.Disconnect(ctx)
	basePath := server.Group("/apis")
	controllersController.Routes(basePath)
	server.Run(":" + port)
}
