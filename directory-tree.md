# Project Directory Structure

```
finora/
├── public/
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── index.ts
│   │   ├── dashboard/
│   │   │   ├── advisory/
│   │   │   ├── client/
│   │   │   ├── sales/
│   │   │   ├── support/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── landing/
│   │   │   └── page.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── charts/
│   │   ├── skeleton/
│   │   ├── ui/
│   │   ├── add-client.tsx
│   │   ├── add-csv.tsx
│   │   ├── app-header.tsx
│   │   ├── app-sidebar.tsx
│   │   ├── client-table.tsx
│   │   ├── dynamic-form.tsx
│   │   └── index.ts
│   ├── contexts/
│   │   └── filter-context.tsx
│   ├── hooks/
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   ├── lib/
│   │   ├── dummydata.ts
│   │   ├── dummyleads.ts
│   │   ├── types.ts
│   │   └── utils.ts
│   ├── styles/
│   │   └── colors.ts
│   ├── utils/
│   │   └── index.ts
│   ├── data.csv
│   ├── filter-bar.tsx
│   ├── middleware.ts
│   └── sql for db.txt
├── .env.example
├── README.md
├── components.json
├── eslint.config.mjs
├── finddup.js
├── next.config.ts
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

This tree structure shows the organization of your Next.js application, including:

- `/public`: Static assets like SVG files
- `/src/app`: Main application routes and pages
- `/src/components`: Reusable React components
- `/src/contexts`: React context providers
- `/src/hooks`: Custom React hooks
- `/src/lib`: Utility functions and data
- `/src/styles`: Styling related files
- `/src/utils`: Helper functions
- Configuration files in the root directory