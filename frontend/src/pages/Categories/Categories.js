import React, { useEffect, useState } from 'react'
import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'
import Loader from '../Loader/Loader'
import CSS from './Categories.module.css'
import Category from '../../components/Category/Category'

const Categories = () => {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    };

    fetchData();
  }, []);


  return (
    <div className={`${CSS['container-fluid']} container-fluid`}>
      {isLoading ? (
        <Loader />
      ) : (
        <div className='container'>
          <Header/>
          <Category/>
          <Footer/>
        </div>
      )}
    </div>

  )
}

export default Categories