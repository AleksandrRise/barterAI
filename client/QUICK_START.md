# BarterAI - Quick Start Guide

## 🚀 Immediate Setup (2 minutes)

### 1. Start Development
```bash
cd client
npm install
npm run dev
```
App runs at: http://localhost:5174

### 2. Add Google Maps (Optional)
Replace in `.env.local`:
```
VITE_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

## 🎯 Test Core Features

### Feature 1: Upload & Find Similar Items
1. Click **"Upload New Item"** button
2. Fill form: Name, Description, Category, Zipcode
3. Click **"Find Similar Items"** → See AI matching results
4. **Click any similar item** → Opens chat interface

### Feature 2: Chat & Trading
1. **Click any item** in main listings
2. **Send messages** → Get automatic replies
3. Click **"Propose Trade"** → Opens confirmation modal
4. **Check agreement box** → Confirms your side
5. **Wait 3 seconds** → Other party auto-confirms
6. **Get meetup address** → Trade complete!

### Feature 3: Google Maps
1. Enter zipcode **"95192"** → Navigate to Home
2. Click **"Map View"** toggle
3. See **color-coded pins** across the map
4. **Click any pin** → Rich popup with item details

## 🏠 Your Location
- Currently set to **San Jose, CA (95192)**
- **13 local items** available in San Jose area
- **25 total items** across entire US

## 📱 Quick Navigation
- **/** → Landing page with search
- **/home** → Main app with listings/map
- **/dashboard** → Placeholder page

## 🎨 Visual Guide
- **Blue pins/items** = Electronics 📱
- **Red pins/items** = Clothing 👕  
- **Yellow pins/items** = Furniture 🪑
- **Green pins/items** = Sports ⚽
- **Purple pins/items** = Music 🎵
- **Orange pins/items** = Books 📚

## 🔍 Key Files to Know
- `src/shared/utils/items.js` → All data & functions
- `src/components/shared/ChatInterface.jsx` → Chat & trading
- `src/components/shared/MapComponent.jsx` → Google Maps
- `src/components/home/UploadItemModal.jsx` → Item upload

## ⚡ Everything Works!
✅ Upload items → ✅ AI matching → ✅ Chat system → ✅ Trading flow → ✅ Google Maps → ✅ Search → ✅ Beautiful UI

**Ready to code!** 🎉