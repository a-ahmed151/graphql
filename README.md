# 🌐 Reboot01 Dashboard: Digital Gate

A high-performance, cyberpunk-inspired data visualization platform built for the Reboot01 (01Edu) network. This dashboard provides students with a real-time, aesthetically rich overview of their progression, skills, and activity.

![Cyberpunk Dashboard](https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1200)

## 🚀 Key Features

### 💎 "Digital Gate" Aesthetics
- **Cyberpunk UI**: A dedicated dark-mode first design system featuring glassmorphism, neon accents (Cyan/Primary, Purple/Secondary, Amber/Accent), and futuristic typography.
- **Micro-Animations**: Shimmer effects on progress bars, pulse animations on status icons, and smooth transitions.
- **Theme-Aware**: Fully functional light/dark mode switching with consistent contrast and legibility.

### 📊 Advanced Data Visualization
- **XP History (Evolution Path)**: A 6-month cumulative trend chart visualizing total experience growth over time.
- **Core Skills Ranking**: A horizontal bar chart identifying the top 5 technical proficiencies.
- **Skills Matrix**: Dedicated multi-radar chart view for Technical vs Technology categorization.
- **Audit Ratio Index**: Real-time visualization of "Up" vs "Down" audit ratios with stability tracking.

### 🛠 Tech Stack
- **Framework**: [Vite](https://vitejs.dev/) + [React](https://reactjs.org/)
- **Routing**: [TanStack Router](https://tanstack.com/router) (Type-safe, file-based routing)
- **Data Fetching**: [TanStack Query](https://tanstack.com/query) + [GraphQL Request](https://github.com/prisma-labs/graphql-request)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [Shadcn UI](https://ui.shadcn.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🛠 Getting Started

### Prerequisites
- [Bun](https://bun.sh/) (Recommended) or Node.js

### Installation
```bash
# Clone the repository
git clone <repository-url>

# Install dependencies
bun install
```

### Development
```bash
# Start the development server
bun dev

# Run GraphQL Code Generator (watch mode)
bunx --bun graphql-code-generator --watch
```

### Production Build
```bash
bun run build
```

---

## 📂 Project Structure
- `src/api`: GraphQL queries and custom hooks.
- `src/components`: Reusable UI components (Digital Cards, Charts, Forms).
- `src/routes`: File-based routing (Profile, Skills, Projects).
- `src/lib`: Utility functions and global theme configs.

## 🔑 Environment Variables
Create a `.env` file in the root:
```env
# Optional: Set your project ID if using specific cloud services
GOOGLE_CLOUD_PROJECT=your_project_id
```

## 📜 License
Internal use for Reboot01 Students & Staff.
