import React, { useEffect, useState } from 'react'
import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'
import CSS from './AddtoCart.module.css'
import AddtocartCard from './AddtoCartCard/AddtocartCard'
import LikeSection from './YouLikeSection/LikeSection'
import Loader from '../../pages/Loader/Loader'

const AddtoCart = () => {
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
                <div>
                    <Header />
                    <AddtocartCard />
                    <LikeSection />
                    <Footer />
                </div>
            )}
        </div>

    )
}

export default AddtoCart