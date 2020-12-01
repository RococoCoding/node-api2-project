const express = require("express");
const commentsRoute = require("./commentsRoute");
const { find, insert, findById, remove, update, insertComment, findPostComments, findCommentById } = require("../data/db");

const router = express.Router();

const findHelper = (res, id) => {
  findById(id)
    .then(response => {
      if (response.length > 0) {
        res.status(200).json(response);
      } else {
        res.status(404).json({ message: "could not find post" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "error finding post" })
    })
}


router.get("/", (req, res) => {
  find()
    .then(data => {
      res.status(200).json(data);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "error retrieving info" });
    });
});

router.post("/", (req, res) => {
  if (!req.body.title) {
    res.status(400).json({ message: "missing title" });
  }
  else if (!req.body.contents) {
    res.status(400).json({ message: "missing contents" });
  } else {
    insert(req.body)
      .then(data => {
        findHelper(res, data);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ message: "error posting" });
      });
  }
});

router.get("/:id", (req, res) => {
  findHelper(res, req.params.id)
});

router.delete("/:id", (req, res) => {
  remove(req.params.id)
    .then(response => {
      if (response) {
        res.status(200).json({ message: "delete successful" });
      } else {
        res.status(404).json({ message: "could not find post to delete" })
      }

    })//no response on delete
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "error deleting" });
    });
});

router.put("/:id", (req, res) => {
  update(req.params.id, req.body)
    .then(data => {
      if (data) {
        findHelper(res, req.params.id);
      } else {
        res.status(404).json({ message: "could not find post to update" })
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "error updating" });
    });
})



const findPostHelper = (req, res, id, callback) => {
  findById(id)
    .then(response => {
      if (response.length > 0) {
        callback(req, res)
      } else {
        res.status(404).json({ message: "could not find post" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "error finding post" })
    })
}

router.get("/:id/comments", (req, res) => {
  const findAllComments = (req, res) => {
    findPostComments(req.params.id)
      .then(response => {
        res.status(200).json(response);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  }
  findPostHelper(req, res, req.params.id, findAllComments)
})

router.post("/:id/comments", (req, res) => {
  req.body = { ...req.body, post_id: req.params.id };
  if (!req.body.text) {
    res.status(400).json({ message: "Please include a 'text'property in your comment" });
  } else {
    const addComment = (req, res) => {
      findById(req.params.id)
        .then(response => {
          if (response.length > 0) {
            insertComment(req.body)
              .then(response => {
                findCommentById(response.id)
                  .then(data => res.status(200).json(data))
                  .catch(err => res.status(500).json(`error finding updated comment. ${err}`))
              })
              .catch(err => res.status(500).json(`error inserting comment ${err}`))
          }
          else {
            res.status(404).json(`could not find post`)
          }
        })
        .catch(err => {
          res.status(500).json(`error finding post ${err}`);
        });
    }
    findPostHelper(req, res, req.params.id, addComment);
  }
});

// router.use("/:id/comments", commentsRoute);

module.exports = router;