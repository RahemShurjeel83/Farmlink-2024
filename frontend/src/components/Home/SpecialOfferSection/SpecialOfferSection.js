import React from 'react';
import CSS from './SpecialSection.module.css';
import specialOfferMeat from '../../../images/specialoffer-meat.png';
import specialOfferRabbit from '../../../images/specioffer-rabbit.png';
import DiscountTimer from './DiscountTimer/DiscountTimer';
import Offer from './Offer/Offer';

const SpecialOfferSection = () => {
  const specialOffers = [
    {
      title: 'Rabbit Meat',
      img: specialOfferMeat,
      discount: 30,
      button: 'Shop Now',
    },
    {
      title: 'Rabbit',
      img: specialOfferRabbit,
      discount: 20,
      button: 'Shop Now',
    },
  ];

  return (
    <div>
      <div className={CSS['special-div']}>
        <p className={CSS['special-title']}>Special Offer</p>
      </div>
      {specialOffers.map((offer, index) => (
        <Offer key={index} img={offer.img} title={offer.title} discount={offer.discount} button={offer.button} />
      ))}
      <DiscountTimer />
    </div>
  );
};

export default SpecialOfferSection;
