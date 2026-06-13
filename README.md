# PharmaPrep Uganda 🇺🇬

Uganda's #1 online study platform for pharmacy students preparing for pre-licensure and post-internship licensing examinations.

## Tech Stack
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, shadcn/ui
- **Database**: Prisma + PostgreSQL (Supabase)
- **Auth**: NextAuth.js (Credentials + Google OAuth)
- **Payments**: Flutterwave (MTN MoMo, Airtel Money, Card)
- **Cache**: Upstash Redis
- **Email**: Resend
- **Media**: Cloudinary
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Editor**: TipTap

## Getting Started

### 1. Install dependencies
```bash
npm install --legacy-peer-deps
```

### 2. Set up environment variables
```bash
cp .env.example .env.local
# Fill in your actual credentials
```

### 3. Set up the database
```bash
npm run db:push       # Push schema to Supabase
npm run db:generate   # Generate Prisma client
npm run db:seed       # Seed with 12 subjects + content
```

### 4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Default Accounts (after seeding)
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@pharmaprep.ug | Admin@1234 |
| Student | aisha@student.ug | Student@1234 |

## Deployment
Deploy to Vercel with one click. Set all environment variables in Vercel dashboard.

```bash
npx vercel --prod
```
