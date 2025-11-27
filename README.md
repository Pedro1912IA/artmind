# Art Mind – Creative Art Intelligence Platform

Art Mind is a web platform for art analysis and AI-assisted creation powered by Google Gemini. It helps artists and art enthusiasts analyze artwork, understand their artistic style, and explore creative variations.

## Features

- **Artwork Analysis** - Deep analysis of individual artworks using AI vision
- **Artistic Fingerprint** - Generate a comprehensive profile of your artistic style from multiple works
- **Creative Variations** - Generate artistic variations based on your style or specific artworks
- **Curated Collections** - AI-generated exhibition concepts tailored to your artistic DNA

## Tech Stack

- **Frontend**: Next.js 16, TypeScript, TailwindCSS
- **Backend**: Express, TypeScript, Multer
- **AI**: 
  - Google Gemini 1.5 Flash (vision + text analysis)
  - Google Gemini 2.5 Flash Image (Nano Banana - image generation)

## Project Structure

```
art-mind/
├── frontend/          # Next.js frontend
│   └── src/
│       ├── app/
│       │   ├── components/  # React components
│       │   └── page.tsx     # Main page
│       └── ...
└── backend/          # Express backend
    ├── .env          # Environment variables
    └── src/
        ├── routes/   # API routes
        ├── services/ # Business logic & AI integration
        └── server.ts # Server entry point
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Google Gemini API Key

### Installation

1. Clone the repository and install dependencies:
```bash
npm install
```

2. Configure environment variables:

Create a `.env` file in the `backend` directory:
```env
PORT=3001
GEMINI_API_KEY=your_gemini_api_key_here
```

3. Start development servers:
```bash
npm run dev
```

The frontend will be available at http://localhost:3000 and the backend at http://localhost:3001.

## API Endpoints

- `POST /api/analyze-art` - Analyze a single artwork with AI vision
  - Input: Image file (multipart/form-data)
  - Output: Detailed analysis (emotions, technical aspects, influences, etc.)

- `POST /api/fingerprint` - Generate artistic fingerprint from multiple works
  - Input: 2-10 image files (multipart/form-data)
  - Output: Comprehensive style profile with unique fingerprint ID

- `POST /api/variations` - Create artwork variations
  - Input: Image file and/or fingerprint ID
  - Output: Variation prompts and concepts

- `POST /api/create-collection` - Generate curated collection
  - Input: Fingerprint ID, desired quantity (6-12)
  - Output: Exhibition concept with curatorial narrative

## Usage Flow

1. **Upload artwork** → Get detailed AI analysis
2. **Upload 2-10 works** → Generate your artistic fingerprint
3. **Use fingerprint** → Create personalized collections
4. **Generate variations** → Explore creative directions

## Features in Detail

### 🎨 Artwork Analysis
Upload a single artwork and receive:
- Emotional analysis
- Technical breakdown (style, techniques, brushwork, lighting, composition)
- Color palette analysis
- Possible influences
- Conceptual description
- Creative opportunities
- Suggested variations

### 🔍 Artistic Fingerprint
Upload 2-10 artworks to generate:
- Recurring visual patterns
- Dominant techniques
- Preferred color palette
- Stylistic influences
- Artistic strengths
- Evolution directions
- Unique artistic DNA summary

### 🎭 Creative Variations
Generate 4 unique variations:
- From a single artwork
- From your artistic fingerprint
- With optional custom instructions
- Real AI-generated images using Gemini Imagen

### 🖼️ Curated Collections
AI-generated exhibition concepts:
- Collection title and concept
- Curatorial narrative
- 6-12 artwork prompts
- Exhibition order
- Contextualized to your style

## Notes

- Fingerprints are stored in memory (implement persistent storage for production)
- Generated images are saved to `uploads/generated/`
- All AI analysis includes fallback to mock data if API fails
- Image generation uses Gemini 2.5 Flash Image (Nano Banana)
