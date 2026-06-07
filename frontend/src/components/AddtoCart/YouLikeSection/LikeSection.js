import React, { useState, useEffect } from 'react';
import CSS from './LikeSection.module.css';
import LikeCard from './LikeCard/LikeCard';
import axios from 'axios';
import { backedUrl } from '../../../apiUrl';

const LikeSection = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedItem = sessionStorage.getItem('clickedItem');
        const clickedItem = storedItem ? JSON.parse(storedItem) : null;

        const fetchRecommendations = async () => {
            try {
                if (clickedItem && clickedItem._id) {
                    const { data } = await axios.get(`${backedUrl}/api/recommendations/${clickedItem._id}`);
                    if (data.success && data.data.length > 0) {
                        setProducts(data.data);
                        return;
                    }
                }
                // Fallback to trending if no product context
                const { data } = await axios.get(`${backedUrl}/api/trending`);
                if (data.success) setProducts(data.data);
            } catch (err) {
                console.error("Failed to load recommendations:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, []);

    if (loading || products.length === 0) return null;

    return (
        <div className={`${CSS['container-fluid']} container-fluid`}>
            <div className='container'>
                <h1 className={CSS['like-title']}>You might also like</h1>
                {products.map((item) => (
                    <LikeCard key={item._id} item={item} />
                ))}
            </div>
        </div>
    );
};

export default LikeSection;
