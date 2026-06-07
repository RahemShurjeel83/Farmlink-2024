import React from 'react'
import { Link ,useLocation} from 'react-router-dom'
import CSS from './SideBar.module.css'


const SideBar = () => {
    const activelink = useLocation();
    return (
        <div>
            <div>
                <p className={CSS['category']}>Category</p>
                <ul className={CSS['category-list']}>
                    <li><Link className={activelink.pathname === '/addcategory' ? `${CSS['active']} ${CSS['category-link']}`: `${CSS['category-link']}`} to={'/addcategory'}>Add Category</Link></li>
                    <li><Link className={activelink.pathname === '/editcategory' ? `${CSS['active']} ${CSS['category-link']}` : `${CSS['category-link']}`} to={'/editcategory'}>Edit Category</Link></li>
                </ul>
            </div>
            <div>
                <p className={CSS['product']}>Product</p>
                <ul className={CSS['product-list']}>
                    <li><Link className={activelink.pathname === '/addproduct' ? `${CSS['active']} ${CSS['product-link']}`: `${CSS['category-link']}`} to={'/addproduct'}>Add Products</Link></li>
                    <li><Link className={activelink.pathname === '/editproduct' ? `${CSS['active']} ${CSS['product-link']}` : `${CSS['category-link']}`} to={'/editproduct'}>Edit Products</Link></li>
                </ul>
            </div>
            <div>
                <p className={CSS['product']}>Queries</p>
                <ul className={CSS['product-list']}>
                    <li><Link className={activelink.pathname === '/orders' ? `${CSS['active']} ${CSS['product-link']}` : `${CSS['category-link']}`} to={'/orders'}>Orders</Link></li>
                    <li><Link className={activelink.pathname === '/ordersdetails' ? `${CSS['active']} ${CSS['product-link']}` : `${CSS['category-link']}`} to={'/ordersdetails'}>Orders Details</Link></li>
                    <li><Link className={activelink.pathname === '/userquery' ? `${CSS['active']} ${CSS['product-link']}` : `${CSS['category-link']}`} to={'/userquery'}>User Queries</Link></li>
                </ul>
            </div>
        </div>
    )
}

export default SideBar