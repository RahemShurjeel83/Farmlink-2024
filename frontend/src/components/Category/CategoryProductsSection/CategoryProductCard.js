import React from 'react'
import CSS from './CategoryProductCard.module.css'
import CategoryCard from './CategoryCard/CategoryCard';

const CategoryProductCard = ({ ItemList }) => {

  return (
    <div>
      <div className={CSS['category-title']}>Items</div>
      {ItemList.map((item, index) => (
        <CategoryCard key={item._id} item={item} />
      ))}
    </div>
  )
}

export default CategoryProductCard