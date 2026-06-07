import React, { useEffect, useState } from 'react'
import CSS from './Home.module.css'
import TitleSection from '../../components/Home/TitleSection/TitleSection'
import CategorySection from '../../components/Home/CategorySection/CategorySection'
import MainContent from '../../components/Home/MainContent'
import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'
import Community from '../../components/Home/CommunitySection/Community'
import Loader from '../Loader/Loader'
import axios from 'axios'
import { backedUrl } from '../../apiUrl'
import { Link } from 'react-router-dom'
import whatsapp from '../../images/whatsapp.png'

const Home = () => {
  
  const [isLoading, setIsLoading] = useState(true);
  const [fetchedData, setfetchedData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      setTimeout(() => {
        axios
          .get(`${backedUrl}/api/getproduct`)
          .then((res) => {
            const sortedProducts = res.data.data.sort((a, b) =>
              a.productName.localeCompare(b.productName)
            );
            setfetchedData(sortedProducts);
          })
          .catch((err) => console.error(err));
        setIsLoading(false);
      }, 1000);
    };

    fetchData();
    sessionStorage.removeItem("clickedItem");
    sessionStorage.removeItem('searchResults');
  }, []);


  return (
    <div className={`${CSS['container-fluid']} container-fluid`}>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <Header />
          <div className={CSS['whatsapp-link-div']}>
            <Link to={'https://wa.me/+923008169527'} className={CSS['whatsapp-link']}><img className={CSS['whatsapp-img']} src={whatsapp} alt={whatsapp} height={'70px'} width={'70px'}/></Link>
          </div>
          <TitleSection fetchedData={fetchedData} />
          <CategorySection fetchedData={fetchedData} />
          <MainContent fetchedData={fetchedData}/>
          <Community />
          <Footer />
        </div>
      )}
    </div>
  )
}

export default Home
