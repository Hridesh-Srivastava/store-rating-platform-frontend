import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllStores } from '../services/api';
import '../styles/Stores.css';

export default function Stores() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    fetchStores();
  }, [search, sortBy]);

  const fetchStores = async () => {
    try {
      setLoading(true);
      const data = await getAllStores({ search, sortBy });
      setStores(data);
    } catch (err) {
      console.error('Error fetching stores:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="stores-container">
      <h1>Available Stores</h1>

      <div className="filters">
        <input
          type="text"
          placeholder="Search by name or address..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
          <option value="name">Sort by Name</option>
          <option value="rating">Sort by Rating</option>
        </select>
      </div>

      {loading ? (
        <p className="loading">Loading stores...</p>
      ) : stores.length === 0 ? (
        <p className="no-stores">No stores found</p>
      ) : (
        <div className="stores-grid">
          {stores.map((store) => (
            <div key={store.id} className="store-card">
              <h3>{store.name}</h3>
              <p className="address">{store.address}</p>
              <div className="rating-info">
                <span className="rating">★ {store.average_rating}</span>
                <span className="count">({store.total_ratings} ratings)</span>
              </div>
              <Link to={`/stores/${store.id}`} className="view-btn">
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
