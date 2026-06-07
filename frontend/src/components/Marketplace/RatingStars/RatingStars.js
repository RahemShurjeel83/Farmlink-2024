import React from 'react'
import CSS from './RatingStars.module.css'

const RatingStars = ({ rating = 0, reviewCount, size = 'md' }) => {
  const rounded = Math.round(rating)

  return (
    <span className={`${CSS['rating']} ${CSS[size] || ''}`}>
      <span className={CSS['stars']} aria-label={`${rating} out of 5 stars`}>
        {[1, 2, 3, 4, 5].map((n) => (
          <i key={n} className={`fa-solid fa-star ${n <= rounded ? CSS['star-filled'] : CSS['star-empty']}`} />
        ))}
      </span>
      <span className={CSS['rating-value']}>{Number(rating || 0).toFixed(1)}</span>
      {typeof reviewCount === 'number' && (
        <span className={CSS['rating-count']}>({reviewCount} reviews)</span>
      )}
    </span>
  )
}

export default RatingStars
