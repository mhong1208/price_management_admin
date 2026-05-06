# Price Management Admin Dashboard

A professional, high-performance admin dashboard for managing items, suppliers, and multi-currency pricing with detailed audit history tracking. Built with **Next.js**, **Ant Design**, and **AG Grid**.

## 🚀 Key Features

- **📦 Item Management**: Full CRUD operations for products with categorized filtering and automated code generation.
- **🏬 Supplier Management**: Manage supplier profiles, contact details, and tax information.
- **💰 Price Management**: Setup and track item prices across different suppliers with multi-currency support and effective date management.
- **📜 Price History Audit**: Detailed audit logs for every price change, including old/new values, update time, and action types.
- **🕒 Timezone Consistency**: Specialized handling for Vietnam Timezone (UTC+7) to ensure date accuracy across global deployments.
- **⚡ High Performance Grid**: Utilizes **AG Grid** for fast data rendering, inline editing, and smooth pagination.
- **🌍 Localization**: Fully localized in English with a premium, responsive UI.

## 🛠️ Technology Stack

- **Framework**: [Next.js 14+](https://nextjs.org/) (App Router)
- **UI Components**: [Ant Design (Antd)](https://ant.design/)
- **Data Grid**: [AG Grid](https://www.ag-grid.com/)
- **Date Utilities**: [Day.js](https://day.js.org/) (with UTC and Timezone plugins)
- **Styling**: Vanilla CSS (Global Design System)
- **API Client**: Axios with centralized service pattern

## 📁 Project Structure

```text
src/
├── app/               # Next.js App Router (Pages)
├── components/        # UI Components
│   ├── layout/        # Sidebar, Header, Breadcrumbs
│   └── shared/        # Reusable BaseGrid, TableActions
├── services/          # API Services (.NET Backend integration)
├── interfaces/        # TypeScript Definitions
├── constants/         # App routes and enums
└── utils/             # Date formatting and helpers
```

## 🚦 Getting Started

### Prerequisites

- Node.js 18.x or higher
- yarn (Preferred)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/mhong1208/price_management_admin.git
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

3. Configure environment variables:
   Create a `.env.local` file and add your backend API URL:
   ```env
   NEXT_PUBLIC_API_URL=http://your-dotnet-api-url/api
   ```

4. Run the development server:
   ```bash
   yarn dev
   ```


## 👷 CI/CD

The project includes a GitHub Actions workflow (`ci.yml`) that automatically:
- Installs dependencies
- Validates the build process
- Prepares for production deployment
