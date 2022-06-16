package database

import (
	"context"
	"os"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func DBSetup() (*mongo.Client, context.Context) {
	err := godotenv.Load()
	if err != nil {
		panic(err)
	}

	uri := os.Getenv("MONGOURI")
	opts := options.Client().ApplyURI(uri)

	ctx := context.TODO()

	client, err := mongo.Connect(ctx, opts)
	if err != nil {
		panic(err)
	}

	return client, ctx

}
