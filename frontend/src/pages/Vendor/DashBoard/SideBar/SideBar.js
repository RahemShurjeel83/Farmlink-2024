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
                    <li><Link className={activelink.pathname === '/vendor-addcategory' ? `${CSS['active']} ${CSS['category-link']}`: `${CSS['category-link']}`} to={'/vendor-addcategory'}>Add Category</Link></li>
                    <li><Link className={activelink.pathname === '/vendor-editcategory' ? `${CSS['active']} ${CSS['category-link']}` : `${CSS['category-link']}`} to={'/vendor-editcategory'}>Edit Category</Link></li>
                </ul>
            </div>
            <div>
                <p className={CSS['product']}>Product</p>
                <ul className={CSS['product-list']}>
                    <li><Link className={activelink.pathname === '/vendor-addproduct' ? `${CSS['active']} ${CSS['product-link']}`: `${CSS['category-link']}`} to={'/vendor-addproduct'}>Add Products</Link></li>
                    <li><Link className={activelink.pathname === '/vendor-editproduct' ? `${CSS['active']} ${CSS['product-link']}` : `${CSS['category-link']}`} to={'/vendor-editproduct'}>Edit Products</Link></li>
                </ul>
            </div>
            <div>
                <p className={CSS['product']}>Queries</p>
                <ul className={CSS['product-list']}>
                    <li><Link className={activelink.pathname === '/vendor-orders' ? `${CSS['active']} ${CSS['product-link']}` : `${CSS['category-link']}`} to={'/vendor-orders'}>Orders</Link></li>
                    <li><Link className={activelink.pathname === '/vendor-ordersdetails' ? `${CSS['active']} ${CSS['product-link']}` : `${CSS['category-link']}`} to={'/vendor-ordersdetails'}>Orders Details</Link></li>
                    <li><Link className={activelink.pathname === '/vendor-userquery' ? `${CSS['active']} ${CSS['product-link']}` : `${CSS['category-link']}`} to={'/vendor-userquery'}>User Queries</Link></li>
                </ul>
            </div>
        </div>
    )
}

export default SideBar