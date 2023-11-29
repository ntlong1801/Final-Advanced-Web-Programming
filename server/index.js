const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const router = require("./routes");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const swaggerOptions = require("./config/swaggerConfig");
require("dotenv").config();

const port = process.env.PORT || 5000;
const app = express();
const swaggerDocs = swaggerJsdoc(swaggerOptions);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());

router(app);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
