# React Flowbite Permeson

A complete application for managing personal and business profiles with secure authentication, built with React, TypeScript, Flowbite, and Tailwind CSS.

## 🚀 Features

### Authentication & Security
- Complete JWT authentication system
- User registration with email activation
- Password recovery via email
- Activation email resend
- Private route protection
- Global authentication context

### Profile Management
- **Personal Profile (Individual)**:
  - Complete personal information
  - Contact data and addresses
  - Banking information
  - Professional history
  - Education and courses
  - Related files
  
- **Business Profile (Company)**:
  - Company information
  - Business data and contacts
  - Addresses and banking information
  - Partners and collaborators
  - Image gallery
  - Related documents

### Posts/Blog System
- Post creation and editing
- Draft and publication system
- Estimated reading time
- Complete content management

### Collaboration & Workspaces
- Personal and business workspace system
- Add and remove collaborators
- Owner permission control
- User search for invitations

### Interface & Experience
- Modern and responsive interface with Flowbite
- Light/dark theme with persistence
- Internationalization (PT, EN, ES)
- Reusable components
- Toast notification system
- Intuitive navigation with collapsible sidebar

## 🛠️ Technologies Used

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + Flowbite
- **Routing**: React Router DOM
- **Internationalization**: i18next + react-i18next
- **HTTP Client**: Axios
- **Authentication**: JWT Decode
- **Icons**: React Icons
- **Utilities**: Class Variance Authority, CLSX, Tailwind Merge

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ or Bun
- NPM, Yarn, or Bun

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd react-flowbite-permeson
```

2. Install dependencies:
```bash
# With npm
npm install

# With yarn
yarn install

# With bun
bun install
```

3. Configure environment variables:
```bash
# Create a .env.local file based on .env.example
cp .env.example .env.local
```

4. Start the development server:
```bash
# With npm
npm run dev

# With yarn
yarn dev

# With bun
bun dev
```

5. Access the application at `http://localhost:5173`

## 🏗️ Project Structure

```
src/
├── api/                    # API configurations
├── components/             # Reusable components
│   ├── common/            # Common components (Modal, Toast, etc.)
│   ├── data/              # Data components (DataTable)
│   ├── form/              # Form components
│   ├── layout/            # Application layouts
│   ├── navigation/        # Navigation components
│   ├── pages/             # Page-specific components
│   └── workspace/         # Workspace components
├── contexts/              # React contexts (Auth, Theme, Toast)
├── hooks/                 # Custom hooks
├── locales/               # Translation files
├── models/                # TypeScript interfaces
├── pages/                 # Application pages
├── router/                # Route configuration
├── services/              # API services
├── styles/                # Global styles
└── utils/                 # Utilities
```

## 📱 Pages & Features

### Public Pages
- **Home** (`/`): Landing page with presentation
- **Login** (`/auth/login`): User authentication
- **Register** (`/auth/register`): Account creation
- **Forgot Password** (`/auth/forgot-password`): Password recovery
- **Reset Password** (`/auth/reset-password/:token`): Reset via token
- **Resend Activation** (`/auth/resend-activation`): Email resend

### Protected Pages
- **Dashboard** (`/dashboard`): Main dashboard
- **Profile** (`/profile`): Personal/business profile management
- **Posts** (`/posts`): Post listing and management
- **Create Post** (`/posts/new`): New post creation
- **Edit Post** (`/posts/:id/edit`): Edit existing post
- **Workspace** (`/workspace`): Collaborator management
- **Settings** (`/settings`): Account settings

## 🎨 Main Components

### Layout Components
- `MainLayout`: Main layout with navbar and footer
- `AuthLayout`: Layout for authentication pages
- `DashboardLayout`: Dashboard layout with sidebar

### Form Components
- `KuInput`: Custom input field
- `KuSelect`: Custom selector
- `KuButton`: Reusable button
- `KuFile`: File upload
- `KuArray`: Dynamic array management

### Common Components
- `KuModal`: Reusable modal
- `KuToast`: Notification system
- `KuNavbar`: Navigation bar
- `KuFooter`: Application footer

## 🌐 Internationalization

The application supports multiple languages:
- **Portuguese (pt)**: Default language
- **English (en)**: Complete translation
- **Spanish (es)**: Complete translation

To add a new language:
1. Create a file in `src/locales/[language].json`
2. Configure in `src/i18n.ts`
3. Add the option to the language selector

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server

# Build
npm run build        # Generate production build
npm run preview      # Preview production build

# Linting
npm run lint         # Run ESLint
```

## 🤝 Contributing

1. Fork the project
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

## 📄 License

This project is under the MIT license. See the [LICENSE](LICENSE) file for more details.

## 🏢 Kunlatek

Developed by the Kunlatek team - Innovative solutions for your business.

---

**Rapida Quickstart** - A complete platform for profile management with secure authentication and role control.
