# Farmlink-2024

A MERN stack e-commerce platform connecting farmers (vendors) directly with buyers. Vendors list agricultural products; buyers browse, add to cart, and place orders.

## Project Structure

```
farming_system-main/
├── backend/          Express.js API server (port 1783)
├── frontend/         Buyer & vendor React app (port 6464)
└── admin/            Admin React dashboard (port 6463)
```

## Tech Stack

- **Backend:** Node.js, Express, MongoDB (Atlas), Mongoose, JWT, bcryptjs, Multer
- **Frontend:** React 18, React Router v6, Axios, React Toastify
- **Auth:** JWT-based (role: user / vendor / admin)

## Quick Start

### 1. Backend setup

```bash
cd backend
cp .env.example .env        # fill in your values
npm install
npm run dev
```

Required `.env` variables:

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Random string, min 32 characters |
| `PORT` | Server port (default `1783`) |
| `ALLOWED_ORIGINS` | Comma-separated frontend URLs |
| `NODE_ENV` | `development` or `production` |

### 2. Frontend setup

```bash
cd frontend
cp .env.example .env        # set REACT_APP_API_URL if needed
npm install
npm start                   # starts on port 6464
```

### 3. Admin setup

```bash
cd admin
npm install
npm start                   # starts on port 6463
```

> **Note:** The admin app currently uses backend JWT auth via `/api/admin/login`. Register an admin account once via the API, then use those credentials to log in.

## API Overview

All routes are prefixed with the backend base URL (`http://localhost:1783`).

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/register` | Register buyer |
| POST | `/api/login` | Login buyer |
| POST | `/api/vendor/register` | Register vendor |
| POST | `/api/vendor/login` | Login vendor |
| POST | `/api/admin/login` | Login admin |

### Products & Categories
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/getproduct` | Public | List all products |
| POST | `/api/postproduct` | Vendor/Admin | Add product (multipart/form-data) |
| DELETE | `/api/deleteproduct/:id` | Vendor/Admin | Delete product (vendors: own only) |
| GET | `/api/getcategory` | Public | List categories |
| POST | `/api/postcategory` | Vendor/Admin | Add category |
| DELETE | `/api/deletecategory/:id` | Vendor/Admin | Delete category |
| GET | `/api/filterbycategory/:name` | Public | Filter products by category |

### Cart & Orders
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/addtocart/:productid` | User | Add to cart |
| GET | `/api/getCartItems` | User | Get cart items |
| DELETE | `/api/removeFromCart/:productid` | User | Remove from cart |
| POST | `/api/postorder` | User | Place order |
| GET | `/api/getorder` | Vendor/Admin | Get orders for this vendor |
| DELETE | `/api/deleteorder/:id` | User | Delete order |

### AI Recommendations
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/recommendations/:productId` | Public | Similar products to a given product |
| GET | `/api/trending` | Public | Products trending based on recent orders |

### Contact
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/postcontactus` | Public | Submit contact message |
| GET | `/api/getcontactus` | Vendor/Admin | View all messages |
| DELETE | `/api/deletecontactus/:id` | Vendor/Admin | Delete message |

### Admin
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/admin/getvendors` | Admin | List all vendors |
| DELETE | `/api/admin/deletevendors/:id` | Admin | Delete vendor + their products/orders |

## User Roles

| Role | Capabilities |
|---|---|
| `user` | Browse, cart, place orders, contact |
| `vendor` | All user capabilities + manage own products/categories, view own orders |
| `admin` | All vendor capabilities + manage all vendors |

## AI Features

**Smart Recommendations** (`/api/recommendations/:productId`)
- Returns up to 6 products similar to the viewed product
- Scoring: same category (+10 points), similar price range ±30% (+5 points)
- Shown in the "You might also like" section on the product page
- Falls back to trending if no similar products found

**Trending Products** (`/api/trending`)
- Returns up to 6 products most ordered in the last 30 days
- Falls back to newest products when no order history exists
- Shown on the Home page "Trending Products" section
- Zero cost — no external API required

## Security Notes

- JWT tokens are signed with a strong secret from environment variables
- CORS is restricted to listed origins only (no wildcard `*`)
- Image uploads validated for MIME type (JPEG/PNG/WebP) and size (max 5 MB)
- Admin and vendor management routes require authenticated JWT + role check
- Product deletion verifies vendor ownership before allowing delete
- Passwords hashed with bcryptjs (10 salt rounds)
- Error stack traces only visible in `NODE_ENV=development`

## Known Limitations & Future Work

- No payment gateway (orders are COD / WhatsApp-based)
- No email verification on registration
- No real-time notifications (could add WebSockets)
- No unit/integration tests
- Admin frontend still uses a basic credential check — connect it to the `/api/admin/login` backend endpoint
- Consider adding Redis for token blacklisting (proper logout)
- Consider adding Stripe/PayPal for online payments
- Add pagination to product listings for large inventories
