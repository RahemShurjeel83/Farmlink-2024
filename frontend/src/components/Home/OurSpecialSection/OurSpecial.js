import React, { useEffect, useState } from 'react';
import CSS from './OurSpecial.module.css';
import OurSpecialCard from './OurSpecialCard/OurSpecialCard';
import axios from 'axios';
import { backedUrl } from '../../../apiUrl';

const OurSpecial = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get(`${backedUrl}/api/getproduct`)
      .then((res) => {
        const data = res.data.success ? res.data.data : res.data;
        if (Array.isArray(data)) {
          setProducts(data.slice(0, 2));
        }
      })
      .catch((err) => console.error("Failed to load specials:", err));
  }, []);

  if (products.length === 0) return null;

  return (
    <div>
      <div className={CSS['special-div']}>
        <p className={CSS['special-title']}>Our Specialties</p>
      </div>
      {products.map((item) => (
        <OurSpecialCard key={item._id} item={item} />
      ))}
    </div>
  );
};

export default OurSpecial;
