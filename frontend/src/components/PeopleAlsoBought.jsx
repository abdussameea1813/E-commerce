import React, { useEffect, useState } from 'react'
import ProductCard from './ProductCard';
import axios from '../lib/axios';
import LoadingSpinner from './LoadingSpinner';

const PeopleAlsoBought = () => {
  const [ recommendations, setRecommendations ] = useState([]);
  const [ isLoading, setIsLoading ] = useState(false);

  useEffect(() => {
  const fetchrecommendations = async () => {
    try {
      setIsLoading(true); // Set loading to true before fetching
      const res = await axios.get(`/products/recommendations`);
      setRecommendations(res.data);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setRecommendations([]); // Clear recommendations on error
    } finally {
      setIsLoading(false); // Set loading to false after fetching
    }
  }}, []);

  if (isLoading) ( <LoadingSpinner /> );

  return (
    <div className='mt-8'>
      <h3 className='text-2xl font-semibold text-emerald-400'>
        You might also like
      </h3>
      <div className="mt-6 grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-3">
        {
          recommendations.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))
        }
      </div>
    </div>
  )
}

export default PeopleAlsoBought