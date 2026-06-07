import React, { useEffect, useState } from 'react'
import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'
import Loader from '../../pages/Loader/Loader'
import CSS from './CheckOut.module.css'
import CheckData from './CheckData/CheckData'

const CheckOut = () => {
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
        <div>
            {isLoading ? (
                <Loader />
            ) : (
                <div>
                    <p className={CSS['get-discount']}>Get free shipping over $100 and more with code FRESHSHIPPIMGYAY</p>
                    <Header />
                    <CheckData/>
                    <Footer />
                </div>
            )}
        </div>

    )
}

export default CheckOut
