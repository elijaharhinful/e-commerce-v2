import 'reflect-metadata';
require('dotenv').config();
import express, { Application } from "express";
import cors from "cors";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import { errorHandler } from "./middlewares/error.middleware";
import { RegisterRoutes } from "./routes/routes";
import mongoose from "mongoose";
import database from "./config/database";

// initialize express app
const app: Application = express();

//conect to database
main().catch(err => console.log(err));

async function main() {
  if (process.env.NODE_ENV === "development") {
    if (database) {
      await mongoose.connect(database);
      console.log('Connected to MongoDB local');
    } else {
      console.log('Database connection string is undefined');
    }
  } else if (process.env.NODE_ENV === "production") {
    if (process.env.MONGODB_URL) {
      await mongoose.connect(process.env.MONGODB_URL);
      console.log('Connected to MongoDB atlas');
    } else {
      console.log('Database connection string is undefined');
    }
  }
}



// middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("dev"));
app.use(express.static("public"));

// Swagger UI
const swaggerDocument = require("./swagger/swagger.json");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// register all routes from the routes generated by tsoa
RegisterRoutes(app);

//error handler middleware
app.use(errorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}/api`);
});
