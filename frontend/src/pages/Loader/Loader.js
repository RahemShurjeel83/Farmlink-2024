import React from 'react'
import CSS from './Loader.module.css'

const Loader = () => {
  return (
    <div className={CSS['loader-container']}>
      <div className={CSS['loader']}></div>
    </div>
  )
}

export default Loader