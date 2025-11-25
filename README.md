# Michael Njogu's Portfolio

A modern, performant portfolio website built with React, TypeScript, Vite, and Contentful CMS. Features smooth animations, accessible design patterns, and a headless CMS architecture for easy content management.

## 🚀 Features

- **⚡ Lightning Fast**: Built with Vite and optimized for performance
- **🎨 Modern UI**: Smooth animations powered by Framer Motion
- **📱 Responsive Design**: Mobile-first approach using React Bootstrap
- **♿ Accessible**: WCAG-compliant with ARIA labels and semantic HTML
- **🔄 Dynamic Content**: Headless CMS integration with Contentful
- **🌗 Dark Mode**: Theme toggle with persistent user preference
- **📝 TypeScript**: Type-safe development with full TypeScript support
- **🔍 SEO Optimized**: Dynamic meta tags and proper document structure
- **🎯 Live Preview**: Contentful Live Preview integration for real-time editing

## 🛠️ Tech Stack

### Core
- **React 19.2** - UI library
- **TypeScript 5.9** - Type safety
- **Vite (Rolldown)** - Build tool & dev server
- **React Router 7.9** - Client-side routing

### Styling & Animation
- **Bootstrap 5.3** - CSS framework
- **React Bootstrap 2.10** - Bootstrap components for React
- **Framer Motion 12.23** - Animation library
- **IBM Plex Sans** & **Libre Caslon Text** - Typography

### CMS & Content
- **Contentful** - Headless CMS
- **@contentful/rich-text-react-renderer** - Rich text rendering
- **@contentful/live-preview** - Real-time content preview

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript ESLint** - TypeScript-specific linting rules

## 📦 Installation

### Prerequisites
- **Node.js** 18+ and npm/pnpm/yarn
- **Contentful Account** with Space ID and API tokens

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Michael-K-Njogu/my-portfolio-vite.git
   cd my-portfolio-vite
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   # or
   yarn install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_CONTENTFUL_SPACE_ID=your_space_id
   VITE_CONTENTFUL_DELIVERY_TOKEN=your_delivery_token
   VITE_CONTENTFUL_PREVIEW_TOKEN=your_preview_token
   ```

   **Getting Contentful Credentials:**
   - Sign up at [contentful.com](https://www.contentful.com/)
   - Create a new space or use an existing one
   - Navigate to **Settings → API keys**
   - Copy your **Space ID**, **Content Delivery API token**, and **Content Preview API token**

4. **Start the development server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🏗️ Project Structure

```
my-portfolio-vite/
├── public/                  # Static assets
│   ├── images/             # Image assets
│   │   └── icons/          # Favicon and app icons
│   └── robots.txt          # SEO crawler instructions
├── src/
│   ├── components/         # React components
│   │   ├── AllCaseStudies.tsx    # Case studies listing page
│   │   ├── CaseStudyDetail.tsx   # Individual case study page
│   │   ├── layout/               # Layout components
│   │   │   ├── Header.tsx        # Navigation header with theme toggle
│   │   │   └── Footer.tsx        # Footer with social links
│   │   └── ui/                   # Reusable UI components
│   │       ├── BackToTop.tsx     # Scroll-to-top button
│   │       ├── Hero.tsx          # Homepage hero section
│   │       ├── LoadingSpinner.tsx # Animated loading component
│   │       ├── ProjectNav.tsx    # Case study navigation
│   │       └── Timeline.tsx      # Experience timeline
│   ├── pages/             # Route pages
│   │   ├── About.tsx      # About/Profile page
│   │   ├── NotFound.tsx   # 404 page
│   │   └── Profile.tsx    # Profile page
│   ├── styles/            # Global styles
│   │   └── main.css       # Main stylesheet
│   ├── docs/              # Static documents (resume, etc.)
│   ├── images/            # Local image assets
│   ├── App.jsx            # Main App component with routing
│   ├── main.tsx           # Application entry point
│   ├── contentfulClient.ts # Contentful client configuration
│   └── vite-env.d.ts      # Vite environment types
├── index.html             # HTML entry point
├── vite.config.ts         # Vite configuration
├── tsconfig.json          # TypeScript configuration
├── eslint.config.js       # ESLint configuration
├── package.json           # Dependencies and scripts
└── README.md              # Project documentation
```

## 📜 Available Scripts

```bash
# Development
npm run dev          # Start dev server at localhost:5173

# Production Build
npm run build        # Build for production to dist/

# Preview Production Build
npm run preview      # Preview production build locally

# Linting
npm run lint         # Run ESLint on all files
```

## 🎨 Key Features & Components

### Theme Toggle
- Persistent dark/light mode using `localStorage`
- Smooth transitions with Framer Motion
- Icon animation on theme switch

### Custom Loading Spinner
- Reusable `LoadingSpinner` component with animated ring and pulsing dots
- Supports randomized loading messages from an array
- Configurable sizes: `sm`, `md`, `lg`
- Theme-aware using CSS variables
- Used across all async data loading states

**Usage Examples:**
```tsx
// Single message
<LoadingSpinner message="Loading profile..." />

// Randomized messages
<LoadingSpinner messages={["Fetching data…", "Almost there…", "Loading…"]} />

// Custom size and height
<LoadingSpinner size="lg" minHeight="100vh" />
```

### Email Obfuscation
- Client-side email assembly to prevent bot scraping
- Character code encoding for enhanced protection
- Maintains accessibility with proper ARIA labels

### Dynamic Content from Contentful

The portfolio pulls content dynamically from Contentful for:
- **Case Studies** - Project showcases with rich media
- **About Page** - Biography, skills, tools, certifications
- **Work Experience** - Professional timeline
- **Certifications** - Educational achievements and badges

### Animation Variants
- Smooth page transitions
- Staggered list animations
- Interactive hover states
- Scroll progress indicator on case study pages
- Avatar flip animation on Profile page

## 🔧 Configuration

### Contentful Content Models

Expected content types in Contentful:

1. **`caseStudy`** - Portfolio projects
   - Fields: title, subtitle, slug, isFeatured, featuredImage, organization, hasNda
   - Rich text fields: overview, context, designProcess, results, takeaways
   - Arrays: role, team, skills
   - Order field for sorting

2. **`aboutPage`** - About page content
   - Fields: aboutHeroTitle, aboutHeroSubtitle, aboutHeroPrimaryLinkLabel, aboutHeroPrimaryLinkUrl
   - Resume: uploadResume (asset), uploadResumeTitle
   - Arrays: coreSkills (text), coreTools (references), experience (references), certifications (references)

3. **`tool`** - Tools & technologies
   - Fields: toolName, toolPurpose, toolIcon (asset), toolIconInverted (boolean)

4. **`experience`** - Work history
   - Fields: jobTitle, organization, duration, jobDescription
   - Optional: importance ('standard' | 'highlight'), organizationLogo (asset)

5. **`certification`** - Certifications & badges
   - Fields: certTitle, institution, dateAttained, credentialUrl
   - Optional: inProgress (boolean), institutionLogo (asset), institutionLogoInverted (boolean)

6. **`imageGallery`** - Embedded image galleries
   - Fields: title, images (array of assets), showCaptions (boolean)

### TypeScript Configuration

The project uses strict TypeScript with:
- Path aliases via `vite-tsconfig-paths`
- Contentful type definitions
- Custom environment variable types in `vite-env.d.ts`

### ESLint Configuration

- React hooks rules
- React refresh rules
- TypeScript-specific rules
- Prettier integration

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### Deployment Platforms

The project works seamlessly with:

- **Vercel** - Zero-config deployment
  ```bash
  vercel
  ```

- **Netlify** - Drag & drop or CLI
  ```bash
  netlify deploy --prod
  ```

- **GitHub Pages** - Static hosting
- **Cloudflare Pages** - Edge deployment

### Environment Variables for Production

Remember to set your environment variables in your hosting platform:
- `VITE_CONTENTFUL_SPACE_ID`
- `VITE_CONTENTFUL_DELIVERY_TOKEN`
- `VITE_CONTENTFUL_PREVIEW_TOKEN`

## 🧪 Preview Mode

To preview unpublished content from Contentful, add `?preview=true` to any URL:

```
https://your-site.com/about?preview=true
```

This uses the Preview API token and shows draft content.

## ♿ Accessibility Features

- Semantic HTML5 elements
- ARIA labels and roles
- Keyboard navigation support
- Focus management
- Color contrast compliance
- Screen reader friendly
- Skip navigation links

## 🐛 Troubleshooting

### Contentful Connection Issues

If you see errors about missing Contentful credentials:
1. Verify `.env` file exists in root directory
2. Check that all three environment variables are set
3. Restart the dev server after adding/changing `.env`

### TypeScript Errors

For `ImportMeta` type errors, ensure `src/vite-env.d.ts` exists with proper type definitions.

### Build Errors

Clear cache and reinstall:
```bash
rm -rf node_modules dist .vite
npm install
npm run build
```

## 📄 License

This project is private and proprietary.

## 👤 Author

**Michael Njogu**
- Portfolio: [https://michael-njogu.design]
- LinkedIn: [linkedin.com/in/michael-njogu](https://www.linkedin.com/in/michael-njogu/)
- GitHub: [@Michael-K-Njogu](https://github.com/Michael-K-Njogu)
- Email: Contact via portfolio

## 🙏 Acknowledgments

- [Contentful](https://www.contentful.com/) - Headless CMS
- [Vite](https://vitejs.dev/) - Build tool
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [React Bootstrap](https://react-bootstrap.github.io/) - UI components
- [React Medium Image Zoom](https://github.com/rpearce/react-medium-image-zoom) - Image zoom functionality
- [IAAP](https://www.accessibilityassociation.org/) - Accessibility best practices

---

Built with ❤️ using React, TypeScript, Vite, and Contentful
