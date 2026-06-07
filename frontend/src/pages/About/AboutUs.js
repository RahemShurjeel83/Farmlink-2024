import React, { useEffect, useState } from 'react'
import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'
import CSS from './AboutUs.module.css'
import img from '../../images/about.png'
import Loader from '../Loader/Loader'

const AboutUs = () => {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <Header />
          <div className={`${CSS['container-fluid']} container-fluid`}>
            <div className='container'>
              <h1 className={CSS['aboutus-title']}>About FarmLink</h1>
              <div className={CSS['aboutus-container']}>
                <div className={CSS['aboutus-img']}>
                  <img className={CSS['img']} src={img} alt='About FarmLink' />
                </div>
                <div className={CSS['aboutus-details']}>
                  <p>
                    FarmLink was born from a simple frustration — watching farmers in Pakistan earn a fraction of what consumers paid, while middlemen pocketed the difference. My vision was straightforward: cut out the hassle and connect farmers directly with the people who buy their produce.
                  </p>
                  <p>
                    Today, FarmLink is a platform where verified local vendors list their fresh products — vegetables, fruits, meat, and more — and consumers order directly from them. No unnecessary markups, no cold storage delays, no guessing where your food comes from.
                  </p>
                  <p>
                    We believe fair trade starts at the farm gate. Whether you're a small family farm or a growing agricultural business, FarmLink gives you a direct line to your customers across Pakistan.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      )}
    </div>
  )
}

export default AboutUs
