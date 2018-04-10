const express = require("express");

const bodyParser = require("body-parser");

const doc = require("./docs/doc");

const app = express();

const router = express.Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

require("./app/controllers/UserController")(app);
router.all("/", async (req, res, next) => {
  return res.status(202).send({
    response: {
      message: "Wellcome!!!",
      content: doc
    }
  });
});

app.use("/", router);

app.use((req, res, next) => {
  const error = new Error("Resource Not Found!");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    response: {
      message: {
        error: error.status + "! " + error.message
      }
    }
  });
});
app.listen(7007, error => {
  if (error) console.log("Error " + error);
  else console.log("Server run port 7007");
});
