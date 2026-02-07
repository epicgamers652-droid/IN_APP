# IN - Full Instagram Clone 📸

A complete, production-ready Instagram clone with all features fully functional. **NO DEMO MODE** - everything requires real MongoDB!

## 🎯 What's Included

✅ **100% Functional Instagram Clone**
- Authentication with JWT & bcrypt
- Feed with posts, likes, comments
- User profiles with customization
- Public/private accounts
- User blocking & follow requests
- Direct messages
- Stories & Reels
- Explore & discover users
- Activity notifications
- Saved posts collection
- Hashtag support

## 🚀 Quick Start

### 1. Prerequisites
- Node.js 18+
- MongoDB (Atlas or local)

### 2. Setup MongoDB
See `SETUP.md` for detailed instructions

### 3. Configure
```bash
cp .env.example .env.local
# Edit .env.local with your MongoDB URI and JWT secret
```

### 4. Install & Run
```bash
npm install
npm run dev
```

Visit `http://localhost:3000`

## 📖 Full Documentation
See `SETUP.md` for complete setup guide

## 🏗️ Tech Stack
- Next.js 16, React 19
- MongoDB + Mongoose
- Tailwind CSS 4
- Zustand, JWT, bcryptjs

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
