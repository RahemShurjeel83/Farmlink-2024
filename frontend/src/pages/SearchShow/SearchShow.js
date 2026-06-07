import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CSS from './SerachShow.module.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

const SearchShow = () => {
  const [foundItems, setFoundItems] = useState([]);
  const [dilIcon, setDilIcon] = useState(false);

  const handleDilIcon = () => {
    setDilIcon(!dilIcon);
  };

  useEffect(() => {
    const storedData = JSON.parse(sessionStorage.getItem('searchResults')) || {};
    const { foundItems: items } = storedData;
    setFoundItems(items || []);
  }, []);

  return (
    <div>
      <Header/>
      <div className={`container-fluid ${CSS['container-fluid']}`}>
        <div className='container'>
          <div className={CSS['category-title']}>Search Items</div>
          {foundItems.map((item) => (
            <div key={item._id} className={CSS['wrapper-grid']}>
              <div className={CSS['card-container']}>
                <div className={CSS['card-img']}>
                  <img className={CSS['img']} src={`${item.productImage}`} alt={item.productName} />
                  <Link to={`/product/${item.productSlug}`} className={`${CSS['button-container']} button-container`}>
                    <button className={CSS['button']}>View Sellers</button>
                  </Link>
                </div>
                <div className={CSS['card-data-container']}>
                  <div className={CSS['card-data-inner-container1']}>
                    <p className={CSS['card-title']}>{item.productName}</p>
                    <i onClick={handleDilIcon} className={`${CSS['card-icon']} ${dilIcon ? 'fa-solid fa-heart' : 'fa-regular fa-heart'}`}></i>
                  </div>
                  <div className={CSS['card-data-inner-container2']}>
                    <p className={CSS['new-price']}>Rs. {item.newPrice}</p>
                    <del className={CSS['old-price']}>Rs. {item.oldPrice}</del>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default SearchShow;
