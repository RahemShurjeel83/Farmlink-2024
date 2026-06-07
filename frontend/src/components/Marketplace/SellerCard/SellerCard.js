import React from 'react'
import { Link } from 'react-router-dom'
import CSS from './SellerCard.module.css'
import RatingStars from '../RatingStars/RatingStars'
import { getImgUrl } from '../../../apiUrl'

const SellerCard = ({ listing, onSelect }) => {
  const { vendor } = listing
  const inStock = listing.isAvailable && listing.quantity > 0

  return (
    <div className={CSS['card']}>
      <div className={CSS['farm-row']}>
        {vendor.farmLogo ? (
          <img className={CSS['logo']} src={getImgUrl(vendor.farmLogo)} alt={vendor.farmName} />
        ) : (
          <span className={CSS['logo-fallback']}>{(vendor.farmName || '?').charAt(0).toUpperCase()}</span>
        )}
        <div className={CSS['farm-info']}>
          <Link to={`/farm/${vendor._id}`} className={CSS['farm-name']}>{vendor.farmName}</Link>
          <RatingStars rating={vendor.ratingAverage} reviewCount={vendor.ratingCount} size="sm" />
        </div>
      </div>

      <div className={CSS['meta-row']}>
        {vendor.distanceKm != null && (
          <span className={CSS['meta']}><i className="fa-solid fa-location-dot" /> {vendor.distanceKm} km away</span>
        )}
        {vendor.deliveryEstimateMins != null && (
          <span className={CSS['meta']}><i className="fa-solid fa-truck-fast" /> Delivery {vendor.deliveryEstimateMins} mins</span>
        )}
        <span className={CSS['meta']}><i className="fa-solid fa-box" /> {listing.quantity} in stock</span>
      </div>

      {!!vendor.badges?.length && (
        <div className={CSS['badges']}>
          {vendor.badges.map((badge) => (
            <span key={badge} className={CSS['badge']}>
              <i className="fa-solid fa-circle-check" /> {badge}
            </span>
          ))}
        </div>
      )}

      <div className={CSS['footer']}>
        <span className={CSS['price']}>PKR {listing.newPrice}</span>
        <button
          type="button"
          className={CSS['select-btn']}
          disabled={!inStock}
          onClick={() => onSelect(listing)}
        >
          {inStock ? 'Select This Farm' : 'Out of Stock'}
        </button>
      </div>
    </div>
  )
}

export default SellerCard
