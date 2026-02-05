#  Fashion E-Commerce Platform

A full-stack **fashion e-commerce web application** that allows users to browse products, manage carts, and place orders.  
The platform is designed with **clean UI, scalable backend architecture**, and real-world e-commerce workflows.

An optional smart feature helps **reduce returns using intelligent size & fit recommendations**.

---

## ✨ Features

### Core E-Commerce
- User authentication (Signup / Login)
- Browse products by category
- Product details with size & color variants
- Add to cart and update cart
- Checkout and order placement
- Order history tracking
- Admin dashboard for product & order management

### Extra (Advanced) Feature
- Intelligent size & fit recommendation
- Size confidence score
- “Fits like your previous purchase” indicator
- Return reason tracking

---

## 🧱 Tech Stack

### Frontend
- React
- Responsive UI (Mobile + Desktop)

### Backend
- Node.js
- Express.js
- REST APIs
- JWT Authentication

### Database
- MongoDB
- Mongoose ODM

---
## ⚙️ Prerequisites

Make sure you have the following installed:

- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local or Atlas)

---

## 🔐 Environment Variables

Create a `.env` file inside the **server/** folder.

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

---
## Getting Started
### 1. Clone the repository:
```bash
git clone https://github.com/MeetRamatri/Fashion-E-Commerce.git
cd fashion-e-commerce
cd server
npm install
npm run dev
cd ../client
npm install
npm start
```

Your frontend will be available at http://localhost:3000 and the backend at http://localhost:5000.
