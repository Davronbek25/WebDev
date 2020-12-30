const express = require("express")
const { join } = require("path")
const uniqid = require("uniqid")
const { readDB, writeDB} = require("../../lib/utilities")
const {check, validationResult} = require("express-validator")
const { readdir } = require("fs")

const router = express.Router()

const reviewsFolderPath = join(__dirname, "reviews.json")

router.get("/:id", async (req, res, next) => {
  try {
    const reviewsDB = await readDB(reviewsFolderPath)
    const review = reviewsDB
    .filter(review => review.ID === req.params.id)
    if(review.length > 0){
      res.send(review)
    }else{
      const err = new Error()
      err.httpStatusCode = 404
      next(err)
    }
  } catch (error) {
    next(error)
  }
})

router.get("/", async (req, res, next) => {
  try {
    const reviewsDB = await readDB(reviewsFolderPath)
    if(req.query && req.query.name){
      const filteredreviews = reviewsDB
      .filter(review => review.hasOwnProperty("name") 
      && review.name.toLowerCase() === req.query.name.toLowerCase())
      res.send(filteredreviews)
    }else{
      res.send(reviewsDB)
    }
  } catch (error) {
    next(error)
  }
})

router.post("/", [
  check("name")
  .isLength({ min: 4 })
  .withMessage("No way! Too short baby")
  .exists()
  .withMessage("please insert a name"),
  check("comment").exists()
  .withMessage("comment is required"),
  check("elementId").exists()
  .withMessage("elementId is required")
], async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
      const err = new Error()
      err.message = errors
      err.httpStatusCode = 400
      next(err)
    }else{
      const reviewsDB = await readDB(reviewsFolderPath)
      const newreview = {
        ...req.body,
        ID: uniqid(),
        createdAt: new Date(),
      }

      reviewsDB.push(newreview)

      await writeDB(reviewsFolderPath, reviewsDB)

      res.status(201).send({ Id: newreview.ID })
    }
  } catch (error) {
    next(error)
  }
})

router.put("/:id", async (req, res, next) => {
  try {
    const reviewsDB = await readDB(reviewsFolderPath)
    const newreviewsDB = reviewsDB
    .filter(review => review.ID !== req.params.id)

    const modifiedreview = {
      ...req.body,
      ID: req.params.id,
      modifiedAt: new Date(),
    }

    newreviewsDB.push(modifiedreview)

    await writeDB(reviewsFolderPath, newreviewsDB)

    res.send({ id: modifiedreview.ID })
  } catch (error) {
    next(error)
  }
})

router.delete("/:id", async (req, res, next) => {
  try {
    const reviewsDB = await readDB(reviewsFolderPath)
    const newreviewsDB = reviewsDB
    .filter(review => review.ID !== req.params.id)

    await writeDB(reviewsFolderPath, newreviewsDB)

    res.status(204).send()
  } catch (error) {
    next(error)
  }
})

module.exports = router