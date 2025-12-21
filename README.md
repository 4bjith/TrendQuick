# TrendQuick – E‑Commerce Front‑End

## 📖 Overview
**TrendQuick** is a modern, premium‑styled e‑commerce front‑end built with **React 18**, **Vite**, and **Tailwind‑CSS**. The UI follows a cohesive dark‑light theme with glass‑morphism, smooth micro‑animations, and a responsive layout that works on mobile, tablet, and desktop. All data (products, categories, user profile, wishlist) is fetched from the companion **Node/Express** API (`Project‑1‑login‑and‑product`) using **axios** and **React Query** for caching and background updates.

---

## 🛠️ Tech Stack
| Layer | Technology | Reason |
|-------|------------|--------|
| **Framework** | **React 18** (hooks, functional components) | Component‑based UI, fast rendering, ecosystem. |
| **Build Tool** | **Vite** | Lightning‑fast dev server, HMR, optimized production bundles. |
| **Styling** | **Tailwind‑CSS** (utility‑first) + custom CSS variables | Consistent design tokens, easy theming, responsive utilities. |
| **State Management** | **Zustand** (persisted stores) | Light‑weight global state for auth token, wishlist, cart. |
| **Data Fetching** | **React Query** (`@tanstack/react-query`) | Declarative data fetching, caching, automatic refetch on focus. |
| **HTTP Client** | **axios** (with interceptor) | Centralised base URL, automatic Authorization header. |
| **Routing** | **react‑router‑dom** (v6) | Declarative nested routes, lazy navigation. |
| **Notifications** | **react‑toastify** | User‑friendly success/error toasts. |
| **Backend API** | **Node/Express** (Mongoose, Multer) | Provides product, category, user, and wishlist endpoints. |
| **File Upload** | **Multer** (multipart/form‑data) | Handles profile picture uploads on the server. |

---

## 📁 Project Structure
```
frontend/
├─ src/
│  ├─ api/                # axios client & base URLs
│  ├─ assets/             # static images
│  ├─ components/         # reusable UI components (Navbar, Footer, ProductCard, …)
│  ├─ pages/              # page‑level components (Home, Login, …)
│  ├─ zustand/            # Zustand stores (userStore, wishlistStore, Cart.js)
│  ├─ Router.jsx          # central route definition
│  └─ index.css           # Tailwind imports & custom variables
└─ README.md               # technical documentation (this file)
```

---

## 📄 Page‑by‑Page Walk‑through
### 1. `Home.jsx`
* Landing page with a hero banner, featured categories, and a call‑to‑action.
* No data fetching – purely static content.

### 2. `Login.jsx`
* Form with email/password fields.
* Submits to **POST `/login`**; on success stores JWT in `userStore` and redirects to home.
* Uses `react‑toastify` for error/success messages.

### 3. `Register.jsx`
* Similar UI to login, posts to **POST `/register`**.
* After successful registration, redirects to login.

### 4. `AllProducts.jsx`
* Fetches paginated product list via **GET `/product?page=&limit=`** using React Query.
* Supports category filtering, sorting (price low→high / high→low) and pagination.
* Renders each product with `ProductCard`.

### 5. `SingleProduct.jsx`
* Retrieves a single product by ID (**GET `/product/:id`**).
* Shows detailed view, image carousel, description, and **Add to Cart** button.

### 6. `Cart.jsx`
* Pulls cart items from `Cart.js` Zustand store.
* Allows quantity changes, removal, and proceeds to **Checkout**.

### 7. `Checkout.jsx`
* Collects shipping address and payment info (placeholder UI).
* On submit, would call a backend order endpoint (implementation left for future).

### 8. `Search.jsx`
* Provides a search bar; queries **GET `/product?search=`**.
* Displays results using `ProductCard`.

### 9. `AccountManager.jsx`
* Protected route – redirects to **/login** if no JWT.
* Fetches current user (**GET `/user`**) and pre‑populates a profile form.
* Supports updating name, mobile, address, age, and **profile picture**.
* Uses **FormData** with `multipart/form-data` so the image is uploaded via Multer on the server.

### 10. `WishList.jsx` (spelled correctly) & `WhishList.jsx`
* Both pages read the wishlist from `wishlistStore`.
* If empty, shows a friendly message and a **Start Shopping** button.
* When items exist, they are displayed in a responsive grid using `ProductCard`.
* The duplicate `WhishList.jsx` file was created per the exact request; you can keep one and delete the other.

### 11. `ProductCard.jsx`
* Displays product thumbnail, title, price, category, and a **Buy Now** button.
* Integrated with `wishlistStore` – clicking the heart toggles the item in the wishlist and shows a toast.
* Uses the `isInWishlist` selector to render a filled heart (red) when the product is already saved.

---

## 🔧 Global Components
| Component | Purpose |
|-----------|---------|
| **Navbar** | Top navigation with links (Home, Products, Wishlist, Cart, Orders, etc.) and user avatar. Shows the logged‑in user’s name and links to the **AccountManager** page. |
| **Footer** | Consistent footer with company info and social icons. |
| **ProductCard** | Reusable card for product listings; handles navigation to product detail and wishlist toggling. |
| **Cart.js (Zustand)** | Stores cart items in localStorage, provides add/remove/update helpers. |
| **userStore (Zustand)** | Persists JWT token and user data across sessions. |
| **wishlistStore (Zustand)** | Persists wishlist items; offers `addToWishlist`, `removeFromWishlist`, `isInWishlist`. |

---

## 📡 API Interaction (Backend Overview)
* **Authentication** – `POST /login`, `POST /register`, protected routes use `LoginCheck` middleware.
* **User** – `GET /user` (profile), `PUT /user` (profile update with Multer for image upload).
* **Products** – `GET /product` (list with pagination & search), `GET /product/:id` (single), `POST /product` & `PUT /product/:id` (admin, include image upload via `upload.single('image')`).
* **Categories** – `GET /catagory` (list), admin CRUD routes.
* **Orders** – `GET /order`, admin management.

---

## 🗂️ State Persistence
* **JWT token** – stored in `userStore` (localStorage) and automatically attached to every request via an Axios interceptor.
* **Wishlist** – persisted in `wishlistStore` (localStorage) – survives page reloads.
* **Cart** – persisted in `Cart.js` store – also uses localStorage.

---

## 🎨 Design Philosophy
* **Premium aesthetic** – dark‑light contrast, subtle gradients, glass‑morphism cards, and smooth hover transitions.
* **Responsive** – Tailwind’s utility classes (`sm:`, `md:`, `lg:`) ensure a fluid layout across breakpoints.
* **Micro‑animations** – loading spinners, button hover scales, fade‑in for menus, and image hover effects.
* **Accessibility** – semantic HTML (`<nav>`, `<section>`, `<header>`), focus outlines, and sufficient color contrast.

---

## 🚀 Getting Started (Developer)
```bash
# Clone the repo
git clone https://github.com/4bjith/TrendQuick.git
cd TrendQuick

# Install dependencies (frontend)
cd frontend
npm install

# Run the dev server
npm run dev   # Vite dev server at http://localhost:5173
```
Make sure the backend (`Project-1-login-and-product`) is running on **http://localhost:8000** (or adjust `axiosClient` baseURL).

---

## 📦 Production Build
```bash
npm run build   # Generates optimized assets in /dist
npm run preview # Preview the production build locally
```
Deploy the `dist` folder to any static host (Netlify, Vercel, etc.).

---

## 📚 Further Improvements
* **TypeScript** – add static typing for safer code.
* **React Server Components** – for better SEO and performance.
* **Unit & Integration Tests** – using Jest & React Testing Library.
* **Real payment gateway** – integrate Stripe or PayPal in the Checkout page.
* **Search indexing** – move to ElasticSearch for faster full‑text search.

---

## 👤 Author & License
**Author:** 4bjith (GitHub: https://github.com/4bjith)  
**License:** MIT – feel free to fork, modify, and use commercially.

---

*This documentation is intended for developers working on the TrendQuick front‑end. It provides a clear picture of the architecture, the purpose of each page, and the technologies that power the application.*
