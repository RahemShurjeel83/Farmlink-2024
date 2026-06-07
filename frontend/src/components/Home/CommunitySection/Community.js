import React from 'react'
import CSS from './Community.module.css'
import CommunityCard from './CommunityCard/CommunityCard'
import vegImg from '../../../images/carrot.png'
import fruitImg from '../../../images/mango.png'
import berryImg from '../../../images/straw.png'
import abubakar from '../TrendProductSection/images/abubakar.jpg'
import umar from '../TrendProductSection/images/umar.JPG'
import ali from '../TrendProductSection/images/ali.JPG'

const CommunityMember = [{
  tag: '🥕 Vegetable Growers',
  title: 'Lahore Kissan Bazaar',
  subtitle: 'A network of sabzi growers and buyers sharing mandi rates, tips and honest deals across Punjab.',
  memberName: 'Umar Farooq',
  memberRole: 'Community Lead',
  memberImg: umar,
  communityImg: vegImg,
  stats: { members: '2,847', posts: '64' },
  reviews: [
    { rating: 5, text: 'Mandi rates yahan se pata chal jatay hain — bohat madad milti hai roz.', name: 'Hassan Ali', city: 'Lahore' },
    { rating: 5, text: 'Sabzi ki quality pichle saal se kaafi behtar hogai hai. Shukriya is group ka!', name: 'Nimra Shah', city: 'Faisalabad' },
    { rating: 4, text: 'Connected with five new buyers in just one week. Solid, genuine network.', name: 'Imran Tariq', city: 'Multan' },
  ],
}, {
  tag: '🥭 Fruit Growers',
  title: 'Punjab Mango Growers Circle',
  subtitle: 'Orchard owners trading harvest tips, pest-control advice and export contacts season after season.',
  memberName: 'Ali Ahmad',
  memberRole: 'Orchard Coordinator',
  memberImg: ali,
  communityImg: fruitImg,
  stats: { members: '1,963', posts: '48' },
  reviews: [
    { rating: 5, text: 'Best pest-control advice I have gotten in years — sweetest harvest this season.', name: 'Saima Younas', city: 'Bahawalpur' },
    { rating: 5, text: 'Doosray growers se seekh kar apni yield taqreeban 20% barha li hai.', name: 'Fahad Iqbal', city: 'Multan' },
    { rating: 4, text: 'Honest community, no fake promises — just real farming talk that helps.', name: 'Zainab Noor', city: 'Rahim Yar Khan' },
  ],
}, {
  tag: '🍓 Berry & Orchard Growers',
  title: 'Murree Berry & Orchard Guild',
  subtitle: 'Hill-station growers swapping cold-climate techniques, fair pricing and weekly harvest updates.',
  memberName: 'Abu Bakar Siddique',
  memberRole: 'Guild Coordinator',
  memberImg: abubakar,
  communityImg: berryImg,
  stats: { members: '1,512', posts: '37' },
  reviews: [
    { rating: 5, text: 'Got fair price guidance before selling — saved me from a bad deal at the mandi.', name: 'Tariq Mehmood', city: 'Murree' },
    { rating: 5, text: 'Itni achi maloomat free mein kahin aur nahi milti, bohat shukriya guild ka.', name: 'Rabia Sultana', city: 'Abbottabad' },
    { rating: 4, text: 'Weekly harvest updates keep me one step ahead of the local market.', name: 'Adeel Hussain', city: 'Murree' },
  ],
}]

const Community = () => {
  return (
    <div className={`${CSS['community-container']} container-fluid`}>
      <div className='container'>
        <h1 className={CSS['community-title']}>Join our Community</h1>
        <p className={CSS['community-subtitle']}>Real growers, real mandis, real conversations — find your circle.</p>
        <div className={CSS['cards-row']}>
          {CommunityMember.map((memberdata, index) => (
            <CommunityCard key={index} {...memberdata} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Community
