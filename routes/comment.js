"use strict";

const express = require("express");
const router = express.Router();
const Comment = require("../models/comment");
const createError = require("http-errors");
const { createValidator } = require("express-joi-validation");

const schema = require("../utils/validation");
const validator = createValidator();

/**
 * @openapi
 * components:
 *   schemas:
 *     CommentPayload:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         comment:
 *           type: string
 *         personality:
 *           type: array
 *           items:
 *             type: object
 *         profileID:
 *           type: string
 *
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     CommentResponse:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *         comment:
 *           type: string
 *         personality:
 *           type: object
 *         likes:
 *           type: number
 *         profileID:
 *           type: string
 *         createdAt:
 *           type: string
 *
 */

module.exports = function () {
  /**
   * @openapi
   * '/comment':
   *  get:
   *     tags:
   *     - Comment
   *     summary: Get comments with filter and sort them
   *     parameters:
   *      - name: filter
   *        in: query
   *        description: Filter comment by personality
   *      - name: sort
   *        in: query
   *        description: Sort comments by likes and creation time
   *     responses:
   *       200:
   *         description: Success
   *         content:
   *          application/json:
   *           schema:
   *              type: array
   *              items:
   *                  $ref: '#/components/schemas/CommentResponse'
   *       404:
   *         description: Not found
   */
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

  /**
   * @openapi
   * '/comment':
   *  post:
   *     tags:
   *     - Comment
   *     summary: create a new comment
   *     requestBody:
   *      required: true
   *      content:
   *        application/json:
   *            schema:
   *              $ref: '#/components/schemas/CommentPayload'
   *     responses:
   *      201:
   *        description: Success
   *        content:
   *          application/json:
   *            schema:
   *             $ref: '#/components/schemas/CommentResponse'
   *      500:
   *        description: Internal server error
   */

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

  /**
   * @openapi
   * '/comment/like/{id}':
   *  post:
   *     tags:
   *     - Comment
   *     summary: Like a comment
   *     parameters:
   *      - name: id
   *        in: path
   *        description: The id of the comment
   *        required: true
   *     responses:
   *      200:
   *        description: Success
   *      500:
   *        description: Internal server error
   */
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
