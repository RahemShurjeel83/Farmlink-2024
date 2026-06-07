import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'
import Loader from '../Loader/Loader'
import RatingStars from '../../components/Marketplace/RatingStars/RatingStars'
import CSS from './FarmProfile.module.css'
import { backedUrl, getImgUrl } from '../../apiUrl'

const FarmProfile = () => {
  const { vendorId } = useParams()

  const [farm, setFarm] = useState(null)
  const [listings, setListings] = useState([])
  const [reviews, setReviews] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    let cancelled = false

    axios
      .get(`${backedUrl}/api/farm/${vendorId}`)
      .then((res) => {
        if (cancelled) return
        const payload = res.data?.data
        setFarm(payload?.farm || null)
        setListings(Array.isArray(payload?.listings) ? payload.listings : [])
        setReviews(Array.isArray(payload?.reviews) ? payload.reviews : [])
      })
      .catch(() => { if (!cancelled) setNotFound(true) })
      .finally(() => { if (!cancelled) setIsLoading(false) })

    return () => { cancelled = true }
  }, [vendorId])

  if (isLoading) return <Loader />
  if (notFound || !farm) {
    return (
      <div className="container">
        <Header />
        <p className={CSS['not-found']}>This farm could not be found.</p>
        <Footer />
      </div>
    )
  }

  return (
    <div className={`${CSS['container-fluid']} container-fluid`}>
      <div className="container">
        <Header />

        <div className={CSS['cover']} style={farm.farmCoverImage ? { backgroundImage: `url(${getImgUrl(farm.farmCoverImage)})` } : undefined}>
          <div className={CSS['cover-overlay']} />
          <div className={CSS['identity']}>
            {farm.farmLogo ? (
              <img className={CSS['logo']} src={getImgUrl(farm.farmLogo)} alt={farm.farmName} />
            ) : (
              <span className={CSS['logo-fallback']}>{(farm.farmName || '?').charAt(0).toUpperCase()}</span>
            )}
            <div>
              <h1 className={CSS['farm-name']}>{farm.farmName}</h1>
              <RatingStars rating={farm.ratingAverage} reviewCount={farm.ratingCount} />
            </div>
          </div>
        </div>

        <div className={CSS['body']}>
          <div className={CSS['main-col']}>
            <section className={CSS['section']}>
              <h2 className={CSS['section-title']}>Our Story</h2>
              <p className={CSS['story']}>{farm.farmDescription || 'This farm has not added a story yet.'}</p>
            </section>

            <section className={CSS['section']}>
              <h2 className={CSS['section-title']}>Listings From This Farm</h2>
              {listings.length ? (
                <div className={CSS['listing-grid']}>
                  {listings.map((listing) => (
                    <Link key={listing._id} to={`/product/${listing.productSlug}`} className={CSS['listing-card']}>
                      <img className={CSS['listing-img']} src={getImgUrl(listing.productImage)} alt={listing.productName} />
                      <div className={CSS['listing-data']}>
                        <p className={CSS['listing-name']}>{listing.productName}</p>
                        <p className={CSS['listing-price']}>PKR {listing.newPrice}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className={CSS['empty']}>This farm has no active listings right now.</p>
              )}
            </section>

            <section className={CSS['section']}>
              <h2 className={CSS['section-title']}>Customer Reviews</h2>
              {reviews.length ? (
                <div className={CSS['reviews']}>
                  {reviews.map((review) => (
                    <div key={review._id} className={CSS['review']}>
                      <div className={CSS['review-head']}>
                        <span className={CSS['review-name']}>
                          {review.reviewerName}{review.reviewerCity ? ` — ${review.reviewerCity}` : ''}
                        </span>
                        <RatingStars rating={review.rating} size="sm" />
                      </div>
                      <p className={CSS['review-text']}>&ldquo;{review.comment}&rdquo;</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className={CSS['empty']}>No reviews yet — be the first to review this farm.</p>
              )}
            </section>
          </div>

          <aside className={CSS['side-col']}>
            <div className={CSS['info-card']}>
              <h3 className={CSS['info-title']}>Farm Details</h3>
              <p className={CSS['info-row']}><i className="fa-solid fa-location-dot" /> {farm.location?.city || 'Location not provided'}</p>
              <p className={CSS['info-row']}><i className="fa-solid fa-circle-nodes" /> Delivers within {farm.deliveryRadiusKm} km</p>
              <p className={CSS['info-row']}><i className="fa-solid fa-truck-fast" /> Avg. delivery in {farm.deliveryEstimateMins} mins</p>
              {!!farm.badges?.length && (
                <div className={CSS['badges']}>
                  {farm.badges.map((badge) => (
                    <span key={badge} className={CSS['badge']}><i className="fa-solid fa-circle-check" /> {badge}</span>
                  ))}
                </div>
              )}
            </div>
          </aside>
        </div>

        <Footer />
      </div>
    </div>
  )
}

export default FarmProfile
