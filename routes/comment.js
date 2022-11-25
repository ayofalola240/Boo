"use strict";

const express = require("express");
const router = express.Router();
const Comment = require("../models/comment");
const createError = require("http-errors");
const { createValidator } = require("express-joi-validation");

const schema = require("../utils/validation");
const validator = createValidator();

module.exports = function () {
  router.get("/", validator.query(schema.getCommentSchema), async (req, res, next) => {
    const { filter, sort } = req.query;

    const matchItems = filter ? { "personality.type": filter } : {};

    let sortItems;
    if (sort === "best") {
      sortItems = { likes: -1 };
    } else if (sort === "recent") {
      sortItems = { createdAt: -1 };
    } else {
      sortItems = {
        createdAt: 1,
      };
    }

    try {
      const result = await Comment.aggregate([
        {
          $unwind: {
            path: "$personality",
          },
        },
        {
          $match: {
            ...matchItems,
          },
        },
        {
          $sort: sortItems,
        },
      ]);

      return res.status(200).json({
        status: true,
        count: result.length,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  });

  router.post("/", validator.body(schema.createCommentSchema), async (req, res, next) => {
    const { comment, title, profileID, personality } = req.body;
    try {
      const newComment = await Comment.create({
        comment: comment,
        title: title,
        profileID: profileID,
        personality: personality,
      });
      return res.status(201).json({
        status: true,
        data: newComment,
      });
    } catch (err) {
      console.error(err);
      next(err);
    }
  });

  router.post("/like/:id", async (req, res, next) => {
    const id = req.params.id;
    try {
      const comment = await Comment.findById({ _id: id });
      if (!comment) throw new createError.NotFound();

      comment.likes++;
      await comment.save();
      return res.status(200).json({
        status: true,
      });
    } catch (err) {
      console.error(err);
      next(err);
    }
  });
  return router;
};
