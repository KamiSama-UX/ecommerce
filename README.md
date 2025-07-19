markdown
## 📝 License
This project is licensed under the [MIT License](LICENSE) - see the [LICENSE file](LICENSE) for details.

# 🛍️ E-commerce Backend API

A robust Node.js backend for an e-commerce platform, featuring product management, user authentication, and order processing.

![GitHub last commit](https://img.shields.io/github/last-commit/KamiSama-UX/ecommerce)
![GitHub repo size](https://img.shields.io/github/repo-size/KamiSama-UX/ecommerce)

## ✨ Features
- **JWT Authentication** - Secure user login/registration
- **Product Management** - CRUD operations for products
- **Shopping Cart** - Persistent cart functionality
- **Order Processing** - Complete purchase workflow
- **Admin Dashboard** - Protected routes for administrators
- **RESTful API** - Well-structured endpoints

## 🛠️ Technologies
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT, Bcrypt
- **Testing**: Jest, Supertest
- **Deployment**: Docker, AWS

## ⚙️ Installation
```bash
# Clone repository
git clone https://github.com/KamiSama-UX/ecommerce.git

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env

# Start development server
npm run dev
📄 Environment Variables
Create .env file with:

env
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=
JWT_SECRET=
port=5000

🌐 API Endpoints
Endpoint
/api/auth/register	POST	Register new user
/api/auth/login	POST	User login
/api/products	GET	Get all products
/api/products/:id	GET	Get single product
/api/orders	POST	Create new order
/api/users/profile	GET	Get user profile (protected)
-----------------------------------------------------------------------------