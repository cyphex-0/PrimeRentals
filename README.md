# RentNest Frontend

## Prerequisites
- Node.js (v18 or newer)
- npm or yarn

## Environment Variables
Before running the application, you must set up your environment variables. Copy the `.env.example` file to `.env.local`:
```bash
cp .env.example .env.local
```
Fill in the following variables:
- `NEXT_PUBLIC_API_URL`: The base URL for your backend API.
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key for processing payments.

## Local Development
```bash
npm install
npm run dev
```

## Production Build
```bash
npm run build
npm start
```

## Deploying to Vercel

1. Push your code to a GitHub, GitLab, or Bitbucket repository.
2. Log in to [Vercel](https://vercel.com/) and click **Add New** > **Project**.
3. Import your repository from the Git provider.
4. In the **Configure Project** section, open the **Environment Variables** dropdown.
5. Add the required environment variables:
   - `NEXT_PUBLIC_API_URL`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
6. Click **Deploy**. Vercel will automatically detect that it's a Next.js App Router project and run the optimized build.
