# Work Together

A collaborative whiteboard application for teams with real-time collaboration features, built with Next.js, Convex, and Liveblocks.

## Features

- **Real-time Collaboration**: Multiple users can work on the same board simultaneously
- **Authentication**: Secure user authentication with Clerk
- **Organization Management**: Create and manage team organizations
- **Drawing Tools**: Rectangle, ellipse, text, notes, and freehand drawing
- **Video Calls**: Integrated video calling with LiveKit
- **AI Integration**: Gemini AI for enhanced productivity
- **Board Management**: Create, edit, delete, and favorite boards
- **Export Options**: Export boards as images or PDFs
- **Responsive Design**: Works seamlessly across devices

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Convex (database and real-time sync)
- **Real-time Collaboration**: Liveblocks
- **Authentication**: Clerk
- **Video Calls**: LiveKit
- **AI**: Google Gemini AI
- **UI Components**: Radix UI, Lucide React
- **State Management**: Zustand

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (version 18 or higher)
- npm or yarn package manager

## Environment Variables

Create a `.env.local` file in the root directory and add the following environment variables:

```bash
# Convex
CONVEX_DEPLOYMENT=your_convex_deployment
NEXT_PUBLIC_CONVEX_URL=your_convex_url

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_OUT_URL=/sign-in
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# LiveKit (for video calls)
LIVEKIT_API_KEY=your_livekit_api_key
LIVEKIT_API_SECRET=your_livekit_api_secret
NEXT_PUBLIC_LIVEKIT_URL=your_livekit_url

# Google Gemini AI
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key

# Liveblocks (for real-time collaboration)
LIVEBLOCKS_SECRET_KEY=your_liveblocks_secret_key
```

## Installation

1. Clone the repository:

```bash
git clone https://github.com/FgrReloaded/work-together.git
cd work-together
```

2. Install dependencies:

```bash
npm install
```

3. Set up your environment variables as described above.

4. Set up Convex:

```bash
npx convex dev
```

5. Run the development server:

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Setup Guide

### 1. Convex Setup

- Visit [Convex](https://convex.dev) and create an account
- Create a new project and get your deployment URL
- Run `npx convex dev` to initialize your database

### 2. Clerk Authentication

- Go to [Clerk](https://clerk.dev) and create an account
- Create a new application
- Get your publishable key and secret key from the dashboard

### 3. LiveKit Video Calls

- Visit [LiveKit](https://livekit.io) and create an account
- Create a new project and get your API key and secret
- Get your WebSocket URL for real-time communication

### 4. Liveblocks Real-time Collaboration

- Go to [Liveblocks](https://liveblocks.io) and create an account
- Create a new project and get your secret key

### 5. Google Gemini AI

- Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
- Create an API key for Gemini AI

## Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint for code linting

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # Dashboard and board management
│   ├── board/[boardId]/   # Individual board pages
│   └── api/               # API routes
├── components/            # Reusable React components
├── convex/               # Convex database schema and functions
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── providers/            # Context providers
├── store/                # State management
└── types/                # TypeScript type definitions
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
