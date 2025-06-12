import Product from "../models/Product.js";

// GET
async function getProducts(req, res) {
  try {
    const { category } = req.query;
    let where = {};
    if (category) {
      where.category = category;
    }
    const response = await Product.findAll({ where });
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
  }
}

// GET BY ID
async function getProductById(req, res) {
  try {
    const response = await Product.findOne({ where: { id: req.params.id } });
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
  }
}

// CREATE
async function createProduct(req, res) {
  try {
    const inputResult = req.body;
    await Product.create(inputResult);
    res.status(201).json({ msg: "Product Created" });
  } catch (error) {
    console.log(error.message);
  }
}

async function updateProduct(req, res) {
  try {
    const inputResult = req.body;
    await Product.update(inputResult, {
      where: { id: req.params.id },
    });
    res.status(201).json({ msg: "Product Updated" });
  } catch (error) {
    console.log(error.message);
  }
}

async function deleteProduct(req, res) {
  try {
    await Product.destroy({ where: { id: req.params.id } });
    res.status(201).json({ msg: "Product Deleted" });
  } catch (error) {
    console.log(error.message);
  }
}

export { getProducts, getProductById, createProduct, updateProduct, deleteProduct };