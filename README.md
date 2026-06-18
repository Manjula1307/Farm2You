# 🌾 Farm2You — Farm to Consumer Marketplace

> A full-stack marketplace that directly connects farmers with consumers — no middlemen, fairer prices, fresher produce.

**🔗 Live Demo:** [https://farm2-you-frontend.vercel.app](https://farm2-you-frontend.vercel.app)
**📦 Repository:** [https://github.com/Manjula1307/Farm2You](https://github.com/Manjula1307/Farm2You)

---

## 📸 Screenshots

| Landing Page | Consumer Shop |
|---|---|
| ![Homepage](./screenshots/homepage.png) | ![Consumer](./screenshots/consumer-dashboard.png) |

| Farmer Dashboard |
|---|
| ![Farmer](./screenshots/farmer-dashboard.png) |

---

## 💡 Why Farm2You?

Traditional supply chains have 3–4 middlemen between a farmer and the end consumer — each one taking a cut, driving up prices and reducing farmer earnings. Farm2You eliminates this entirely by creating a direct digital marketplace.

- **Farmers earn more** — no commission taken by the platform
- **Consumers pay less** — no middleman markup
- **Fresher produce** — direct farm-to-door delivery

---

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based secure authentication
- Role-based access — Farmer and Consumer are completely separate experiences
- Protected API routes with middleware
- Passwords hashed with bcrypt

### 👨‍🌾 Farmer Portal
- Dedicated farmer dashboard (farmers never see the consumer shop)
- Add, edit, and delete produce listings
- Set price per unit, quantity, category, and description
- View and manage incoming orders from consumers
- Update order status — Confirm → Delivered

### 🛒 Consumer Shop
- Clean product browsing with category filter and search
- Browse farmers and filter produce by farmer
- Rich order flow — quantity picker, delivery address, preferred time slot, payment method, note to farmer
- 2-step order confirmation with full summary before placing
- Low stock warnings on product cards
- Out-of-stock items shown but disabled
- Order history with expandable details and live status tracking

### 🏠 Guest Landing Page
- Marketing landing page for unauthenticated users
- Clear explanation of the platform for both roles
- Separate CTAs for farmers and consumers

---

## 🛠️ Tech Stack

### Frontend
| Technology | Usage |
|---|---|
| React.js | UI framework |
| Vite | Build tool |
| Tailwind CSS | Styling |
| Axios | HTTP client with JWT interceptor |
| React Context API | Auth state management |
| Lucide React | Icons |

### Backend
| Technology | Usage |
|---|---|
| Node.js + Express.js | REST API server |
| JWT (jsonwebtoken) | Authentication tokens |
| bcryptjs | Password hashing |
| mysql2 | MySQL database driver |
| dotenv | Environment config |

### Database
| Technology | Usage |
|---|---|
| MySQL | Relational database |
| Railway | Cloud MySQL hosting |

### Deployment
| Service | What it hosts |
|---|---|
| Vercel | React frontend |
| Render | Node.js backend |
| Railway | MySQL database |

---

## 🏗️ System Architecture

```
User Browser
     │
     ▼
React Frontend (Vercel)
     │  Axios + JWT
     ▼
Express REST API (Render)
     │  mysql2
     ▼
MySQL Database (Railway)
```

---

## 🔐 Authentication Flow

1. User registers with name, email, password, and role (farmer/consumer)
2. Password is hashed with bcrypt (12 rounds)
3. JWT token generated on login/register
4. Token stored in localStorage
5. Axios interceptor attaches `Authorization: Bearer <token>` to every request
6. Backend middleware verifies token and checks role before allowing access

---

## 🗄️ Database Schema

```sql
users         — id, name, email, password, role, phone, address
produce       — id, farmer_id, name, description, category,
                price_per_unit, unit, quantity_available, image_url, is_available
orders        — id, consumer_id, total_amount, status, delivery_address
order_items   — id, order_id, produce_id, farmer_id, quantity,
                price_per_unit, subtotal
```

---

## 📁 Project Structure

```
Farm2You/
├── frontend/
│   ├── src/
│   │   ├── api/            # Axios instance with JWT interceptor
│   │   ├── components/     # ProductCard, FarmerCard, ContactModal
│   │   ├── context/        # AuthContext (login, register, logout)
│   │   ├── hooks/          # useProduce (fetches from API)
│   │   ├── pages/          # AuthPage, ConsumerHome, FarmerDashboard, MyOrders
│   │   └── App.jsx         # Role-based routing
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── config/
│   │   ├── db.js           # MySQL connection pool
│   │   └── schema.sql      # Database schema
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── produceController.js
│   │   └── orderController.js
│   ├── middleware/
│   │   └── auth.js         # JWT verify, isFarmer, isConsumer
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── produceRoutes.js
│   │   └── orderRoutes.js
│   └── server.js
│
└── README.md
```

---

## 🔌 API Reference

### Auth
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register as farmer or consumer |
| POST | `/api/auth/login` | Public | Login and get JWT token |
| GET | `/api/auth/me` | Protected | Get current user profile |

### Produce
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/produce` | Public | Browse all available produce |
| GET | `/api/produce/:id` | Public | Get single produce detail |
| GET | `/api/produce/farmer/my-listings` | Farmer only | Get own listings |
| POST | `/api/produce` | Farmer only | Add new listing |
| PUT | `/api/produce/:id` | Farmer only | Update listing |
| DELETE | `/api/produce/:id` | Farmer only | Delete listing |

### Orders
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/orders` | Consumer only | Place an order |
| GET | `/api/orders/my-orders` | Consumer only | View order history |
| GET | `/api/orders/:id` | Consumer only | View single order |
| GET | `/api/orders/farmer/incoming` | Farmer only | View incoming orders |
| PUT | `/api/orders/:id/status` | Farmer only | Update order status |

---

## ⚙️ Local Setup

### Prerequisites
- Node.js v18+
- MySQL 8.0+

### 1. Clone the repository

```bash
git clone https://github.com/Manjula1307/Farm2You.git
cd Farm2You
```

### 2. Set up the database

```bash
mysql -u root -p
```

```sql
CREATE DATABASE farm2you;
USE farm2you;
-- Run the contents of backend/config/schema.sql
```

### 3. Backend setup

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=farm2you
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
```

```bash
npm run dev
```

### 4. Frontend setup

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

```bash
npm run dev
```

Frontend: `http://localhost:5173`
Backend: `http://localhost:5000`

---

## 🚀 Deployment

| Service | Config |
|---|---|
| **Vercel** | Connect GitHub repo → set `VITE_API_URL` to Render backend URL |
| **Render** | Web Service → Node → set all backend env variables |
| **Railway** | MySQL plugin → copy connection string to Render env vars |

---

## 🔮 Future Improvements

- [ ] Payment gateway integration (Razorpay)
- [ ] Real-time order tracking with WebSockets
- [ ] Product image upload (Cloudinary)
- [ ] Farmer analytics dashboard with charts
- [ ] Product reviews and ratings
- [ ] Push notifications for order updates
- [ ] AI-based produce recommendations

---

## 👩‍💻 Author

**Manjula Satapathi** — Full Stack Developer

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?style=flat&logo=linkedin)](https://www.linkedin.com/in/manjula-satapathi)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-black?style=flat&logo=github)](https://github.com/Manjula1307)

---

## 📄 License

Built for educational and portfolio purposes.
