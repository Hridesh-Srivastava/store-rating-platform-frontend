import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getStoreById, getStoreRatings, submitRating, getUserRating } from '../services/api';
import '../styles/StoreDetail.css';

export default function StoreDetail() {
  const { id } = useParams();
  const [store, setStore] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [userRating, setUserRating] = useState(null);
  const [newRating, setNewRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const storeResponse = await getStoreById(id);
      const storeData = storeResponse?.data || storeResponse;
      setStore(storeData);

      const ratingsResponse = await getStoreRatings(id);
      const ratingsData = ratingsResponse?.data || ratingsResponse;
      setRatings(Array.isArray(ratingsData) ? ratingsData : []);

      if (token) {
        try {
          const userRatingResponse = await getUserRating(id);
          const userRatingData = userRatingResponse?.data || userRatingResponse;
          setUserRating(userRatingData.rating);
          setNewRating(userRatingData.rating);
        } catch (err) {
          if (err.response?.status !== 404) {
            console.error('Error fetching user rating:', err);
          }
          setUserRating(null);
          setNewRating(0);
        }
      }
    } catch (err) {
      setError('Error loading store details');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitRating = async () => {
    if (!token) {
      setError('Please login to submit a rating');
      return;
    }

    if (newRating === 0) {
      setError('Please select a rating');
      return;
    }

    try {
      await submitRating(id, newRating);
      setUserRating(newRating);
      setError('');
      fetchData();
    } catch (err) {
      setError(err.response?.data?.error || 'Error submitting rating');
    }
  };

  if (loading) return <div className="detail-container"><p>Loading...</p></div>;
  if (!store) return <div className="detail-container"><p>Store not found</p></div>;

  return (
    <div className="detail-container">
      <div className="store-header">
        <h1>{store.name}</h1>
        <p className="address">{store.address}</p>
        <div className="store-stats">
          <span className="rating">★ {store.average_rating} / 5</span>
          <span className="count">{store.total_ratings} total ratings</span>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {token && (
        <div className="rating-section">
          <h3>Your Rating</h3>
          <div className="rating-input">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                className={`star ${newRating >= star ? 'active' : ''}`}
                onClick={() => setNewRating(star)}
              >
                ★
              </button>
            ))}
          </div>
          <button className="submit-btn" onClick={handleSubmitRating}>
            {userRating ? 'Update Rating' : 'Submit Rating'}
          </button>
        </div>
      )}

      <div className="ratings-list">
        <h3>All Ratings</h3>
        {ratings.length === 0 ? (
          <p>No ratings yet</p>
        ) : (
          ratings.map((rating) => (
            <div key={rating.id} className="rating-item">
              <div className="rating-header">
                <span className="user-name">{rating.name}</span>
                <span className="rating-stars">★ {rating.rating}</span>
              </div>
              <p className="rating-date">
                {new Date(rating.created_at).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
