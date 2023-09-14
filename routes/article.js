const express = require("express");
const router = express.Router();
const assert = require("assert");
const { format } = require("date-fns");

router
  .route("/:id")
  .put((req, res) => {
    const article = req.body;
    const datetime = new Date();
    const formattedDate = format(datetime, "yyyy-MM-dd HH:mm:ss");

    if (article.publish) {
      console.log(formattedDate);
      db.run(
        "UPDATE articles SET publication_date = ? WHERE id = ?",
        [formattedDate, req.params.id],
        function (err) {
          res.status(204).send();
        }
      );
    } else {
      db.run(
        "UPDATE articles SET blogmaintitle = ?, blogsubtitle = ?, article_paragraph = ? WHERE id = ?",
        [
          article.blogmaintitle,
          article.blogsubtitle,
          article.article_paragraph,
          req.params.id,
        ],
        function (err) {
          res.status(204).send();
        }
      );
    }
  })
  .delete((req, res, next) => {
    db.run(
      "DELETE FROM articles WHERE article_id = ?;",
      [req.params.id],
      function (err) {
        res.status(204).send();
      }
    );
  });

module.exports = router;
