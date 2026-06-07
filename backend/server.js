require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const userrouter = require("./Routers/userRouter");
const vendorRouter = require("./Routers/vendorRouter");
const adminRouter = require("./Routers/adminRouter");
const db = require("./Database/DatabaseConnection");
const { errorHandler, notFound } = require("./middlewares/errorMiddleware");

const PORT = process.env.PORT || 1783;

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
  : ["http://localhost:6464", "http://localhost:6463"];

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

app.use("/api", userrouter);
app.use("/api/vendor", vendorRouter);
app.use("/api/admin", adminRouter);
app.use("/uploads", express.static(path.join(__dirname, "./public/Images")));
app.use("/Images", express.static(path.join(__dirname, "./public/Images")));

app.use(notFound);
app.use(errorHandler);

const Admin = require("./Models/adminModel");
const CategoryModel = require("./Models/AdminModel/CategoryModel");
const { baseImageUrl } = require("./config");
const { seedMarketplace } = require("./Database/seedMarketplace");

const seedAdmin = async () => {
  try {
    const count = await Admin.countDocuments();
    if (count === 0) {
      await Admin.create({ username: "admin", email: "admin@farmlink.pk", password: "farmlink123" });
      console.log("Default admin created → email: admin@farmlink.pk  password: farmlink123");
    }
  } catch (e) {
    console.error("Admin seed error:", e.message);
  }
};

const seedCategories = async () => {
  try {
    const count = await CategoryModel.countDocuments();
    if (count > 0) return;

    const categories = [
      { categoryName: "Vegetables", img: "categoryImage_1717341811144.png" },
      { categoryName: "Fruits",     img: "categoryImage_1717341824870.png" },
      { categoryName: "Meat",       img: "categoryImage_1717341829922.png" },
      { categoryName: "Dairy",      img: "categoryImage_1717352190010.png" },
      { categoryName: "Grains",     img: "categoryImage_1717352749077.png" },
      { categoryName: "Poultry",    img: "categoryImage_1717399402977.png" },
    ];

    await CategoryModel.insertMany(
      categories.map(c => ({ categoryName: c.categoryName, categoryImage: baseImageUrl + c.img }))
    );
    console.log("Default categories seeded: Vegetables, Fruits, Meat, Dairy, Grains, Poultry");
  } catch (e) {
    console.error("Category seed error:", e.message);
  }
};

let seeded = false;
db.on("connected", () => {
  if (seeded) return;
  seeded = true;
  seedAdmin();
  seedCategories();
  seedMarketplace();
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
