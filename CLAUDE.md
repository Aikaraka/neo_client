# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the **frontend** of the Neo AI interactive novel platform, built with:
- **Framework**: Next.js 15 (App Router)
- **React**: 19.0.0 RC
- **Language**: TypeScript
- **Styling**: TailwindCSS with Radix UI components
- **State Management**: Zustand, React Query (@tanstack/react-query)
- **Authentication**: Supabase Auth with SSR support (@supabase/ssr)
- **Error Tracking**: Sentry

## Development Commands

```bash
pnpm install              # Install dependencies
pnpm dev                  # Start dev server (http://localhost:3000)
pnpm build                # Build for production
pnpm start                # Start production server
pnpm lint                 # Run ESLint
```

## Directory Structure

```
app/
├── (auth)/              # Auth route group (login, signup, settings)
│   ├── _api/           # Auth-specific server actions
│   └── auth/
│       ├── setting/
│       └── (account)/
├── create/              # Novel creation workflow
│   ├── _api/           # Creation-specific server actions
│   └── _components/    # Creation-specific components
├── novel/               # Novel reading and interaction
│   ├── [id]/           # Dynamic route for specific novel
│   └── _api/           # Novel API functions (FastAPI integration)
├── library/             # User's novel library
├── mypage/              # User profile and settings
├── admin/               # Admin dashboard
├── api/                 # Route handlers (webhooks, public APIs)
│   ├── image-proxy/
│   └── sentry-example-api/
├── _components/         # App-wide shared components
├── _api/                # App-wide shared server actions
└── globals.css          # Global styles

components/              # Reusable UI components
├── ui/                 # shadcn/ui components (Radix UI based)
├── common/             # Common components (Header, Footer, etc.)
└── layout/             # Layout components

utils/                  # Utility functions
├── supabase/          # Supabase client utilities
│   ├── client.ts      # Browser client
│   ├── server.ts      # Server-side client
│   └── authProvider.tsx  # Auth context provider
└── image.ts           # Image processing utilities
```

## Architecture Patterns

### Route Groups

Routes in parentheses `(name)` are **route groups** - they organize routes without affecting the URL structure:
- `(auth)/` - Authentication-related pages (login, signup, settings)
- `(auth)/(account)/` - Nested account management pages

### Server Actions vs Route Handlers

**Server Actions** (`*.server.ts` files):
- Located in `_api/` directories within route folders
- Use `"use server"` directive at the top
- Handle form submissions and authenticated database operations
- Direct access to Supabase with RLS (Row Level Security)
- Examples: `app/(auth)/_api/auth.server.ts`, `app/create/_api/createNovel.server.ts`

```typescript
"use server";
import { createClient } from '@/utils/supabase/server';

export async function yourAction(data: FormData) {
  const supabase = await createClient();
  // RLS automatically enforced
  const { data, error } = await supabase.from('table').select('*');
  return data;
}
```

**Route Handlers** (`route.ts` files):
- Located in `app/api/*/route.ts`
- Handle webhooks, image proxying, public endpoints
- Export functions named after HTTP methods: `GET`, `POST`, `PUT`, `DELETE`

```typescript
export async function GET(request: Request) {
  // Handle GET request
  return Response.json({ data: "hello" });
}
```

### Component Naming Conventions

- **Page Components**: `page.tsx` - Next.js page files
- **Client Components**: `*Client.tsx` - Components with `"use client"` directive
- **Server Actions**: `*.server.ts` - Server-side functions
- **Internal Components**: `_components/` - Route-specific components (not exposed as routes)
- **Shared Components**: `components/` - Reusable across the app

## API Communication Patterns

### Calling FastAPI Backend

**Method 1: From Client Component** (most common):
```typescript
// For standard API calls
import { novelAIServer } from "@/app/novel/_api";

const response = await novelAIServer.post("/init-story", {
  user_id: session.user.id,
  novel_id: novelId
});
// JWT token automatically injected via axios interceptor
```

**Method 2: Streaming Responses** (for `/process-novel`):
```typescript
const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/process-novel`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${session.access_token}`
  },
  body: JSON.stringify({ user_id, novel_id, input })
});

// Handle SSE stream
const reader = response.body?.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;

  const chunk = decoder.decode(value);
  // Process SSE data
}
```

**Method 3: From Server Action**:
```typescript
"use server";
import { novelAiServerForServer } from "@/api/serverInstance";

const response = await novelAiServerForServer.post("/endpoint", data);
```

### Supabase Database Operations

**From Client Component**:
```typescript
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();
const { data, error } = await supabase
  .from('novels')
  .select('*')
  .eq('user_id', userId);
```

**From Server Action or Server Component**:
```typescript
import { createClient } from "@/utils/supabase/server";

const supabase = await createClient();
const { data, error } = await supabase
  .from('novels')
  .select('*');
// RLS policies automatically filter by authenticated user
```

## Authentication Flow

### Auth Context (`utils/supabase/authProvider.tsx`)

The app uses `AuthProvider` to manage authentication state:

```typescript
import { AuthProvider } from "@/utils/supabase/authProvider";

export default function RootLayout({ children }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
```

**Using auth in components**:
```typescript
"use client";
import { useAuth } from "@/utils/supabase/authProvider";

function MyComponent() {
  const { session, user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!session) return <div>Not logged in</div>;

  return <div>Hello, {user.email}</div>;
}
```

### Protected Routes

Server-side protection in Server Components:
```typescript
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  return <div>Protected content</div>;
}
```

## State Management

### Zustand Stores

Located in `app/*/stores/` or at component level for local state:

```typescript
import { create } from 'zustand';

interface StoreState {
  count: number;
  increment: () => void;
}

export const useStore = create<StoreState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));
```

### React Query (TanStack Query)

For server state management and caching:

```typescript
import { useQuery } from '@tanstack/react-query';

function MyComponent() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['novels', userId],
    queryFn: async () => {
      const response = await fetch('/api/novels');
      return response.json();
    },
  });
}
```

## UI Components

### Radix UI + TailwindCSS

The app uses shadcn/ui components (Radix UI primitives + TailwindCSS):
- All UI components in `components/ui/`
- Customizable via `components.json` configuration
- Styling utilities: `clsx`, `tailwind-merge`, `class-variance-authority`

```typescript
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";

function MyComponent() {
  return (
    <Dialog>
      <Button variant="default">Click me</Button>
    </Dialog>
  );
}
```

### Common Component Patterns

**Motion animations** (Framer Motion):
```typescript
import { motion } from "motion/react";

<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
>
  Content
</motion.div>
```

## Image Handling

### Image Compression

The app includes client-side image compression (`browser-image-compression`):

```typescript
import imageCompression from 'browser-image-compression';

const options = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1920,
  useWebWorker: true
};

const compressedFile = await imageCompression(file, options);
```

### Supabase Storage Upload

```typescript
const supabase = createClient();

const { data, error } = await supabase.storage
  .from('bucket-name')
  .upload(`${userId}/${filename}`, file);

if (data) {
  const { data: { publicUrl } } = supabase.storage
    .from('bucket-name')
    .getPublicUrl(data.path);
}
```

## React 19 RC Considerations

This project uses **React 19 RC** - some features may be unstable:
- Always check library compatibility before adding new dependencies
- Server Actions are native in React 19 (no longer experimental)
- `useFormStatus` and `useFormState` are stable
- New `use()` hook for Promises and Context

## Error Handling

### Sentry Integration

Errors are automatically tracked by Sentry:
- `app/global-error.tsx` - Global error boundary
- `app/error.tsx` - Route-level error boundaries
- `app/sentry-example-page/` - Sentry test page

### Error Boundary Pattern

```typescript
"use client";
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div>
      <h2>Something went wrong</h2>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

function MyComponent() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      {/* Your component */}
    </ErrorBoundary>
  );
}
```

## Development Best Practices

- **Always use TypeScript** - No `.js` files
- **Use Server Components by default** - Add `"use client"` only when needed
- **Prefer Server Actions** over API routes for form submissions
- **Use Supabase RLS** - Let the database handle authorization
- **Image optimization** - Use Next.js `<Image>` component or compress before upload
- **Environment variables** - Prefix public vars with `NEXT_PUBLIC_`
- **Error handling** - Always wrap async operations in try-catch
- **Loading states** - Use `loading.tsx` or Suspense boundaries

## Key Files to Know

- `app/layout.tsx` - Root layout with AuthProvider, React Query, Sentry
- `app/novel/_api/index.ts` - FastAPI axios instance with JWT injection
- `utils/supabase/client.ts` - Browser Supabase client
- `utils/supabase/server.ts` - Server-side Supabase client
- `utils/supabase/authProvider.tsx` - Authentication context provider
- `components/ui/*` - shadcn/ui components

## Common Tasks

### Adding a New Protected Route

1. Create `app/your-route/page.tsx`
2. Add server-side session check:
```typescript
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function YourPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect("/login");

  return <div>Your content</div>;
}
```

### Adding a New Server Action

1. Create `app/your-route/_api/yourAction.server.ts`
2. Add `"use server"` directive:
```typescript
"use server";
import { createClient } from "@/utils/supabase/server";

export async function yourAction(formData: FormData) {
  const supabase = await createClient();
  // Your logic
}
```

### Calling FastAPI from Client

1. Import the configured axios instance:
```typescript
import { novelAIServer } from "@/app/novel/_api";
```
2. Make the API call (JWT auto-injected):
```typescript
const response = await novelAIServer.post("/endpoint", data);
```

## Related Documentation

- See root `CLAUDE.md` for overall architecture
- See `neo_server/CLAUDE.md` for backend service details
