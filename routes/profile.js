"use strict";

const express = require("express");
const router = express.Router();
const Profile = require("../models/profile");
const createError = require("http-errors");

/**
 * @openapi
 * components:
 *   schemas:
 *     ProfilePayload:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         mbti:
 *           type: string
 *         enneagram:
 *           type: string
 *         variant:
 *           type: string
 *         tritype:
 *           type: string
 *         socionics:
 *           type: string
 *         sloan:
 *           type: string
 *         psyche:
 *           type: string
 *         image:
 *           type: string
 *
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     ProfileResponse:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         mbti:
 *           type: string
 *         enneagram:
 *           type: string
 *         variant:
 *           type: string
 *         tritype:
 *           type: string
 *         socionics:
 *           type: string
 *         sloan:
 *           type: string
 *         psyche:
 *           type: string
 *         image:
 *           type: string
 *
 */

module.exports = function () {
  /**
   * @openapi
   * '/profile/{id}':
   *  get:
   *     tags:
   *     - Profile
   *     summary: Get a single profile by the id
   *     parameters:
   *      - name: id
   *        in: path
   *        description: The id of the profile
   *        required: true
   *     responses:
   *       200:
   *         description: Success
   *         content:
   *          application/json:
   *           schema:
   *              $ref: '#/components/schemas/ProfilePayload'
   *       404:
   *         description: Not found
   */
  router.get("/:id", async (req, res, next) => {
    const { id } = req.params;

    const profile = await Profile.findById({ _id: id });
    if (!profile) throw new createError.NotFound();

    return res.status(200).send(profile);
  });

  router.get("/*", async (req, res, next) => {
    const profiles = await Profile.find({}).lean();
    console.log(profiles);
    res.render("profile_template", {
      profile: profiles[0],
    });
  });

  /**
   * @openapi
   * '/profile':
   *  post:
   *     tags:
   *     - Profile
   *     summary: create a new profile
   *     requestBody:
   *      required: true
   *      content:
   *        application/json:
   *            schema:
   *              $ref: '#/components/schemas/ProfilePayload'
   *     responses:
   *      201:
   *        description: Success
   *        content:
   *          application/json:
   *            schema:
   *             $ref: '#/components/schemas/ProfileResponse'
   *      500:
   *        description: Internal server error
   */
  router.post("/", async (req, res, next) => {
    const { body } = req;
    try {
      const newProfile = await Profile.create({
        name: body.name,
        description: body.description,
        mbti: body.mbti,
        enneagram: body.enneagram,
        variant: body.variant,
        tritype: body.tritype,
        socionics: body.socionics,
        sloan: body.sloan,
        psyche: body.psyche,
        image: body.image,
      });
      return res.status(201).json({
        status: true,
        data: newProfile,
      });
    } catch (error) {
      next(err);
    }
  });

  return router;
};
