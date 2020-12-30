const express = require("express")
const { join } = require("path")
const uniqid = require("uniqid")
const { readDB, writeDB} = require("../../lib/utilities")
const {check, validationResult} = require("express-validator")
const { readdir } = require("fs")

const router = express.Router()

const productsFolderPath = join(__dirname, "products.json")

router.get("/:id", async (req, res, next) => {
  try {
    const productsDB = await readDB(productsFolderPath)
    const product = productsDB
    .filter(product => product.ID === req.params.id)
    if(product.length > 0){
      res.send(product)
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
    const productsDB = await readDB(productsFolderPath)
    if(req.query && req.query.name){
      const filteredProducts = productsDB
      .filter(product => product.hasOwnProperty("name") 
      && product.name.toLowerCase() === req.query.name.toLowerCase())
      res.send(filteredProducts)
    }else{
      res.send(productsDB)
    }
  } catch (error) {
    next(error)
  }
})

router.post("/", [
  check("description")
  .isLength({ min: 7 })
  .withMessage("No way! Too short baby")
  .exists()
  .withMessage("please insert a name"),
  check("name").exists()
  .withMessage("name is required"),
  check("price").exists()
  .withMessage("price is required"),
  check("brand").exists()
  .withMessage("brand is required"),
], async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
      const err = new Error()
      err.message = errors
      err.httpStatusCode = 400
      next(err)
    }else{
      const productsDB = await readDB(productsFolderPath)
      const newProduct = {
        ...req.body,
        ID: uniqid(),
        createdAt: new Date(),
      }

      productsDB.push(newProduct)

      await writeDB(productsFolderPath, productsDB)

      res.status(201).send({ Id: newProduct.ID })
    }
  } catch (error) {
    next(error)
  }
})

router.put("/:id", async (req, res, next) => {
  try {
    const productsDB = await readDB(productsFolderPath)
    const newProductsDB = productsDB
    .filter(product => product.ID !== req.params.id)

    const modifiedProduct = {
      ...req.body,
      ID: req.params.id,
      modifiedAt: new Date(),
    }

    newProductsDB.push(modifiedProduct)

    await writeDB(productsFolderPath, newProductsDB)

    res.send({ id: modifiedProduct.ID })
  } catch (error) {
    next(error)
  }
})

router.delete("/:id", async (req, res, next) => {
  try {
    const productsDB = await readDB(productsFolderPath)
    const newProductsDB = productsDB
    .filter(product => product.ID !== req.params.id)

    await writeDB(productsFolderPath, newProductsDB)

    res.status(204).send()
  } catch (error) {
    next(error)
  }
})



module.exports = router