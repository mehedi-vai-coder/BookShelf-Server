# 🧾 Virtual Bookshelf - Server Side (Express + MongoDB + JWT)

This is the backend of the **Virtual Bookshelf** app. It handles book data management, user-specific books, secure routes using JWT, and MongoDB operations through RESTful APIs.

---

## 🌐 Live Project

- 🔗 Client Side: [https://bookshelf-3935e.web.app](https://bookshelf-3935e.web.app)  
- 💻 Frontend Repo: [https://github.com/mehedi-vai-coder/BookShelf-Client]  
- 🛠️ Backend Repo: [https://github.com/mehedi-vai-coder/BookShelf-Server]

---

## 🔥 Key Features

- 📚 Manage books (CRUD) via RESTful API
- 🛡️ JWT-based authentication and authorization
- 👤 User-specific book operations
- 🗃️ MongoDB database with collections for `books`, `users`, etc.
- ⚙️ CORS enabled for frontend communication

---

## 🛠️ Tech Stack

| Backend    | Auth        | Database | Utilities     |
|------------|-------------|----------|---------------|
| Node.js    | JSON Web Token (JWT) | MongoDB  | Express.js, CORS, dotenv |

---

## 🚀 API Endpoints

| Method | Endpoint           | Description                      | Auth Required |
|--------|--------------------|----------------------------------|----------------|
| GET    | `/books`           | Get all books                    | ❌             |
| GET    | `/books/:id`       | Get single book by ID            | ❌             |
| POST   | `/books`           | Add a new book                   | ✅ (JWT)       |
| PUT    | `/books/:id`       | Update a book by ID              | ✅ (JWT)       |
| DELETE | `/books/:id`       | Delete a book by ID              | ✅ (JWT)       |

🔐 **JWT Token** must be sent via `Authorization` header:  
`Authorization: Bearer your_jwt_token_here`

---

## 🧪 Setup Locally

### Step 1: Clone the Repository

```bash
git clone https://github.com/mehedi-vai-coder/virtual-bookshelf-server.git
cd virtual-bookshelf-server
