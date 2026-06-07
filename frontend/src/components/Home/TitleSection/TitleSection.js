import React, { useState } from 'react'
import CSS from './TitleSection.module.css'
import FarmAnimation from './FarmAnimation'
import { useNavigate } from 'react-router-dom'


const TitleSection = ({ fetchedData }) => {
  const [searchValue, setSearchvalue] = useState('');
  const navigate = useNavigate();
  const handleInputdata = (event) => {
    setSearchvalue(event.target.value);
  }
  const handleSearch = (event) => {
    event.preventDefault();
    const foundItems = fetchedData.filter(item => item.productName.toLowerCase().includes(searchValue.toLowerCase()));
    sessionStorage.setItem('searchResults', JSON.stringify({ foundItems, searchValue }));
    navigate('/search-results');
  }
  return (
    <div style={{ background: 'var(--hero-bg)' }}>
      <div className={`${CSS.main} container`}>
        <div className={CSS['main-data']}>
          <h2 className={CSS['main-title']}>Pakistan's freshest produce — direct from farmer to you</h2>
          <h6 className={CSS['main-subtitle']}>Browse by category or search for what you need.</h6>
          <form onSubmit={handleSearch}>
            <input name='search-input' type='text' className={CSS['input-field']} onChange={handleInputdata} value={searchValue} placeholder='What are you looking for?' spellCheck='true' />
            <i className={`${CSS['serach-icon']} fa-solid fa-magnifying-glass`}></i>
            <button type='submit' className={CSS['search-btn']}>Search</button>
          </form>
        </div>
        <div className={CSS['div-rabbit-img']}>
          <FarmAnimation />
        </div>
      </div>
    </div>
  )
}

export default TitleSection