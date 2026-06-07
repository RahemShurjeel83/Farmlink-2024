import React, { useEffect, useState } from "react";
import CSS from "./TrendingProduct.module.css";
import TrendingCard from "./TrendingCard/TrendingCard";
import axios from "axios";
import { backedUrl } from "../../../apiUrl";

const TrendingProduct = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get(`${backedUrl}/api/trending`)
      .then((res) => {
        if (res.data.success) setProducts(res.data.data);
      })
      .catch((err) => console.error("Failed to load trending products:", err));
  }, []);

  if (products.length === 0) return null;

  return (
    <div>
      <div className={CSS["trending-products-div"]}>
        <p className={CSS["trending-products-title"]}>Trending Products</p>
      </div>
      {products.map((item) => (
        <TrendingCard key={item._id} item={item} />
      ))}
    </div>
  );
};

export default TrendingProduct;
