const express = require("express");
const app = express();
const port = 3000;
const sqlite3 = require("sqlite3").verbose();
const formData = require("express-form-data");

//items in the global namespace are accessible throught out the node application
global.db = new sqlite3.Database("./database.db", function (err) {
  if (err) {
    console.error(err);
    process.exit(1); //Bail out we can't connect to the DB
  } else {
    console.log("Database connected");
    global.db.run("PRAGMA foreign_keys=ON"); //This tells SQLite to pay attention to foreign key constraints
  }
});

const readerRoutes = require("./routes/reader");
const authorRoutes = require("./routes/authors");
const articleRoutes = require("./routes/article");
const path = require("path");

//set the app to use ejs for rendering
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "images")));
app.set("views", path.join(__dirname, "views")); //temp
app.use(express.json());
app.use(formData.parse());

//this adds all the userRoutes to the app under the path /user
app.use("/reader", readerRoutes);
app.use("/author", authorRoutes);
app.use("/articles", articleRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
