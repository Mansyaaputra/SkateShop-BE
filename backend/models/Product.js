import { Sequelize } from "sequelize";
import db from "../config/Database.js";

// Membuat tabel "product" dengan field category ENUM
const Product = db.define(
  "product", // Nama Tabel
  {
    name: Sequelize.STRING,
    description: Sequelize.TEXT,
    price: Sequelize.INTEGER,
    category: {
      type: Sequelize.ENUM("deck", "trucks", "wheels", "bearing", "griptape", "bolt"),
      allowNull: false
    },
    imageUrl: Sequelize.STRING,
  }
);

db.sync().then(() => console.log("Database synced"));

export default Product;