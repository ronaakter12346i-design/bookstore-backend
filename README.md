
# Online Bookstore Management System Backend

A RESTful API backend for an Online Bookstore Management System built with Node.js, Express, and PostgreSQL. It includes secure user authentication (JWT) and dynamic book/category management features.

## 🚀 Live Deployment
- **Vercel URL:** [https://bookstore-backend-swart.vercel.app/](https://bookstore-backend-swart.vercel.app/)

---

## 🛠️ Features & Tech Stack
- **Node.js & Express.js** for backend API framework.
- **PostgreSQL** for relational database architecture.
- **JWT (JSON Web Token)** for authorization.
- **bcryptjs** for secure password hashing.
- **Vercel** for continuous cloud deployment.

---

## 🗄️ Database Schema / ERD
Below is the structural relationship of the entities used in the system:

```
[ Users ]
  - id (PK)
  - name
  - email (Unique)
  - password
  - role

[ Categories ]
  - id (PK)
  - name

[ Books ]
  - id (PK)
  - title
  - author
  - price
  - category_id (FK -> Categories.id)
```

---

## 📖 API Endpoints Documentation

### 🔑 Authentication
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user | No |
| `POST` | `/api/auth/login` | User login & token generation | No |

### 📚 Categories
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/categories` | Get all categories | No |
| `POST` | `/api/categories` | Create a new category | Yes (Bearer Token) |

### 📖 Books
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/books` | Get all books | No |
| `GET` | `/api/books/:id` | Get single book details | No |
| `POST` | `/api/books` | Add a new book | Yes (Bearer Token) |
| `PUT` | `/api/books/:id` | Update book details | Yes (Bearer Token) |
| `DELETE` | `/api/books/:id` | Delete a book | Yes (Bearer Token) |

---

## ⚙️ How to Run Locally

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/ronaakter12346i-design/bookstore-backend.git](https://github.com/ronaakter12346i-design/bookstore-backend.git)
   cd bookstore-backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and add:
   ```env
   PORT=5000
   DATABASE_URL=your_postgresql_database_url
   JWT_SECRET=your_jwt_secret
   ```

4. **Start the server:**
   ```bash
   npm run dev
   # or
   node server.js
   ```
```
