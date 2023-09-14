const express = require("express");
const router = express.Router();
const assert = require("assert");
const { create } = require("domain");
const { format } = require("date-fns");

router.use(express.urlencoded({ extended: true }));

const homepage = (req, res, next) => {
  let sqlquery = `SELECT *
                  FROM articles WHERE author_id = ?`;
  db.get(
    "SELECT * FROM authors WHERE author_id = ?;",
    [req.params.id],
    function (err, author) {
      db.all(sqlquery, [req.params.id], function (err, articles) {
        if (err) {
          next(err); //send the error on to the error handler
        } else {
          res.render("authorHome.ejs", {
            articles,
            author,
          });
        }
      });
    }
  );
};
router
  .route("/:id/homepage")
  .get(homepage)
  .post((req, res, next) => {
    const data = req.body;
    console.log(data);
    db.all(
      `UPDATE authors SET blogmaintitle= ?, blogsubtitle=?, author_username=? WHERE author_id =?;`,
      [
        data.blogmaintitle,
        data.blogsubtitle,
        data.author_username,
        req.params.id,
      ],
      function (err) {
        if (err) {
          console.log(err);
          next(err); //send the error on to the error handler
        } else {
          next();
        }
      }
    );
  }, homepage);

router
  .route("/:id/settings")
  .get((req, res, next) => {
    // Code to render the author settings page (if needed)
    let sqlquery = `SELECT * FROM authors WHERE author_id = ?;`;

    db.get(sqlquery, [req.params.id], function (err, author) {
      if (err) {
        next(err); // Send the error on to the error handler
      } else {
        res.render("authorSetting.ejs", {
          author,
        });
      }
    });
  })
  .post((req, res, next) => {
    const data = req.body;
    console.log(data);
    db.run(
      `UPDATE authors SET blogmaintitle= ?, blogsubtitle=?, author_username=? WHERE author_id =?;`,
      [
        data.blogmaintitle,
        data.blogsubtitle,
        data.author_username,
        req.params.id,
      ],
      function (err) {
        if (err) {
          console.log(err);
          next(err); //send the error on to the error handler
        } else {
          // Redirect to the author homepage after successful form submission
          res.redirect(`/author/${req.params.id}/homepage`);
        }
      }
    );
  });

router
  .route("/:id/:articleID/edit-article")
  .get((req, res, next) => {
    const authorId = req.params.id;
    const articleId = req.params.articleID; // Note the capitalization of "articleID"

    // Fetch the original article data from the database using its ID and author ID
    const sqlQuery = `
    SELECT *
    FROM articles
    WHERE article_id = ? AND author_id = ?;
  `;

    db.get(sqlQuery, [articleId, authorId], function (err, article) {
      if (err) {
        next(err); // Send the error on to the error handler
      } else {
        if (!article) {
          // If the article is not found, handle the error or redirect to a specific page
          // For example:
          res.status(404).send("Article not found");
          return;
        }

        // Fetch the author data from the database using the authorId
        const sqlQueryAuthor = `
        SELECT *
        FROM authors
        WHERE author_id = ?;
      `;

        db.get(sqlQueryAuthor, [authorId], function (err, author) {
          if (err) {
            next(err); // Send the error on to the error handler
          } else {
            // Render the edit-article form with the existing data
            res.render("authorEditArticle.ejs", { article, author });
          }
        });
      }
    });
  })
  // POST route to handle the form submission and save the new draft article to the database
  .post((req, res, next) => {
    const authorId = req.params.id;
    const articleId = req.params.articleId;
    const data = req.body;
    console.log(data);

    const blogTitle = data.blogTitle;
    const blogSubtitle = data.blogSubtitle;
    const articleContent = data.articleContent;
    const datetime = new Date();
    const formattedDate = format(datetime, "yyyy-MM-dd HH:mm:ss");

    // Assuming you have a SQL query to update the article data in the database
    const sqlQuery = `
    UPDATE articles
    SET article_title = ?,
        article_subtitle = ?,
        article_paragraph = ?,
        updated_at = ?
    WHERE article_id = ? AND author_id = ?;
  `;

    db.run(
      sqlQuery,
      [
        blogTitle,
        blogSubtitle,
        articleContent,
        articleId,
        authorId,
        formattedDate,
      ],
      function (err) {
        if (err) {
          console.log(err);
          next(err); // Send the error on to the error handler
        } else {
          // Redirect to the author's homepage after successfully updating the article
          console.log("Article updated successfully!", formattedDate);
          res.redirect(`/author/${authorId}/homepage`);
        }
      }
    );
  });

// Route to render the form for creating a new draft article
router.get("/:id/new-draft", (req, res) => {
  let sqlquery = `SELECT * FROM authors WHERE author_id = ?;`;

  db.get(sqlquery, [req.params.id], function (err, author) {
    // Assuming you have the author's data already available in "author" variable
    // You can pass the "author" data to the EJS template
    res.render("authorNewArticle.ejs", { author });
  });
});

// POST route to handle the form submission and save the new draft article to the database
router.post("/:id/new-draft", (req, res, next) => {
  const data = req.body;
  console.log(data);

  const blogTitle = data.blogTitle;
  const blogSubtitle = data.blogSubtitle;
  const articleContent = data.articleContent;
  const authorId = req.params.id;
  const publish = null;
  const datetime = new Date();
  const formattedDate = format(datetime, "yyyy-MM-dd HH:mm:ss");

  // Insert the new draft article data into the database using a SQL INSERT query
  db.run(
    "INSERT INTO articles (article_title, article_subtitle, article_paragraph, author_id, publication_date, created_at) VALUES (?, ?, ?, ?, ?, ?);",
    [blogTitle, blogSubtitle, articleContent, authorId, publish, formattedDate],
    function (err) {
      if (err) {
        console.log(err);
        next(err); // Send the error on to the error handler
      } else {
        // Redirect to the author's homepage after successfully saving the draft
        res.redirect(`/author/${authorId}/homepage`);
      }
    }
  );
});
module.exports = router;
