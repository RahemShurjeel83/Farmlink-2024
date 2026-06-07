import React, { useState, useEffect } from "react";
import CSS from "./CategoryFilterCard.module.css";
import axios from "axios";
import { backedUrl } from "../../../apiUrl";

const CategoryFilterCard = (props) => {

  const [categories, setCategories] = useState([]);
  useEffect(() => {
    axios
      .get(`${backedUrl}/api/getcategory`)
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data.data || [];
        setCategories(data.sort((a, b) => a.categoryName.localeCompare(b.categoryName)));
      })
      .catch((err) => console.error(err));
  }, []);

  const Price = [
    {
      title: "Rs.0 - Rs.999",
      min: 0,
      max: 999,
    },
    {
      title: "Rs.1000 - Rs.1999",
      min: 1000,
      max: 1999,
    },
    {
      title: "Rs.2000 - Rs.2999",
      min: 2000,
      max: 2999,
    },
    {
      title: "Rs.3000 - Rs.3999",
      min: 3000,
      max: 3999,
    },
    {
      title: "Rs.4000 - Above",
      min: 4000,
      max: 50000,
    },
  ];

  const handleCategoryFilter = (e) => {
    props.filterCategory(e.target.value);
  };
  const handlePriceFilter = (e) => {
    const price = Price.find((item) =>
      item.title.toLowerCase().includes(e.target.value.toLowerCase())
    );
    if (price) {
      props.filterprice(price.min, price.max);
    }
  };

  return (
    <div>
      <div className={CSS["category-title"]}>Categories</div>
      <ul className={CSS["category-list"]}>
        {categories.map((value) => (
          <li key={value._id} className={CSS["category-list-item"]}>
            <input
              checked={props.categoryFilter === value.categoryName}
              onClick={handleCategoryFilter}
              className={CSS["category-list-item-checkbox"]}
              key={value._id}
              type="radio"
              value={value.categoryName}
              name={"filter-value"}
            />
            {value.categoryName}
          </li>
        ))}
      </ul>
      <div className={CSS["category-title"]}>Prices</div>
      <ul className={CSS["category-list"]}>
        {Price.map((value, index) => (
          <li key={index} className={CSS["category-list-item"]}>
            <input
              onClick={handlePriceFilter}
              className={CSS["category-list-item-checkbox"]}
              key={index}
              type="radio"
              value={value.title}
              name={"filter-price"}
            />
            {value.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryFilterCard;
