import React, { useState } from 'react'
import CSS from './CategoryCard.module.css'
import { Link } from 'react-router-dom';
import { getImgUrl } from '../../../../apiUrl';

const CategoryCard = ({ item }) => {
  const [dilIcon, setDilIcon] = useState(false);

  const handleDilIcon = () => {
    setDilIcon(!dilIcon);
  };
  return (
    <div className={CSS["wrapper-grid"]}>
      <div className={CSS["card-container"]}>
        <div className={CSS["card-img"]}>
          <img className={CSS["img"]} src={getImgUrl(item.productImage)} alt={item.productName}/>
          <Link to={`/product/${item.productSlug}`} className={`${CSS["button-container"]} button-container`}>
            <button className={CSS["button"]}>View Sellers</button>
          </Link>
        </div>
        <div className={CSS["card-data-container"]}>
          <div className={CSS["card-data-inner-container1"]}>
            <p className={CSS["card-title"]}>{item.productName}</p>
            <i onClick={handleDilIcon} className={`${CSS["card-icon"]} ${dilIcon ? "fa-solid fa-heart" : "fa-regular fa-heart"}`}></i>
          </div>
          <div className={CSS["card-data-inner-container2"]}>
            <p className={CSS["new-price"]}>Rs. {item.newPrice}</p>
            <del className={CSS["old-price"]}>Rs. {item.oldPrice}</del>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CategoryCard