import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const Product = db.define(
  "products",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT,
    },
    category: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        isIn: [["deck", "trucks", "wheels", "bearing", "griptape", "bolt"]]
      }
    },
    size: {
      type: Sequelize.STRING,
      // Size hanya wajib untuk deck dan trucks
    },
    price: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    stock: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    imageUrl: {
      type: Sequelize.STRING,
    },
  },
  {
    freezeTableName: true,
    createdAt: "tanggal_dibuat",
    updatedAt: "tanggal_diperbarui",
  }
);

export default Product;