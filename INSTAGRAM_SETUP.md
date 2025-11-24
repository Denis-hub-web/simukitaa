# Instagram Basic Display API Setup Guide

This guide will help you set up the Instagram Basic Display API to display your Instagram posts on your website.

## Step 1: Create Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/apps/)
2. Click **"Create App"**
3. Select **"Consumer"** as the app type
4. Fill in:
   - **App Name**: Simukitaa Store (or your choice)
   - **App Contact Email**: Your email
   - Click **"Create App"**

## Step 2: Add Instagram Basic Display Product

1. In your app dashboard, find **"Add Product"** or go to **Settings → Basic**
2. Click **"Add Product"** next to **"Instagram Basic Display"**
3. Click **"Set Up"** on the Instagram Basic Display card

## Step 3: Configure Instagram Basic Display

1. Go to **Instagram Basic Display** in the left sidebar
2. Under **"Basic Display"**, click **"Create New App"**
3. Fill in:
   - **App Name**: Simukitaa Store Instagram Feed
   - **Valid OAuth Redirect URIs**: 
     - For local: `http://localhost:3001/instagram/callback`
     - For production: `https://your-domain.com/instagram/callback`
   - **Deauthorize Callback URL**: Same as above
   - **Data Deletion Request URL**: Same as above
4. Click **"Save Changes"**

## Step 4: Add Test User (for development)

1. Go to **Roles → Roles** in the left sidebar
2. Under **"Instagram Testers"**, click **"Add Instagram Testers"**
3. Enter your Instagram username: `simukitaa_`
4. Click **"Add"**
5. **Important**: Go to your Instagram account settings and accept the test invitation

## Step 5: Generate Access Token

### Option A: Using Facebook's Token Generator (Easiest)

1. Go to **Instagram Basic Display → User Token Generator**
2. Click **"Generate Token"**
3. Select your Instagram account
4. Authorize the app
5. Copy the **Access Token** (this is a short-lived token, valid for 1 hour)

### Option B: Using OAuth Flow (For Production)

You'll need to implement an OAuth flow. For now, use Option A for testing.

## Step 6: Exchange for Long-Lived Token

The token from Step 5 is short-lived (1 hour). Exchange it for a long-lived token (60 days):

```bash
curl -X GET "https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=YOUR_APP_SECRET&access_token=SHORT_LIVED_TOKEN"
```

Replace:
- `YOUR_APP_SECRET`: Found in **Settings → Basic → App Secret**
- `SHORT_LIVED_TOKEN`: The token from Step 5

Response will include:
```json
{
  "access_token": "LONG_LIVED_TOKEN",
  "token_type": "bearer",
  "expires_in": 5183944
}
```

## Step 7: Set Environment Variable

Add the long-lived token to your server environment:

### Local Development

Create `server/.env` file:
```env
INSTAGRAM_ACCESS_TOKEN=your_long_lived_token_here
INSTAGRAM_CACHE_SECONDS=900
INSTAGRAM_POST_LIMIT=8
```

### Production (Render/Railway)

1. Go to your hosting platform dashboard
2. Navigate to your service → **Environment Variables**
3. Add:
   - `INSTAGRAM_ACCESS_TOKEN`: Your long-lived token
   - `INSTAGRAM_CACHE_SECONDS`: `900` (optional, default 15 minutes)
   - `INSTAGRAM_POST_LIMIT`: `8` (optional, default 8 posts)

## Step 8: Install Dependencies

Make sure axios is installed in your server:

```bash
cd server
npm install axios
```

## Step 9: Refresh Token Before Expiry

Long-lived tokens expire after ~60 days. Refresh them before expiry:

```bash
curl -X GET "https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=YOUR_LONG_LIVED_TOKEN"
```

**Important**: Set a reminder to refresh the token every 50 days, or automate this process.

## Troubleshooting

### "Invalid OAuth Access Token"
- Token may have expired
- Regenerate a new token and update your environment variable

### "User not authorized"
- Make sure you accepted the test invitation in Instagram settings
- Check that your Instagram account is added as a test user

### "Rate limit exceeded"
- Instagram has rate limits (200 requests per hour per user)
- The cache (15 minutes) helps reduce API calls
- If you hit limits, increase `INSTAGRAM_CACHE_SECONDS`

### Posts not showing
1. Check server logs for errors
2. Verify `INSTAGRAM_ACCESS_TOKEN` is set correctly
3. Test the API endpoint: `http://localhost:3001/api/instagram`
4. Check browser console for frontend errors

## API Endpoints

- **Get Posts**: `GET /api/instagram`
- Returns array of Instagram posts with:
  - `id`: Post ID
  - `caption`: Post caption
  - `media_url`: Image/video URL
  - `permalink`: Link to Instagram post
  - `media_type`: `IMAGE` or `VIDEO`
  - `like_count`: Number of likes
  - `comments_count`: Number of comments
  - `timestamp`: Post timestamp

## Security Notes

- **Never commit** your access token to Git
- Keep tokens in environment variables only
- Rotate tokens if they're accidentally exposed
- Use HTTPS in production

## Next Steps

Once set up, your Instagram posts will automatically appear on your website! The feed refreshes every 15 minutes (configurable via `INSTAGRAM_CACHE_SECONDS`).



