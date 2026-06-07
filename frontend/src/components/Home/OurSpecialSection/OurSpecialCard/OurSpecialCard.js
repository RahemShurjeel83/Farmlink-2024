import React from 'react';
import CSS from './OurSpecialCard.module.css';
import { Link } from 'react-router-dom';
import { getImgUrl } from '../../../../apiUrl';

const OurSpecialCard = ({ item }) => {

    return (
        <div className={CSS['special-container']} >
            <div className={CSS['card-img']}>
                <img className={CSS['img']} src={getImgUrl(item.productImage)} alt={item.productName} />
                <div className={`${CSS['button-container']} button-container`}>
                    <p className={CSS['title']}>{item.productName}</p>
                    <p className={CSS['para']}>{item.description}</p>
                    <Link to={`/product/${item.productSlug}`}>
                        <button className={CSS['button']} >Shop now</button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OurSpecialCard;
