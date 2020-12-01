const express = require("express");
const { findById, insertComment, findPostComments, findCommentById } = require("../data/db");

const router = express.Router();

router.get("/", (req, res) => {
  findPostComments(req.params.id)
    .then(response => {
      res.status.apply(200).json(response);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
})

router.post("/", (req, res) => {
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
});

module.exports = router;