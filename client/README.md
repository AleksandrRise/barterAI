# BarterAI

A modern local trading platform that connects people who want to exchange items without using money. Features AI-powered item analysis, intelligent barter suggestions, and integrated Google Maps for location-based trading.

## Features

- **Smart Item Upload**: Take a photo and let AI categorize and value your items
- **Intelligent Matching**: AI suggests the best barter opportunities based on your preferences
- **Location-Based**: Find traders near you with integrated Google Maps
- **Real-Time Chat**: Communicate with potential trading partners
- **Secure Trading**: Built-in safety measures and trade confirmation system

## Quick Start

1. **Installation**
   ```bash
   npm install
   ```

2. **Environment Setup**
   Create a `.env.local` file:
   ```
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key
   VITE_OPENAI_API_KEY=your_openai_key
   ```

3. **Development**
   ```bash
   npm run dev
   ```

4. **Production Build**
   ```bash
   npm run build
   ```

## API Keys Required

- **Google Maps API**: For location services and map display
- **OpenAI API**: For AI-powered item analysis and barter suggestions

## Tech Stack

- React 19 + Vite
- TailwindCSS 4
- Google Maps JavaScript API
- OpenAI GPT-4o-mini
- React Router

## Deployment

Ready for deployment on Vercel, Netlify, or any static hosting platform.

## License

MIT
