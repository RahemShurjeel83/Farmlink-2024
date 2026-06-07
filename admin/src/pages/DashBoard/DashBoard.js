import React from 'react'
import CSS from './DashBoard.module.css'
import GridLayout from '../../components/GridLayout'



const DashBoard = () => {
    return (
        <GridLayout>
            <div className={CSS['dashboard-data']}>
                welcome back perform some actions!
            </div>
        </GridLayout>
    )
}

export default DashBoard