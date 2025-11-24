# Admin Security Configuration

## Default Password

The default admin password is: **`admin123`**

⚠️ **IMPORTANT**: Change this password in production!

## How to Change the Password

Edit the file: `src/admin/Login.jsx`

Find this line (around line 15):
```javascript
const correctPassword = 'admin123'
```

Change it to your desired password:
```javascript
const correctPassword = 'your-secure-password-here'
```

## Security Features

1. **Password Protection**: Admin panel requires password to access
2. **Session Management**: 
   - Sessions expire after 24 hours
   - Stored in sessionStorage (cleared when browser closes)
3. **Auto-logout**: Session expires automatically after 24 hours
4. **Cross-tab Logout**: Logging out in one tab logs out all tabs

## Accessing Admin Panel

1. Navigate to: `http://localhost:5173/xyz-portal.html` (or your network IP)
2. Enter the admin password
3. Click "Login"

**Note**: The admin route is `/xyz-portal.html` for security (not obvious like `/admin.html`)

## Logout

Click the "Logout" button in the admin sidebar to securely log out.

## Recommendations for Production

1. **Change the default password** immediately
2. **Use a strong password** (at least 12 characters, mix of letters, numbers, symbols)
3. **Consider adding**:
   - Rate limiting for login attempts
   - Two-factor authentication (2FA)
   - Server-side authentication instead of client-side
   - HTTPS for encrypted connections
   - IP whitelisting for admin access

## Current Implementation

The current security is **client-side only** and suitable for:
- Development environments
- Local networks with trusted users
- Internal tools

For production/public-facing sites, consider implementing:
- Server-side authentication
- JWT tokens
- Database-backed user management
- Role-based access control (RBAC)

