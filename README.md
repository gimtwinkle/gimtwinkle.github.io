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

### Contact room

The pink mailbox opens a letter composer for `beingnami2023@gmail.com`. Sending opens the visitor's mail app; the site does not send mail itself.
The guestbook opens a prefilled GitHub Issue in `gimtwinkle/gimtwinkle.github.io`; visitors sign in and confirm submission on GitHub.
Open issues whose titles start with `[방명록]` appear in the room's guestbook. Close an issue to hide its entry.
The guestbook reads the latest 100 open issues, displays up to 12 matching entries, and links to the complete GitHub list. Its public API response is cached in memory for one minute; the refresh button bypasses this cache.

### About room models

Runtime furniture assets are in `public/models/about-optimized/`. Their original GLBs remain in `public/models/about/`.
After changing a source model, run `npm run optimize:models` to regenerate the runtime assets and size report.
The script resizes embedded textures to at most 1024px and simplifies meshes above 100,000 triangles with a 0.1% relative geometry error limit, preserving mesh borders and vertex attributes. It leaves furniture transforms unchanged.

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
