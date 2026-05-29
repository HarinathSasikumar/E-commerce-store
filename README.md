# 🛍️ LuxeMart

> **"Experience premium products crafted for a bold and modern lifestyle."**

LuxeMart is a stunning, full-featured premium e-commerce application built with the MERN stack (MongoDB, Express.js, React, Node.js). It is designed for ambitious lifestyles with a perfect balance of style and power, featuring an ultra-luxurious, Apple-inspired light glassmorphism UI, smooth Framer Motion animations, and a seamless shopping workflow.

"Where modern technology blends seamlessly with luxury living."

---

## ✨ Features & Highlights

- **Ultra-Premium Design** — Frosted glassmorphism cards, subtle dynamic drop-shadows, and deep radial gradients that redefine the future of modern living.
- **Secure JWT Authentication** — Custom login and registration pages with beautiful floating UI elements.
- **Dynamic Homepage** — Animated hero sections, curated categories, featured & trending products.
- **Advanced Product Browsing** — Filter by category, price, rating, and sort; seamless pagination with URL-synced filters.
- **Immersive Product Details** — High-quality image gallery, quantity selector, add to cart functionality, and rich user reviews.
- **Smart Cart System** — Real-time state updates, `localStorage` persistence, and instant price calculations.
- **3-Step Checkout** — Shipping → Payment → Review → Order confirmation.
- **Order Management** — Dedicated profile section for tracking order history.

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MongoDB (local) running on `mongodb://localhost:27017`

### 1. Install Dependencies
```bash
# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### 2. Configure Environment
The `backend/.env` file is pre-configured for local MongoDB.
```env
MONGO_URI=mongodb://localhost:27017/luxemart
JWT_SECRET=your_secret_key
PORT=5000
```

### 3. Seed the Database
```bash
cd backend
npm run seed
```
This provisions the database with premium mock products across 5 categories, plus an admin account:
- **Admin**: admin@luxemart.com / admin123

### 4. Start the Servers

**Terminal 1 — Backend:**
```bash
cd backend && npm start
# Runs on http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd frontend && npm run dev
# Runs on http://localhost:5173
```

### 5. Open in Browser
Navigate to **http://localhost:5173** and explore luxury, innovation, and timeless style — all in one destination.

---

## 📁 Project Structure

```
Ecommerce/
├── backend/
│   ├── config/db.js          — MongoDB connection
│   ├── controllers/          — Route logic (auth, products, orders)
│   ├── data/                 — Seed products + seeder script
│   ├── middleware/auth.js    — JWT protection middleware
│   ├── models/               — Mongoose schemas (User, Product, Order)
│   ├── routes/               — Express route definitions
│   └── server.js             — Express entry point
└── frontend/
    └── src/
        ├── components/
        │   ├── layout/       — Navbar, Footer
        │   └── ui/           — ProductCard, Skeleton
        ├── context/          — AuthContext, CartContext
        ├── pages/            — All route pages (Home, Auth, Cart, Checkout)
        └── services/api.js   — Axios API layer
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/products` | Get products (with filters) |
| GET | `/api/products/:id` | Get single product |
| GET | `/api/products/featured`| Featured products |
| GET | `/api/products/trending`| Trending products |
| POST | `/api/products/:id/reviews` | Add review (auth) |
| POST | `/api/orders` | Create order (auth) |
| GET | `/api/orders/myorders` | My orders (auth) |
| GET | `/api/orders/:id` | Order by ID (auth) |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, Vite, React Router v6 |
| **Styling** | Vanilla CSS + CSS Variables (Light Glassmorphism Theme) |
| **Animation**| Framer Motion |
| **Icons** | React Icons (Feather) |
| **Toast** | React Hot Toast |
| **HTTP** | Axios |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB, Mongoose |
| **Auth** | JWT + bcryptjs |

---

> *"Curated premium products for people who expect more from life."*
