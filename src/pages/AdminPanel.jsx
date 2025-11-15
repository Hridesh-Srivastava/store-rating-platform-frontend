import { useState, useEffect } from 'react';
import { getAllUsers, getAllStores, createUser, createStore } from '../services/api';
import '../styles/AdminPanel.css';

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
  const [activeTab, setActiveTab] = useState('stats');
  const [loading, setLoading] = useState(true);
  const [userFilter, setUserFilter] = useState('');
  const [userSort, setUserSort] = useState('name');
  const [storeSort, setStoreSort] = useState('name');
  const [searchStore, setSearchStore] = useState('');
  
  const [showUserForm, setShowUserForm] = useState(false);
  const [showStoreForm, setShowStoreForm] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    role: 'normal_user'
  });
  
  const [newStore, setNewStore] = useState({
    name: '',
    email: '',
    address: '',
    ownerId: ''
  });

  useEffect(() => {
    fetchData();
  }, [userSort, userFilter, storeSort, searchStore]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const usersResponse = await getAllUsers();
      const usersData = usersResponse?.data || usersResponse;
      
      let filtered = [];
      if (Array.isArray(usersData)) {
        filtered = usersData;
      }
      
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

      const storesResponse = await getAllStores({ search: searchStore, sortBy: storeSort });
      const storesData = storesResponse?.data || storesResponse;
      
      let storesList = [];
      if (Array.isArray(storesData)) {
        storesList = storesData;
      }
      
      setUsers(filtered);
      setStores(storesList);
      
      let totalRatings = 0;
      for (const store of storesList) {
        totalRatings += store.total_ratings || 0;
      }
      
      setStats({
        totalUsers: filtered.length,
        totalStores: storesList.length,
        totalRatings: totalRatings
      });
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    
    try {
      const response = await createUser(newUser);
      setFormSuccess('User created successfully!');
      setNewUser({ name: '', email: '', password: '', address: '', role: 'normal_user' });
      setShowUserForm(false);
      fetchData();
    } catch (err) {
      setFormError(err.response?.data?.error || 'Failed to create user');
    }
  };

  const handleCreateStore = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    
    try {
      const response = await createStore(newStore);
      setFormSuccess('Store created successfully!');
      setNewStore({ name: '', email: '', address: '', ownerId: '' });
      setShowStoreForm(false);
      fetchData();
    } catch (err) {
      setFormError(err.response?.data?.error || 'Failed to create store');
    }
  };

  const storeOwners = users.filter(u => u.role === 'store_owner');

  return (
    <div className="admin-container">
      <h1>Admin Panel</h1>

      <div className="admin-tabs">
        <button
          className={`tab ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          Dashboard
        </button>
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
      ) : activeTab === 'stats' ? (
        <div className="stats-dashboard">
          <div className="stats-cards">
            <div className="stat-card">
              <h3>Total Users</h3>
              <p className="stat-number">{stats.totalUsers}</p>
            </div>
            <div className="stat-card">
              <h3>Total Stores</h3>
              <p className="stat-number">{stats.totalStores}</p>
            </div>
            <div className="stat-card">
              <h3>Total Ratings</h3>
              <p className="stat-number">{stats.totalRatings}</p>
            </div>
          </div>
        </div>
      ) : activeTab === 'users' ? (
        <div>
          {formSuccess && <div className="success-msg">{formSuccess}</div>}
          {formError && <div className="error-msg">{formError}</div>}
          
          <button 
            className="create-btn" 
            onClick={() => {
              setShowUserForm(!showUserForm);
              setFormError('');
              setFormSuccess('');
            }}
          >
            {showUserForm ? 'Cancel' : '+ Add New User'}
          </button>

          {showUserForm && (
            <div className="create-form">
              <h3>Create New User</h3>
              <form onSubmit={handleCreateUser}>
                <input
                  type="text"
                  placeholder="Full Name (20-60 characters)"
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  minLength="20"
                  maxLength="60"
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  required
                />
                <input
                  type="password"
                  placeholder="Password (8-16 chars, 1 uppercase, 1 special)"
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  minLength="8"
                  maxLength="16"
                  required
                />
                <input
                  type="text"
                  placeholder="Address (max 400 characters)"
                  value={newUser.address}
                  onChange={(e) => setNewUser({...newUser, address: e.target.value})}
                  maxLength="400"
                />
                <select 
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                  required
                >
                  <option value="normal_user">Normal User</option>
                  <option value="store_owner">Store Owner</option>
                  <option value="system_admin">System Admin</option>
                </select>
                <button type="submit">Create User</button>
              </form>
            </div>
          )}

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
          {formSuccess && <div className="success-msg">{formSuccess}</div>}
          {formError && <div className="error-msg">{formError}</div>}
          
          <button 
            className="create-btn" 
            onClick={() => {
              setShowStoreForm(!showStoreForm);
              setFormError('');
              setFormSuccess('');
            }}
          >
            {showStoreForm ? 'Cancel' : '+ Add New Store'}
          </button>

          {showStoreForm && (
            <div className="create-form">
              <h3>Create New Store</h3>
              <form onSubmit={handleCreateStore}>
                <input
                  type="text"
                  placeholder="Store Name (20-60 characters)"
                  value={newStore.name}
                  onChange={(e) => setNewStore({...newStore, name: e.target.value})}
                  minLength="20"
                  maxLength="60"
                  required
                />
                <input
                  type="email"
                  placeholder="Store Email"
                  value={newStore.email}
                  onChange={(e) => setNewStore({...newStore, email: e.target.value})}
                  required
                />
                <textarea
                  placeholder="Store Address (max 400 characters)"
                  value={newStore.address}
                  onChange={(e) => setNewStore({...newStore, address: e.target.value})}
                  maxLength="400"
                  rows="3"
                  required
                />
                <select 
                  value={newStore.ownerId}
                  onChange={(e) => setNewStore({...newStore, ownerId: e.target.value})}
                  required
                >
                  <option value="">Select Store Owner</option>
                  {storeOwners.map(owner => (
                    <option key={owner.id} value={owner.id}>
                      {owner.name} ({owner.email})
                    </option>
                  ))}
                </select>
                <button type="submit">Create Store</button>
              </form>
            </div>
          )}

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
