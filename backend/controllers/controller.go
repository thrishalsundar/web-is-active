package controllers

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/thrishalsundar/web-is-active/backend/models"
	"github.com/thrishalsundar/web-is-active/backend/services"
)

type Remote struct {
	Actions services.Contracts
}

func NewApp(Actions services.Contracts) *Remote {
	return &Remote{
		Actions: Actions,
	}
}

func (app *Remote) Routes(incomingRoutes *gin.RouterGroup) {
	routes := incomingRoutes.Group("/actions")
	routes.POST("/getUser", app.GetUser)
	routes.POST("/newUser", app.NewUser)
	routes.PUT("/addSite", app.AddSite)
	routes.PUT("/remSite", app.RemoveSite)
	routes.PUT("/checkAndUpdate", app.CheckActiveAndUpdate)
}

func (app *Remote) GetUser(c *gin.Context) {
	var user models.User
	if err := c.BindJSON(&user); err != nil {
		panic(err)
	}
	if user.Uname == "" {
		panic(errors.New("No user name"))
	}
	resultUser, err := app.Actions.GetUser(user.Uname, user.Pass)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": err.Error(),
		})
	}
	c.JSON(200, resultUser)
	// fmt.Println(c)
	return
}

func (app *Remote) NewUser(c *gin.Context) {
	var user models.User
	if err := c.BindJSON(&user); err != nil {
		panic(err)
	}
	err := app.Actions.NewUser(user)
	if err != nil {
		c.JSON(200, gin.H{
			"message": "something went wrong",
		})
	}
	c.JSON(200, gin.H{
		"message": "successfully signed up",
	})
	return

}

func (app *Remote) AddSite(c *gin.Context) {
	crack := c.Query("uname")
	if crack == "" {
		panic("Kaanum")
		// return
	}

	var site models.Site
	site.LastChecked = "never"
	site.LastCheckStat = false
	if err := c.BindJSON(&site); err != nil {
		panic(err)
	}

	err, sites := app.Actions.AddSite(crack, site)
	if err != nil {
		c.JSON(200, gin.H{
			"message":  err,
			"response": -1,
			"sites":    sites,
		})
		// panic(err)
		return
	}
	c.JSON(200, gin.H{
		"message": "successfully added",
		"sites":   sites,
	})
	return

}

func (app *Remote) RemoveSite(c *gin.Context) {
	crack := c.Query("uname")
	if crack == "" {
		panic("Kaanum")
		// return
	}

	var site models.Site
	if err := c.BindJSON(&site); err != nil {
		panic(err)
	}

	err, sites := app.Actions.RemoveSite(crack, site.Url_name)
	if err != nil {
		c.JSON(404, gin.H{
			"message": "something went wrong part 3",
		})
		panic(err)
	}
	c.JSON(200, gin.H{
		"message": "successfully removed",
		"sites":   sites,
	})
	return

}

func (app *Remote) CheckActiveAndUpdate(c *gin.Context) {
	crack := c.Query("uname")
	if crack == "" {
		panic("Kaanum")
		// return
	}

	var site models.Site
	if err := c.BindJSON(&site); err != nil {
		panic(err)
	}

	foundSite, err := app.Actions.CheckActiveAndUpdate(crack, site.Url_name)
	if err != nil {
		c.JSON(200, gin.H{
			"message": err.Error(),
		})
	}

	c.JSON(200, foundSite)
	return
}
