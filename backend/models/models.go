package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type User struct {
	ID    primitive.ObjectID `bson:"_id"`
	Uname string             `json:"uname"`
	Pass  string             `json:"pass"`
	Sites []Site             `json:"sites"`
}

type Site struct {
	Url_name      string `bson:"url_name"`
	URL           string `bson:"url"`
	LastChecked   string `bson:"last_checked"`
	LastCheckStat bool   `bson:"lc_status"`
}
