import React, { useState, useEffect } from "react";
import CSS from "./Category.module.css";
import CategoryFilterCard from "./CategorySection/CategoryFilterCard";
import CategoryProductCard from "./CategoryProductsSection/CategoryProductCard";
import axios from "axios";
import { backedUrl } from "../../apiUrl";
import { useLocation } from "react-router-dom";

const Category = () => {
  const userToken = localStorage.getItem('token');

  const [allProducts, setAllProducts] = useState([]);
  const [filterItems, setFilterItems] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [priceFilter, setPriceFilter] = useState({ Min: 0, Max: 0 });

  const location = useLocation();
  const categoryFromUrl = new URLSearchParams(location.search).get('category');

  useEffect(() => {
    axios
      .get(`${backedUrl}/api/getproduct`, { headers: { "Authorization": `Bearer ${userToken}` } })
      .then((res) => {
        const data = res.data.success ? res.data.data : res.data;
        const sorted = Array.isArray(data)
          ? data.sort((a, b) => a.productName.localeCompare(b.productName))
          : [];
        setAllProducts(sorted);
        if (categoryFromUrl) {
          handleFilterCategory(categoryFromUrl, sorted);
        } else {
          setFilterItems(sorted);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const handleFilterCategory = async (selectedCategory, baseProducts) => {
    setCategoryFilter(selectedCategory);
    if (selectedCategory === "All") {
      applyPriceFilter(baseProducts || allProducts, priceFilter.Min, priceFilter.Max);
      return;
    }
    try {
      const { data } = await axios.get(
        `${backedUrl}/api/filterbycategory/${encodeURIComponent(selectedCategory)}`,
        { headers: { "Authorization": `Bearer ${userToken}` } }
      );
      applyPriceFilter(data.data || [], priceFilter.Min, priceFilter.Max);
    } catch {
      setFilterItems([]);
    }
  };

  const handleFilterPrice = (priceMin, priceMax) => {
    setPriceFilter({ Min: priceMin, Max: priceMax });
    if (categoryFilter === "All") {
      applyPriceFilter(allProducts, priceMin, priceMax);
    } else {
      axios
        .get(`${backedUrl}/api/filterbycategory/${encodeURIComponent(categoryFilter)}`,
          { headers: { "Authorization": `Bearer ${userToken}` } })
        .then(({ data }) => applyPriceFilter(data.data || [], priceMin, priceMax))
        .catch(() => {});
    }
  };

  const applyPriceFilter = (items, priceMin, priceMax) => {
    if (!priceMin && !priceMax) {
      setFilterItems(items);
      return;
    }
    setFilterItems(items.filter((item) => {
      const price = Number(item.newPrice);
      return (priceMin === 0 || price >= priceMin) && (priceMax === 0 || price <= priceMax);
    }));
  };

  return (
    <div className={`${CSS["grid-container"]} container`}>
      <div className={CSS["category-filter"]}>
        <CategoryFilterCard
          filterCategory={handleFilterCategory}
          filterprice={handleFilterPrice}
          categoryFilter={categoryFilter}
        />
      </div>
      <div className={CSS["product"]}>
        <CategoryProductCard ItemList={filterItems} />
      </div>
    </div>
  );
};

export default Category;
