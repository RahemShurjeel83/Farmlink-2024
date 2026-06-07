import React, { useState, useEffect } from "react";
import CSS from "./CategorySection.module.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { backedUrl } from "../../../apiUrl";

import vegetableImg from "../../../images/broc.png";
import fruitImg from "../../../images/mango.png";
import meatImg from "../../../images/Rabbit-Meat.jpg";

const LOCAL_IMAGES = {
  VEGETABLES: vegetableImg,
  FRUITS: fruitImg,
  MEAT: meatImg,
};

const CATEGORY_EMOJIS = {
  DAIRY: "🥛",
  GRAINS: "🌾",
  POULTRY: "🐔",
};

const CategoryCard = ({ category }) => {
  const [imgFailed, setImgFailed] = useState(false);
  const key = category.categoryName?.toUpperCase();
  const localImg = LOCAL_IMAGES[key];
  const emoji = CATEGORY_EMOJIS[key] || "🛒";

  const showFallback = imgFailed || !category.categoryImage;

  return (
    <div className={CSS["category-container"]}>
      <Link className={CSS["category-link"]} to={`/category/?category=${category.categoryName}`}>
        <div className={CSS["category-data"]}>
          <h6 className={CSS["category-subtitle"]}>{category.categoryName}</h6>
          {!showFallback ? (
            <img
              className={CSS["category-img"]}
              src={category.categoryImage}
              alt={category.categoryName}
              onError={() => setImgFailed(true)}
            />
          ) : localImg ? (
            <img
              className={CSS["category-img"]}
              src={localImg}
              alt={category.categoryName}
            />
          ) : (
            <div className={CSS["category-emoji"]}>{emoji}</div>
          )}
        </div>
      </Link>
    </div>
  );
};

const CategorySection = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios
      .get(`${backedUrl}/api/getcategory`)
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data.data || [];
        setCategories(data.sort((a, b) => a.categoryName.localeCompare(b.categoryName)));
      })
      .catch((err) => console.error("Failed to load categories:", err));
  }, []);

  return (
    <div className="container">
      <h3 className={CSS["category-title"]}>Categories</h3>
      <div className={CSS["category-grid"]}>
        {categories.map((category) => (
          <CategoryCard key={category._id} category={category} />
        ))}
      </div>
    </div>
  );
};

export default CategorySection;
