import React from 'react'
import CSS from './DashBoard.module.css'
import GridLayout from '../../../components/GridLayout/GridLayout'


const DashBoard = () => {
    return (
        <GridLayout>
            <div className={CSS['dashboard-data']}>
                Welcome Back!
            </div>
        </GridLayout>
    )
}

export default DashBoard