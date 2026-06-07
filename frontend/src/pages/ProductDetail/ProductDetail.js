import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'
import Loader from '../Loader/Loader'
import AvailableSellers from '../../components/Marketplace/AvailableSellers/AvailableSellers'
import CSS from './ProductDetail.module.css'
import { backedUrl, getImgUrl } from '../../apiUrl'

const ProductDetail = () => {
  const { slug } = useParams()
  const navigate = useNavigate()

  const [productInfo, setProductInfo] = useState(null)
  const [listings, setListings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    let cancelled = false

    const fetchProduct = (coords) => {
      axios
        .get(`${backedUrl}/api/product/${slug}`, { params: coords || {} })
        .then((res) => {
          if (cancelled) return
          const payload = res.data?.data;
          setProductInfo(payload?.productInfo || null)
          setListings(Array.isArray(payload?.listings) ? payload.listings : [])
        })
        .catch(() => { if (!cancelled) setNotFound(true) })
        .finally(() => { if (!cancelled) setIsLoading(false) })
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchProduct({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => fetchProduct(null),
        { timeout: 4000 }
      )
    } else {
      fetchProduct(null)
    }

    return () => { cancelled = true }
  }, [slug])

  const handleSelectSeller = (listing) => {
    const itemDetails = {
      _id: listing._id,
      title: listing.productName,
      newPrice: listing.newPrice,
      oldPrice: listing.oldPrice,
      description: listing.description,
      quantity: listing.quantity,
      img: getImgUrl(listing.productImage),
    }
    sessionStorage.setItem('clickedItem', JSON.stringify(itemDetails))
    navigate('/addtocart')
  }

  if (isLoading) return <Loader />

  return (
    <div className={`${CSS['container-fluid']} container-fluid`}>
      <div className="container">
        <Header />

        {notFound || !productInfo ? (
          <p className={CSS['not-found']}>This product could not be found.</p>
        ) : (
          <>
            <div className={CSS['product-head']}>
              <img
                className={CSS['product-img']}
                src={getImgUrl(productInfo.productImage)}
                alt={productInfo.productName}
              />
              <div className={CSS['product-info']}>
                <h1 className={CSS['product-title']}>{productInfo.productName}</h1>
                <p className={CSS['product-description']}>{productInfo.description}</p>
                <span className={CSS['seller-count']}>
                  <i className="fa-solid fa-store" /> {listings.length} farm{listings.length === 1 ? '' : 's'} selling this product nearby
                </span>
              </div>
            </div>

            <AvailableSellers listings={listings} onSelect={handleSelectSeller} />
          </>
        )}

        <Footer />
      </div>
    </div>
  )
}

export default ProductDetail
