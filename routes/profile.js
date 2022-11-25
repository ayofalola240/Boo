"use strict";

const express = require("express");
const router = express.Router();
const Profile = require("../models/profile");
const createError = require("http-errors");

module.exports = function () {
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
      console.error(error);
      next(error);
    }
  });

  return router;
};
