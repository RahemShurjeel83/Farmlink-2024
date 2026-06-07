import React from 'react'
import CSS from './MainContent.module.css'
import SpecialOfferSection from './SpecialOfferSection/SpecialOfferSection'
import TrendingProduct from './TrendProductSection/TrendingProduct'
import OurSpecial from './OurSpecialSection/OurSpecial'

const MainContent = () => {
  return (
    <div className={`${CSS['grid-container']} container`}>
      <div className={CSS['special-offer']}><SpecialOfferSection /></div>
      <div className={CSS['trending-product']}><TrendingProduct /></div>
      <div className={CSS['our-special']}><OurSpecial /></div>
    </div>
  )
}

export default MainContent