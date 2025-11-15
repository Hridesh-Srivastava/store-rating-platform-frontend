# Store Rating Platform - Frontend

A modern, responsive React application for browsing stores, submitting ratings, and managing store-related activities with role-based interfaces.

## Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Styling**: CSS3 (Custom)
- **State Management**: React Hooks

## Features Overview

### For All Users
- Browse stores with search and filter capabilities
- View detailed store information
- Sort stores by name or rating
- Responsive design for mobile and desktop

### For Normal Users
- Submit ratings for stores (1-5 stars)
- Modify previously submitted ratings
- View personal rating history
- Password management

### For Store Owners
- Dashboard with store statistics
- View average ratings and total rating count
- See detailed list of users who rated their store
- Monitor rating trends

### For System Administrators
- Comprehensive admin panel with three tabs
- User management (create, view, filter, sort)
- Store management (create, assign to owners)
- Statistics dashboard (total users, stores, ratings)

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx           # Navigation bar with role-based links
│   │   └── ProtectedRoute.jsx   # Route protection wrapper
│   ├── pages/
│   │   ├── Login.jsx            # User authentication
│   │   ├── Register.jsx         # New user registration
│   │   ├── Dashboard.jsx        # User/Owner dashboard
│   │   ├── Stores.jsx           # Store listing page
│   │   ├── StoreDetail.jsx      # Individual store page
│   │   └── AdminPanel.jsx       # Admin control panel
│   ├── services/
│   │   └── api.js               # API client configuration
│   ├── styles/
│   │   ├── Auth.css             # Authentication pages styling
│   │   ├── Dashboard.css        # Dashboard styling
│   │   ├── Stores.css           # Store listing styling
│   │   ├── StoreDetail.css      # Store detail page styling
│   │   ├── AdminPanel.css       # Admin panel styling
│   │   └── Navbar.css           # Navigation bar styling
│   ├── App.jsx                  # Main app component
│   ├── App.css                  # Global styles
│   └── main.jsx                 # Application entry point
├── index.html                   # HTML template
├── vite.config.js              # Vite configuration
└── package.json                # Dependencies
```

## User Interface Flow

```
┌─────────────────────────────────────────────────────────┐
│                    Landing Page                          │
│                   (Redirect to /stores)                  │
└────────────┬────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────┐
│                   Store Listing                          │
│  [Search] [Sort] [Filter]                               │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                │
│  │ Store 1  │ │ Store 2  │ │ Store 3  │                │
│  │ ★ 4.5    │ │ ★ 3.8    │ │ ★ 5.0    │                │
│  └──────────┘ └──────────┘ └──────────┘                │
└────────────┬────────────────────────────────────────────┘
             │ Click Store
             ▼
┌─────────────────────────────────────────────────────────┐
│                  Store Detail Page                       │
│  Store Name & Address                                    │
│  Average Rating: ★ 4.5 (24 ratings)                     │
│  ┌─────────────────────────────────┐                    │
│  │  Submit Your Rating: ☆☆☆☆☆     │                    │
│  └─────────────────────────────────┘                    │
└─────────────────────────────────────────────────────────┘

After Login:
┌─────────────────────────────────────────────────────────┐
│  System Admin Dashboard                                  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                │
│  │  Users   │ │  Stores  │ │Dashboard │                │
│  │   Tab    │ │   Tab    │ │   Tab    │                │
│  └──────────┘ └──────────┘ └──────────┘                │
│  [+ Add User] [+ Add Store]                             │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  Store Owner Dashboard                                   │
│  ┌───────────────────────────────────────┐              │
│  │  My Store Statistics                   │              │
│  │  Average Rating: ★ 4.5                │              │
│  │  Total Ratings: 24                     │              │
│  │  ┌────────────────────────────────┐   │              │
│  │  │  User    | Rating | Date       │   │              │
│  │  │  John    |   5    | 2024-01-15 │   │              │
│  │  │  Sarah   |   4    | 2024-01-14 │   │              │
│  │  └────────────────────────────────┘   │              │
│  └───────────────────────────────────────┘              │
└─────────────────────────────────────────────────────────┘
```

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Steps

1. **Navigate to frontend directory**
```bash
cd store-rating-web/frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Start development server**
```bash
npm run dev
```

Application will run on `http://localhost:5173`

5. **Build for production**
```bash
npm run build
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API endpoint | `http://localhost:5000/api` |
| `VITE_SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase public key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |

## Key Components

### Navbar Component
Dynamic navigation that adapts based on user authentication and role:
- Displays "Admin" link only for system administrators
- Shows "Dashboard" for authenticated users
- Manages logout functionality

### Protected Route Component
Wraps routes that require authentication:
- Verifies JWT token presence
- Checks user roles for restricted pages
- Redirects unauthorized users to login

### Dashboard Component
Role-specific dashboard with different views:
- **Store Owner**: Displays store statistics, ratings, and user details
- **Normal User**: Shows password update form
- **Admin**: Redirects to admin panel

### Admin Panel Component
Three-tab interface for system management:
1. **Dashboard Tab**: Statistics cards showing totals
2. **Users Tab**: User management with create form
3. **Stores Tab**: Store management with owner assignment

## Routing Configuration

```javascript
/ → /stores (redirect)
/login → Login page
/register → Registration page
/stores → Public store listing
/stores/:id → Store detail page
/dashboard → Protected (user/owner dashboard)
/admin → Protected (system_admin only)
```

## State Management

Local state management using React hooks:
- `useState` for component state
- `useEffect` for data fetching
- `useNavigate` for programmatic navigation
- `localStorage` for JWT token and user info

## API Integration

### Authentication Flow
```javascript
// Login
POST /api/auth/login
→ Receive JWT token
→ Store in localStorage
→ Redirect to dashboard

// Registration
POST /api/auth/signup
→ Receive JWT token
→ Store user info
→ Redirect to dashboard
```

### Data Fetching Pattern
```javascript
useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await apiCall();
      setData(response.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, [dependencies]);
```

## Styling Approach

Custom CSS with modern design principles:
- **Responsive Design**: Mobile-first approach
- **Color Scheme**: Professional blue-gray palette
- **Typography**: Clean, readable fonts
- **Animations**: Smooth transitions and hover effects
- **Layout**: Flexbox and Grid for responsive layouts

### Design System
```css
Primary Colors:
- Main: #3498db (Blue)
- Dark: #2c3e50 (Navy)
- Success: #27ae60 (Green)
- Warning: #f39c12 (Orange)
- Danger: #e74c3c (Red)

Spacing:
- xs: 0.25rem
- sm: 0.5rem
- md: 1rem
- lg: 1.5rem
- xl: 2rem
```

## Form Validation

Client-side validation rules:
- **Name**: 20-60 characters
- **Email**: Valid email format
- **Password**: 8-16 characters, 1 uppercase, 1 special character
- **Address**: Maximum 400 characters

## Performance Optimizations

- Debounced search input (300ms delay)
- Lazy loading for routes
- Efficient re-rendering with proper key props
- Axios interceptors for token management
- Error boundary for graceful error handling

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Responsive Breakpoints

```css
Mobile: < 768px
Tablet: 768px - 1024px
Desktop: > 1024px
```

## Accessibility Features

- Semantic HTML elements
- ARIA labels where needed
- Keyboard navigation support
- Focus indicators
- Alt text for images

## Development Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Deployment

### Build Process
```bash
npm run build
```
Generates optimized static files in `dist/` directory

### Deployment Options
- **Vercel**: Connect GitHub repo for automatic deployments
- **Netlify**: Drag-and-drop dist folder
- **AWS S3**: Upload to S3 bucket with CloudFront
- **Docker**: Use provided Dockerfile

## Testing

Manual testing checklist:
- [ ] User registration with all roles
- [ ] Login/logout functionality
- [ ] Store browsing and search
- [ ] Rating submission and modification
- [ ] Admin panel operations
- [ ] Store owner dashboard
- [ ] Responsive design on mobile

## Common Issues & Solutions

### Issue: Blank page after build
**Solution**: Check `vite.config.js` base path configuration

### Issue: API calls failing
**Solution**: Verify VITE_API_URL in .env file

### Issue: Token expired errors
**Solution**: Implement token refresh logic or re-login

## Future Enhancements

- Image upload for stores
- Advanced analytics for store owners
- Email notifications
- Review comments alongside ratings
- Store categories and tags
- Favorite stores feature

## Contributing

Follow these steps to contribute:
1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## License

MIT License - See LICENSE file for details

## Support

For issues or feature requests, please open an issue on GitHub.
