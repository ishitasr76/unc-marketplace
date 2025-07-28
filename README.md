This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

Test User format:
name: user#
email: user#@gmail.com
password:testuser#

## Email Notifications Setup

This application includes automatic email notifications to sellers when their items are purchased using EmailJS for free email sending.

### 1. Set up EmailJS (Free Email Service)

1. Sign up for a free account at [EmailJS](https://www.emailjs.com/)
2. Create an email service (Gmail, Outlook, etc.)
3. Create an email template
4. Get your credentials:
   - **Public Key**: Found in Account > API Keys
   - **Service ID**: Found in Email Services
   - **Template ID**: Found in Email Templates

### 2. Update Your Code

Replace the placeholder values in both `src/app/buy/page.tsx` and `src/app/cart/page.tsx`:

```javascript
// Replace these values:
emailjs.init("YOUR_EMAILJS_PUBLIC_KEY");
await emailjs.send(
  'YOUR_SERVICE_ID',
  'YOUR_TEMPLATE_ID',
  templateParams
);
```

### 3. EmailJS Free Tier Benefits

- **200 emails per month** (completely free)
- **No backend setup required** - works directly from frontend
- **No domain verification needed**
- **Professional email templates**
- **Easy to implement**

### 4. Email Features

- **Automatic seller notifications** when items are purchased
- **Professional email templates** with TriDealz branding
- **Complete transaction details** including buyer information
- **Safety guidelines** for completing transactions

The email system will automatically send notifications for:
- Direct purchases from item pages
- Cart purchases
- All transaction types

### 5. Email Template Variables

Your EmailJS template should include these variables:
- `{{to_email}}` - Seller's email
- `{{to_name}}` - Seller's name
- `{{from_name}}` - Buyer's name
- `{{from_email}}` - Buyer's email
- `{{item_name}}` - Item name
- `{{item_price}}` - Item price
- `{{item_description}}` - Item description
- `{{school_name}}` - School name
- `{{message}}` - Pre-formatted message
