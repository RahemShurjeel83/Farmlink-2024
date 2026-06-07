import React from 'react'
import './Footer.css'
import { Link } from 'react-router-dom'

export default function Footer() {
    return (
        <footer className="footer-section pt-5">
            <div className="container">
                <div className="footer-cta pt-5 pb-5">
                    <div className="row">
                        <div className="col-xl-4 col-md-4 mb-30">
                            <div className="single-cta">
                                <i className="fa-solid fa-location-dot"></i>
                                <div className="cta-text">
                                    <h4>Find us</h4>
                                    <span>DHA Lahore, Pakistan</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-4 col-md-4 mb-30">
                            <div className="single-cta">
                                <i className="fas fa-phone"></i>
                                <div className="cta-text">
                                    <h4>Call us</h4>
                                    <span>+92 301 8472910</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-4 col-md-4 mb-30">
                            <div className="single-cta">
                                <i className="far fa-envelope-open"></i>
                                <div className="cta-text">
                                    <h4>Mail us</h4>
                                    <span>rahem@farmlink.pk</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="footer-content pt-5 pb-5">
                    <div className="row">
                        <div className="col-xl-4 col-lg-4 mb-50">
                            <div className="footer-widget">
                                <div className="footer-logo">
                                    <Link to={'/'} style={{ fontSize: '1.5rem', fontWeight: 700, color: '#3bb77e', textDecoration: 'none' }}>🌿 FarmLink</Link>
                                </div>
                                <div className="footer-text" style={{ marginTop: '1rem' }}>
                                    <p>FarmLink connects Pakistani farmers directly with consumers — no middlemen, no markups. Fresh produce, fair prices, straight from the source.</p>
                                </div>
                                <div className="footer-social-icon">
                                    <span>Follow us</span>
                                    <a href="https://www.facebook.com" target="_blank" rel="noreferrer"><i className="fa-brands fa-facebook-f facebook-bg"></i></a>
                                    <a href="https://www.instagram.com" target="_blank" rel="noreferrer"><i className="fa-brands fa-instagram instagram-bg"></i></a>
                                    <a href="https://wa.me/923018472910" target="_blank" rel="noreferrer"><i className="fa-brands fa-whatsapp whatsapp-bg"></i></a>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-4 col-lg-4 col-md-6 mb-30">
                            <div className="footer-widget">
                                <div className="footer-widget-heading">
                                    <h3>Useful Links</h3>
                                </div>
                                <ul>
                                    <li><Link to="/">Home</Link></li>
                                    <li><Link to="/aboutus">About</Link></li>
                                    <li><Link to="/category">Categories</Link></li>
                                    <li><Link to="/contact">Contact</Link></li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-xl-4 col-lg-4 col-md-6 mb-50">
                            <div className="footer-widget">
                                <div className="footer-widget-heading">
                                    <h3>Stay Updated</h3>
                                </div>
                                <div className="footer-text mb-25">
                                    <p>Subscribe for seasonal produce alerts and exclusive offers.</p>
                                </div>
                                <div className="subscribe-form">
                                    <form action="#">
                                        <input type="text" placeholder="Email Address" />
                                        <button><i className="fa-solid fa-paper-plane"></i></button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="copyright-area">
                <div className="container">
                    <div className="row text-center">
                        <div className="col-xl-12 text-center">
                            <div className="copyright-text">
                                <p>Copyright &copy; 2024 FarmLink. All Rights Reserved.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
