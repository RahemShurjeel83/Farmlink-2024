import React, { useMemo, useState } from 'react'
import CSS from './AvailableSellers.module.css'
import SellerCard from '../SellerCard/SellerCard'

const SORT_OPTIONS = [
  { key: 'nearest', label: 'Nearest' },
  { key: 'rating', label: 'Highest Rated' },
  { key: 'price', label: 'Lowest Price' },
  { key: 'delivery', label: 'Fastest Delivery' },
]

const SORTERS = {
  nearest: (a, b) => (a.vendor.distanceKm ?? Infinity) - (b.vendor.distanceKm ?? Infinity),
  rating: (a, b) => (b.vendor.ratingAverage ?? 0) - (a.vendor.ratingAverage ?? 0),
  price: (a, b) => (a.newPrice ?? Infinity) - (b.newPrice ?? Infinity),
  delivery: (a, b) => (a.vendor.deliveryEstimateMins ?? Infinity) - (b.vendor.deliveryEstimateMins ?? Infinity),
}

const AvailableSellers = ({ listings, onSelect }) => {
  const [sortKey, setSortKey] = useState('nearest')

  const sortedListings = useMemo(
    () => [...listings].sort(SORTERS[sortKey]),
    [listings, sortKey]
  )

  return (
    <section className={CSS['wrapper']}>
      <div className={CSS['head']}>
        <h2 className={CSS['title']}>Available From Nearby Farms</h2>
        <div className={CSS['sort-bar']}>
          {SORT_OPTIONS.map((option) => (
            <button
              key={option.key}
              type="button"
              className={`${CSS['sort-btn']} ${sortKey === option.key ? CSS['sort-btn-active'] : ''}`}
              onClick={() => setSortKey(option.key)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className={CSS['list']}>
        {sortedListings.map((listing) => (
          <SellerCard key={listing._id} listing={listing} onSelect={onSelect} />
        ))}
      </div>
    </section>
  )
}

export default AvailableSellers
