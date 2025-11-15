import { useState, useEffect } from 'react';
import { getAllUsers, getAllStores } from '../services/api';
import '../styles/AdminPanel.css';

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [activeTab, setActiveTab] = useState('users');
  const [loading, setLoading] = useState(true);
  const [userFilter, setUserFilter] = useState('');
  const [userSort, setUserSort] = useState('name');
  const [storeSort, setStoreSort] = useState('name');
  const [searchStore, setSearchStore] = useState('');

  useEffect(() => {
    fetchData();
  }, [userSort, userFilter, storeSort, searchStore]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const usersData = await getAllUsers().then(data => {
        let filtered = data;
        if (userFilter) {
          filtered = filtered.filter(u => u.role === userFilter);
        }
        if (userSort === 'email') {
          filtered.sort((a, b) => a.email.localeCompare(b.email));
        } else if (userSort === 'role') {
          filtered.sort((a, b) => a.role.localeCompare(b.role));
        } else {
          filtered.sort((a, b) => a.name.localeCompare(b.name));
        }
        return filtered;
      });

      const storesData = await getAllStores({ search: searchStore, sortBy: storeSort });
      setUsers(usersData);
      setStores(storesData);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-container">
      <h1>Admin Panel</h1>

      <div className="admin-tabs">
        <button
          className={`tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
        <button
          className={`tab ${activeTab === 'stores' ? 'active' : ''}`}
          onClick={() => setActiveTab('stores')}
        >
          Stores
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : activeTab === 'users' ? (
        <div>
          <div className="admin-filters">
            <select value={userFilter} onChange={(e) => setUserFilter(e.target.value)} className="filter-select">
              <option value="">All Roles</option>
              <option value="normal_user">Normal User</option>
              <option value="store_owner">Store Owner</option>
              <option value="system_admin">System Admin</option>
            </select>
            <select value={userSort} onChange={(e) => setUserSort(e.target.value)} className="sort-select">
              <option value="name">Sort by Name</option>
              <option value="email">Sort by Email</option>
              <option value="role">Sort by Role</option>
            </select>
          </div>
          <div className="admin-table">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Address</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.address || '-'}</td>
                    <td>{user.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div>
          <div className="admin-filters">
            <input
              type="text"
              placeholder="Search stores by name..."
              value={searchStore}
              onChange={(e) => setSearchStore(e.target.value)}
              className="search-input"
            />
            <select value={storeSort} onChange={(e) => setStoreSort(e.target.value)} className="sort-select">
              <option value="name">Sort by Name</option>
              <option value="rating">Sort by Rating</option>
              <option value="address">Sort by Address</option>
            </select>
          </div>
          <div className="admin-table">
            <table>
              <thead>
                <tr>
                  <th>Store Name</th>
                  <th>Address</th>
                  <th>Rating</th>
                  <th>Total Ratings</th>
                </tr>
              </thead>
              <tbody>
                {stores.map((store) => (
                  <tr key={store.id}>
                    <td>{store.name}</td>
                    <td>{store.address}</td>
                    <td>{store.average_rating}</td>
                    <td>{store.total_ratings}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
