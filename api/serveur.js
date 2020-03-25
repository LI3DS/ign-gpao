const swaggerJsdoc = require("swagger-jsdoc")
const swaggerUi = require("swagger-ui-express")
const express = require('express')
const port = 8080
const cors = require('cors')
const bodyParser = require('body-parser')

const jobs = require("./routes/jobs")

const app = express()

app.use(cors());
app.use(bodyParser.json());

app.use(function (req, res, next) {
	console.log(req.method, ' ', req.path, ' ', req.body)
	console.log("received at " + Date.now())
	next()
})

// Swagger set up
const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "API GPAO",
      version: "1.0.0",
      description: "Documentation de l'API mise en place dans le cadre de la refonte de la GPAO.",
    },

    servers: [
      {
        url: "http://localhost:8080/api",
        description: "Serveur de dev"
      },
      {
        url: "http://api-gpao:8080/api",
        description: "Serveur de test"
      }
    ]
  },
  apis: ["model/job.js", "routes/job"]
};


const specs = swaggerJsdoc(options);
app.use("/api/doc", swaggerUi.serve);
app.get(
  "/api/doc",
  swaggerUi.setup(specs, {
    explorer: false
  })
);

app.use('/api', jobs);

module.exports = app

app.listen(port, function () {
  console.log('App running on port '+port)
})
