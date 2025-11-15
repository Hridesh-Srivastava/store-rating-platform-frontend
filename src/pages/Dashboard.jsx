import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updatePassword, getAllStores, getStoreRatings } from '../services/api';
import '../styles/Dashboard.css';

export default function Dashboard() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [ownedStore, setOwnedStore] = useState(null);
  const [storeRatings, setStoreRatings] = useState([]);
  const [statsLoading, setStatsLoading] = useState(false);
  const role = localStorage.getItem('role');
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  useEffect(() => {
    if (role === 'store_owner') {
      loadStoreOwnerData();
    }
  }, [role, userId]);

  const loadStoreOwnerData = async () => {
    try {
      setStatsLoading(true);
      const storesResponse = await getAllStores({});
      const storesData = storesResponse?.data || storesResponse;
      
      let stores = [];
      if (Array.isArray(storesData)) {
        stores = storesData;
      }
      
      const myStore = stores.find(s => s.owner_id === userId);
      
      if (myStore) {
        setOwnedStore(myStore);
        
        const ratingsResponse = await getStoreRatings(myStore.id);
        const ratingsData = ratingsResponse?.data || ratingsResponse;
        
        if (Array.isArray(ratingsData)) {
          setStoreRatings(ratingsData);
        } else {
          setStoreRatings([]);
        }
      }
    } catch (err) {
      console.error('Error loading store owner data:', err);
    } finally {
      setStatsLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await updatePassword({ currentPassword, newPassword });
      setSuccess('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setError(err.response?.data?.error || 'Error updating password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      <p className="role-badge">
        Role: {role === 'store_owner' ? 'Store Owner' : role === 'system_admin' ? 'System Admin' : 'Normal User'}
      </p>

      <div className="dashboard-content">
        {role === 'store_owner' && (
          <div className="store-owner-section">
            <h2>My Store Statistics</h2>
            {statsLoading ? (
              <p>Loading store data...</p>
            ) : ownedStore ? (
              <div className="store-stats-card">
                <h3>{ownedStore.name}</h3>
                <p className="store-address">{ownedStore.address}</p>
                <div className="stats-grid">
                  <div className="stat-item">
                    <span className="stat-label">Average Rating</span>
                    <span className="stat-value">★ {ownedStore.average_rating || 0}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Total Ratings</span>
                    <span className="stat-value">{ownedStore.total_ratings || 0}</span>
                  </div>
                </div>
                
                <div className="ratings-list-section">
                  <h4>User Ratings</h4>
                  {storeRatings.length === 0 ? (
                    <p className="no-ratings">No ratings yet</p>
                  ) : (
                    <div className="ratings-table">
                      <table>
                        <thead>
                          <tr>
                            <th>User</th>
                            <th>Email</th>
                            <th>Rating</th>
                            <th>Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {storeRatings.map((rating) => (
                            <tr key={rating.id}>
                              <td>{rating.user_name || 'Anonymous'}</td>
                              <td>{rating.user_email || '-'}</td>
                              <td>
                                <span className="rating-badge">★ {rating.rating}</span>
                              </td>
                              <td>{new Date(rating.created_at).toLocaleDateString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p className="no-store-msg">You don't have a store registered yet.</p>
            )}
          </div>
        )}

        <div className="password-section">
          <h2>Update Password</h2>
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <form onSubmit={handlePasswordUpdate}>
            <input
              type="password"
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="New Password (8-16 chars, 1 uppercase, 1 special char)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
