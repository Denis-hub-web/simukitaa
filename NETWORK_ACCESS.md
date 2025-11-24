# Network Access Guide

## How to Access the App from Another Device on Your Network

### Step 1: Find Your Computer's IP Address

**On Windows:**
1. Open Command Prompt or PowerShell
2. Type: `ipconfig`
3. Look for "IPv4 Address" under your active network adapter (usually "Wireless LAN adapter Wi-Fi" or "Ethernet adapter")
4. It will look like: `192.168.1.xxx` or `10.0.0.xxx`

**On Mac/Linux:**
1. Open Terminal
2. Type: `ifconfig` or `ip addr`
3. Look for your network interface (usually `en0` or `eth0`)
4. Find the `inet` address (IPv4)

### Step 2: Start the Servers

**Terminal 1 - Start the Backend Server:**
```bash
cd server
npm start
```

**Terminal 2 - Start the Frontend:**
```bash
npm run dev
```

The server will automatically display your network IP address when it starts!

### Step 3: Access from Another Device

1. Make sure both devices are on the **same Wi-Fi network**
2. On your other device (phone, tablet, another computer), open a web browser
3. Enter the URL:
   ```
   http://YOUR_IP_ADDRESS:5173
   ```
   Replace `YOUR_IP_ADDRESS` with the IP address from Step 1
   
   Example: `http://192.168.1.100:5173`

### Step 4: Access Admin Panel

To access the admin panel from another device:
```
http://YOUR_IP_ADDRESS:5173/xyz-portal.html
```

Example: `http://192.168.1.100:5173/xyz-portal.html`

## Troubleshooting

### Can't Connect?
1. **Check Firewall**: Make sure Windows Firewall allows connections on ports 5173 and 3001
   - Go to Windows Defender Firewall → Advanced Settings
   - Add inbound rules for ports 5173 and 3001

2. **Check Network**: Ensure both devices are on the same network

3. **Check IP Address**: Make sure you're using the correct IP address (not 127.0.0.1 or localhost)

4. **Check Server Status**: Make sure both servers are running and you see the network IP in the console

### Firewall Settings (Windows)

To allow connections:
1. Open Windows Defender Firewall
2. Click "Advanced Settings"
3. Click "Inbound Rules" → "New Rule"
4. Select "Port" → Next
5. Select "TCP" and enter port `5173` → Next
6. Select "Allow the connection" → Next
7. Check all profiles → Next
8. Name it "Vite Dev Server" → Finish

Repeat for port `3001` (name it "API Server")

## Quick Test

After starting the servers, you should see:
```
🚀 Server running!
   Local:   http://localhost:3001
   Network: http://192.168.1.xxx:3001
```

Use the Network URL on your other device!

