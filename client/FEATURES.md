# BarterAI Features

## ✅ Implemented Features

### 1. Product Upload to Database
- ✅ Add new items to the hardcoded database (`items.js`)
- ✅ Form validation (name, description, zipcode required)
- ✅ Persistent storage within session
- ✅ Category selection (clothing, electronics, furniture, etc.)

### 2. Unified Search Bar
- ✅ Single search component used across Landing and Home pages
- ✅ Search by zipcode and radius
- ✅ Automatic location detection (mock implementation)
- ✅ Search parameters preserved when navigating from Landing to Home

### 3. Image Upload Functionality  
- ✅ Image file selection and preview
- ✅ Base64 encoding for storage (mock persistent storage)
- ✅ Image display in listings
- ✅ Fallback for items without images

### 4. Find Equivalent Button (AI-like Matching)
- ✅ Smart item similarity scoring algorithm
- ✅ Matches by category, keywords, and location
- ✅ Displays similarity scores
- ✅ Shows most to least equivalent items
- ✅ Real-time results display

### 5. Google Maps Integration
- ✅ Mock Google Maps implementation (no API key required)
- ✅ Items displayed on map by zipcode
- ✅ Interactive markers with item information
- ✅ Search radius visualization
- ✅ Map/List view toggle
- ✅ Location preview in upload modal

## 🎯 How to Use

### Adding a New Item
1. Click "Upload item" button
2. Fill in required fields (Name*, Description*, Zipcode*)
3. Optionally select category and upload image
4. Click "Find equivalent" to see similar items
5. Click "Upload" to add to database

### Searching for Items
1. Enter zipcode in search bar
2. Adjust search radius using slider
3. Click "Search" or use "Detect your location"
4. Toggle between Map and List views

### Finding Similar Items
1. When uploading an item, fill in name and description
2. Click "Find equivalent" button
3. View ranked list of similar items with scores
4. Higher scores indicate better matches

## 🗂️ Database Structure

Each item contains:
- `id`: Unique identifier
- `name`: Item name
- `description`: Detailed description
- `category`: Item category
- `zipcode`: Location zipcode
- `radius`: Search radius in miles
- `image`: Base64 encoded image or null

## 🔧 Technical Implementation

### Mock Systems Used
- **Image Storage**: Base64 encoding (in production, use cloud storage)
- **Google Maps**: Mock visualization (in production, add API key)
- **Location Detection**: Mock coordinates mapping
- **Database**: In-memory array (in production, use real database)

### AI Matching Algorithm
The similarity algorithm considers:
- **Category Match**: +50 points for same category
- **Keyword Matching**: +10 points per matching word
- **Location Bonus**: +20 points for same zipcode
- **Minimum Threshold**: Items with 0 score are filtered out

## 🚀 Development Setup

```bash
npm install
npm run dev
```

The application will be available at `http://localhost:5174`

## 📱 Pages

- **Landing Page** (`/`): Search interface with location detection
- **Home Page** (`/home`): Main listing view with map/list toggle
- **Dashboard** (`/dashboard`): Additional features (placeholder)

All features work with hardcoded data and don't require external APIs for demonstration purposes.