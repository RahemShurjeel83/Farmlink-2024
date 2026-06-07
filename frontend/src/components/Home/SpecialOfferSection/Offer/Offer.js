import React from 'react'
import CSS from './Offer.module.css'
import { Link } from 'react-router-dom'

const Offer = (props) => {
  return (
    <div className={CSS['special-offer-container']}>
      <div className={CSS['special-offer-data']} >
        <h6 className={CSS['special-offer-subtitle']}>{props.title}</h6>
        <div className={CSS['special-inner-container']}>
          <img className={CSS['special-offer-img']} src={props.img} alt='dfgdfgdf' />
          <div className={CSS['special-discount']}>{props.discount}% Off</div>
        </div>
        <Link className={CSS['btn-link']} to={''}>
          <button type='submit' className={CSS['search-btn']}>{props.button}</button>
        </Link>
      </div>
    </div>
  )
}

export default Offer;