import Product from "../models/Product.js";

export const getProducts = async (req, res) => {
  try {
    const { category, size } = req.query;
    let whereClause = {};
    
    // Filter berdasarkan kategori jika parameter category ada
    if (category) {
      whereClause.category = category;
    }
    
    // Filter berdasarkan ukuran jika parameter size ada
    if (size) {
      whereClause.size = size;
    }
    
    const products = await Product.findAll({
      where: whereClause,
      order: [['tanggal_dibuat', 'DESC']]
    });
    
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProduct = async (req, res) => {
  const { name, description, category, size, price, stock, imageUrl } = req.body;
  try {
    // Validasi kategori
    const validCategories = ["deck", "trucks", "wheels", "bearing", "griptape", "bolt"];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ 
        message: "Kategori tidak valid. Gunakan: deck, trucks, wheels, bearing, griptape, atau bolt"
      });
    }
    
    // Validasi ukuran untuk deck dan trucks
    if ((category === "deck" || category === "trucks") && !size) {
      return res.status(400).json({ 
        message: "Size harus diisi untuk produk kategori deck dan trucks"
      });
    }
    
    const newProduct = await Product.create({ 
      name, 
      description, 
      category, 
      size, 
      price, 
      stock, 
      imageUrl 
    });
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  const { name, description, category, size, price, stock, imageUrl } = req.body;
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (name) product.name = name;
    if (description) product.description = description;
    
    // Validasi kategori jika ada perubahan
    if (category) {
      const validCategories = ["deck", "trucks", "wheels", "bearing", "griptape", "bolt"];
      if (!validCategories.includes(category)) {
        return res.status(400).json({ 
          message: "Kategori tidak valid. Gunakan: deck, trucks, wheels, bearing, griptape, atau bolt"
        });
      }
      product.category = category;
    }
    
    // Update ukuran
    if (size !== undefined) {
      product.size = size;
    }
    
    // Validasi ukuran untuk deck dan trucks jika mengubah kategori
    if ((category === "deck" || category === "trucks") && !product.size && size === undefined) {
      return res.status(400).json({ 
        message: "Size harus diisi untuk produk kategori deck dan trucks"
      });
    }
    
    if (price) product.price = price;
    if (stock !== undefined) product.stock = stock;
    if (imageUrl) product.imageUrl = imageUrl;

    await product.save();
    res.json({ message: "Product updated" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    await product.destroy();
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fungsi untuk mendapatkan daftar kategori produk
export const getCategories = async (req, res) => {
  try {
    res.json([
      "deck", 
      "trucks", 
      "wheels", 
      "bearing", 
      "griptape", 
      "bolt"
    ]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fungsi untuk mendapatkan ukuran yang tersedia untuk kategori tertentu
export const getSizes = async (req, res) => {
  try {
    const { category } = req.params;
    
    if (!category) {
      return res.status(400).json({ message: "Kategori harus disertakan" });
    }
    
    // Cek apakah kategori valid
    const validCategories = ["deck", "trucks", "wheels", "bearing", "griptape", "bolt"];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ message: "Kategori tidak valid" });
    }
    
    // Dapatkan ukuran yang tersedia untuk kategori tertentu
    const products = await Product.findAll({
      where: { category },
      attributes: ['size'],
      group: ['size'],
      raw: true
    });
    
    // Ekstrak nilai ukuran dari hasil query
    const sizes = products.map(product => product.size).filter(size => size);
    
    res.json(sizes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};