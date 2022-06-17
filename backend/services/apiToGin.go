package services

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"time"

	"github.com/thrishalsundar/web-is-active/backend/models"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"gopkg.in/mgo.v2/bson"
)

type App struct {
	Users *mongo.Collection
	ctx   context.Context
}

func NewApp(users *mongo.Collection, ctx context.Context) Contracts {
	return &App{
		Users: users,
		ctx:   ctx,
	}
}

func (app *App) GetUser(uname string, pass string) (*models.User, error) {
	var foundUser *models.User
	err := app.Users.FindOne(app.ctx, bson.M{"uname": uname}).Decode(&foundUser)
	if err != nil {
		fmt.Println("error")
		return nil, err
	}

	if foundUser.Pass != pass {
		passWrongErr := errors.New("Wrong Pass")
		return nil, passWrongErr
	}

	return foundUser, nil
}

func (app *App) NewUser(givenUser models.User) error {
	count, err := app.Users.CountDocuments(app.ctx, bson.M{"uname": givenUser.Uname})
	if err != nil {
		return err
	}
	if count > 0 {
		userExistsErr := errors.New("User already exists")
		return userExistsErr
	}

	var newId primitive.ObjectID
	newId = primitive.NewObjectID()
	givenUser.ID = newId
	givenUser.Sites = make([]models.Site, 0)

	_, err = app.Users.InsertOne(app.ctx, givenUser)
	if err != nil {
		panic(err)
	}
	return nil
}

func (app *App) AddSite(uname string, site models.Site) (error, []models.Site) {
	var foundUser *models.User
	err := app.Users.FindOne(app.ctx, bson.M{"uname": uname}).Decode(&foundUser)
	if err != nil {
		fmt.Println("error")
		return err, nil
	}

	newArr := foundUser.Sites
	//dont add if dupe exists
	for _, element := range foundUser.Sites {
		if site.Url_name == element.Url_name {
			return errors.New("site aleady exists"), newArr
		}
	}

	newArr = append(newArr, site)
	foundUser.Sites = newArr

	k := app.Users.FindOneAndReplace(app.ctx, bson.M{"uname": uname}, foundUser)
	if k.Err() != nil {
		return k.Err(), nil
	}

	return nil, newArr
}

func (app *App) RemoveSite(uname string, siteName string) (error, []models.Site) {
	var foundUser *models.User
	err := app.Users.FindOne(app.ctx, bson.M{"uname": uname}).Decode(&foundUser)
	if err != nil {
		fmt.Println("error")
		return err, nil
	}

	oldArr := foundUser.Sites
	newArr := make([]models.Site, 0)
	for _, v := range oldArr {
		if v.Url_name != siteName {
			newArr = append(newArr, v)
		}
	}

	fmt.Println(newArr)

	foundUser.Sites = newArr

	k := app.Users.FindOneAndReplace(app.ctx, bson.M{"uname": uname}, foundUser)
	if k.Err() != nil {
		return k.Err(), nil
	}

	return nil, newArr
}

func (app *App) CheckActiveAndUpdate(uname string, urlName string) (*models.Site, error) {
	var foundUser *models.User
	err := app.Users.FindOne(app.ctx, bson.M{"uname": uname}).Decode(&foundUser)
	if err != nil {
		fmt.Println("error")
		return nil, err
	}

	oldArr := foundUser.Sites
	var foundSite models.Site
	var foundAt int

	fmt.Println(oldArr)

	for ind, v := range oldArr {
		if v.Url_name == urlName {
			foundSite = v
			foundAt = ind
		}
	}

	if foundSite.Url_name == "" {
		panic(errors.New("empty url"))
	}

	resSite, _ := CheckSite(foundSite)

	oldArr[foundAt] = resSite
	foundUser.Sites = oldArr

	k := app.Users.FindOneAndReplace(app.ctx, bson.M{"uname": uname}, foundUser)
	if k.Err() != nil {
		return nil, k.Err()
	}

	return &foundUser.Sites[foundAt], nil

}

func CheckSite(site models.Site) (models.Site, error) {
	stat, err := http.Get("http://" + site.URL)
	if err != nil {
		site.LastChecked = time.Now().Format("2006-01-02 15:04:05")
		return site, err
	}

	resState := stat.StatusCode
	fmt.Println(resState)
	if 200 <= resState && resState < 300 {
		site.LastCheckStat = true
	} else {
		site.LastCheckStat = false
	}

	site.LastChecked = time.Now().Format("2006-01-02 15:04:05")
	return site, nil
}
