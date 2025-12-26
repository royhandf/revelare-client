# Revelare

A modern book discovery and management platform built with Next.js. Search for books, save your favorites, and manage your reading list.

## Features

- 🔍 **Book Search** - Search books with multiple similarity algorithms
- 📚 **Book Details** - View comprehensive book information
- 🔖 **Bookmarks** - Save and manage your favorite books
- 🔐 **Authentication** - Secure sign in/sign up with NextAuth.js
- 📱 **Responsive** - Mobile-friendly design

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Authentication**: NextAuth.js
- **HTTP Client**: Axios
- **Notifications**: Sonner

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/royhandf/revelare-client.git
cd revelare-client
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env.local` file:

```env
NEXT_PUBLIC_API_URL=your_api_url
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── app/
│   ├── (guest)/          # Public pages (home, book list, book detail)
│   ├── (dashboard)/      # Admin dashboard pages
│   ├── api/auth/         # NextAuth API routes
│   └── layout.tsx        # Root layout
├── components/
│   ├── ui/               # shadcn/ui components
│   └── navbar.tsx        # Navigation component
├── lib/
│   ├── services/         # API service functions
│   └── utils.ts          # Utility functions
└── public/               # Static assets
```

## License

MIT
