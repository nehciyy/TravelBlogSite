/**
 * These are example routes for user management
 * This shows how to correctly structure your routes for the project
 */

const express = require("express");
const router = express.Router();
const assert = require("assert");
const bodyParser = require("body-parser");
const { format } = require("date-fns");

/**
 * @desc retrieves the current users
 */
// Parse incoming requests with urlencoded payloads
router.use(bodyParser.urlencoded({ extended: false }));

router.get("/:id/homepage", (req, res, next) => {
  let sqlquery = `SELECT * FROM articles WHERE author_id=? AND publication_date IS NOT NULL `;
  db.get(
    "SELECT * FROM authors WHERE author_id = ?;",
    [req.params.id],
    function (err, author) {
      db.all(sqlquery, [req.params.id], function (err, articles) {
        if (err) {
          next(err); //send the error on to the error handler
        } else {
          res.render("readerHome.ejs", {
            articles,
            author,
          });
        }
      });
    }
  );
});

// Route to render the Reader - Article Page
router
  .route("/author/:authorID/article/:id")
  .get((req, res) => {
    const authorId = req.params.authorID;
    const articleId = req.params.id;

    const articleQuery = `
        SELECT *
        FROM articles
        WHERE article_id = ? AND author_id = ?;
      `;

    db.get(articleQuery, [articleId, authorId], (err, article) => {
      if (article) {
        const authorQuery = "SELECT * FROM authors WHERE author_id = ?;";
        db.get(authorQuery, [article.author_id], (err, author) => {
          if (author) {
            // Fetch comments for the article from the database
            const commentsQuery =
              "SELECT * FROM comments WHERE article_id = ?;";
            db.all(commentsQuery, [articleId], (err, comments) => {
              if (err) {
                console.error(err);
                res.status(500).send("Error fetching comments.");
              } else {
                console.log("Comments:", comments);
                res.render("readerArticle.ejs", {
                  article,
                  author,
                  comments: comments || [],
                  authorId,
                  articleId, // Pass the comments array to the template
                });
              }
            });
          } else {
            res.status(404).send("Author not found");
          }
        });
      } else {
        res.status(404).send("Article not found");
      }
    });
  })
  // Route to handle the like button
  .post((req, res) => {
    const articleId = req.params.id;

    // Retrieve the current number of likes from the database
    const query = "SELECT liked FROM articles WHERE article_id = ?";
    db.get(query, [articleId], (err, article) => {
      if (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
      } else {
        // Increment the number of likes by 1
        const newLikes = article.liked + 1;

        // Update the database with the new number of likes
        const updateQuery =
          "UPDATE articles SET liked = ? WHERE article_id = ?";
        db.run(updateQuery, [newLikes, articleId], (err) => {
          if (err) {
            console.log(err);
            res.status(500).send("Internal Server Error");
          } else {
            // Send a response indicating success
            res.sendStatus(200);
          }
        });
      }
    });
  });
//for readers comment
router.route("/author/:authorID/article/:id/comment").post((req, res) => {
  const authorId = req.params.authorID;
  const articleId = req.params.id;
  const comment = req.body.comment;
  console.log(comment);
  const datetime = new Date();
  const formattedDate = format(datetime, "yyyy-MM-dd HH:mm:ss");

  const insertQuery = `INSERT INTO comments (comment_text, article_id, author_id, created_at)
              VALUES (?, ?, ?, ?)`;

  db.run(
    insertQuery,
    [comment, articleId, authorId, formattedDate],
    function (err) {
      if (err) {
        console.error(err);
        res.status(500).send("Error adding comment to the article.");
      } else {
        console.log(authorId);
        console.log(articleId);
        res.redirect(`/reader/author/${authorId}/article/${articleId}`);
      }
    }
  );
});

module.exports = router;
