# Personal Expense Tracker - Setup & Installation Guide

A complete step-by-step guide to set up and run this MERN stack expense tracking application on your local machine.

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your system:

1. **Node.js** (v14.0 or higher)
   - Download from: https://nodejs.org/
   - Verify installation:
     ```bash
     node --version
     npm --version
     ```

2. **MongoDB Atlas Account** (Free tier works)
   - Sign up at: https://www.mongodb.com/cloud/atlas
   - Create a free cluster
   - Get your connection string

3. **Git**
   - Download from: https://git-scm.com/
   - Verify installation:
     ```bash
     git --version
     ```

4. **Text Editor** (VS Code recommended)
   - Download from: https://code.visualstudio.com/

---

## 📥 Step 1: Clone the Repository

Open your terminal/command prompt and run:

```bash
git clone https://github.com/bmadired/personal-expense-tracker.git
cd personal-expense-tracker
```

You should now see two folders: `backend` and `frontend`

---

## 🔧 Step 2: Backend Setup

### 2.1 Navigate to Backend Directory

```bash
cd backend
```

### 2.2 Install Backend Dependencies

```bash
npm install
```

This will install:
- express (server framework)
- mongoose (MongoDB ODM)
- cors (Cross-Origin Resource Sharing)
- dotenv (environment variables)
- bcryptjs (password hashing)
- jsonwebtoken (JWT authentication)

### 2.3 Create Backend Environment File

Create a file named `.env` in the `backend` folder:

```bash
# Windows
type nul > .env

# Mac/Linux
touch .env
```

### 2.4 Configure Backend Environment Variables

Open the `.env` file and add the following:

```env
MONGO_URI=your_mongodb_connection_string_here
JWT_SECRET=your_secret_key_here
PORT=5000
```

**How to get your MongoDB URI:**
1. Go to MongoDB Atlas (https://cloud.mongodb.com/)
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database user password
6. Replace `<dbname>` with your database name (e.g., "expense_tracker")

**Example:**
```
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/expense_tracker?retryWrites=true&w=majority
```

**Generate a secure JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and use it as your JWT_SECRET.

### 2.5 Start the Backend Server

```bash
npm start
```

**Expected Output:**
```
Server running on port 5000
MongoDB connected successfully
```

**Keep this terminal window open** - the backend server must stay running!

---

## 🎨 Step 3: Frontend Setup

Open a **NEW terminal window** (keep backend running in the first one)

### 3.1 Navigate to Frontend Directory

```bash
cd personal-expense-tracker/frontend
```

### 3.2 Install Frontend Dependencies

```bash
npm install
```

This will install:
- react
- react-dom
- react-router-dom
- axios
- chart.js
- react-chartjs-2

### 3.3 Create Frontend Environment File (Optional)

If you want to customize the backend URL:

```bash
# Windows
type nul > .env

# Mac/Linux
touch .env
```

Add the following to `.env`:

```env
REACT_APP_BACKEND_URL=http://localhost:5000
```

**Note:** This step is optional. The app will default to `http://localhost:5000` if not specified.

### 3.4 Start the Frontend Development Server

```bash
npm start
```

**Expected Output:**
```
Compiled successfully!

You can now view frontend in the browser.

  Local:            http://localhost:3000
```

Your browser should automatically open to `http://localhost:3000`

**If it doesn't open automatically**, navigate to: `http://localhost:3000`

---

## 🚀 Step 4: Using the Application

### 4.1 Sign Up (First Time Users)

1. Click **"Don't have an account? Sign up"**
2. Enter:
   - Name: `Your Name`
   - Email: `your.email@example.com`
   - Password: `yourpassword` (minimum 6 characters)
3. Click **"Sign Up"**
4. You'll be automatically logged in and redirected to the dashboard

### 4.2 Login (Returning Users)

1. Enter your email and password
2. Click **"Login"**
3. You'll be redirected to the dashboard

### 4.3 Add Expenses (Multi-Category Entry)

1. Click **"+ Add Expense"** button
2. Enter a **Title** (e.g., "New York Trip")
   - The title groups related expenses together
3. Add first category entry:
   - **Category**: Select from dropdown or choose "Other" for custom
   - **Amount**: Enter amount (e.g., 500)
   - **Date**: Select date
4. Click **"+ Add Another Category"** to add more entries
5. Add additional categories (e.g., Food: $150, Shopping: $200)
6. Click **"Save All"**

### 4.4 Edit All Categories for a Title

1. Click the **edit (✏️)** button on any expense
2. All categories for that title will appear
3. You can:
   - Update amounts
   - Add new category entries
   - Remove existing entries (click 🗑️)
4. Click **"Update All"** to save changes

### 4.5 View Analytics

- **Bar Chart**: Shows spending by title (when viewing "All Titles")
- **Pie Chart**: Shows category distribution
- **Filter by Title**: Use dropdown to view specific event data
- **Stats Cards**: View total spending, transactions, categories, average

### 4.6 Delete Expenses

1. Click the **delete (🗑️)** button on any expense
2. Confirm deletion
3. The expense will be removed

### 4.7 Update Profile

1. Click **"Profile"** button
2. Update your name, email, or password
3. Click **"Update Profile"**

---

## 📡 API Endpoints

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required | Request Body |
|--------|----------|-------------|---------------|--------------|
| POST | `/api/auth/register` | Register new user | No | `{ name, email, password }` |
| POST | `/api/auth/login` | Login user | No | `{ email, password }` |
| GET | `/api/auth/me` | Get current user | Yes | None |
| PUT | `/api/auth/update-profile` | Update user profile | Yes | `{ name, email, password }` |

### Expense Endpoints

| Method | Endpoint | Description | Auth Required | Request Body |
|--------|----------|-------------|---------------|--------------|
| GET | `/api/expenses` | Get all user expenses | Yes | None |
| POST | `/api/expenses` | Create new expense | Yes | `{ title, amount, category, date }` |
| PUT | `/api/expenses/:id` | Update expense by ID | Yes | `{ title, amount, category, date }` |
| DELETE | `/api/expenses/:id` | Delete expense by ID | Yes | None |

**Authentication Header Format:**
```
Authorization: Bearer <your_jwt_token>
```

---

## 📁 Project Structure

```
personal-expense-tracker/
│
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection logic
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT verification middleware
│   ├── models/
│   │   ├── User.js               # User schema (name, email, password)
│   │   └── Expense.js            # Expense schema (title, amount, category, date)
│   ├── routes/
│   │   ├── authRoutes.js         # Authentication routes
│   │   └── expenseRoutes.js      # Expense CRUD routes
│   ├── .env                      # Environment variables (NOT in git)
│   ├── .env.example              # Environment template
│   ├── server.js                 # Express server entry point
│   └── package.json              # Backend dependencies
│
├── frontend/
│   ├── public/
│   │   └── index.html            # HTML template
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js          # Axios instance with interceptors
│   │   ├── components/
│   │   │   ├── ExpenseModal.js   # Multi-category expense form
│   │   │   └── ProtectedRoute.js # Route protection component
│   │   ├── pages/
│   │   │   ├── Login.js          # Login page
│   │   │   ├── Signup.js         # Signup page
│   │   │   ├── Dashboard.js      # Main dashboard with charts
│   │   │   └── Profile.js        # User profile page
│   │   ├── utils/
│   │   │   └── auth.js           # Token management utilities
│   │   ├── App.js                # Main app component with routes
│   │   ├── App.css               # Global styles
│   │   └── index.js              # React entry point
│   ├── .env                      # Environment variables (optional)
│   ├── .env.example              # Environment template
│   └── package.json              # Frontend dependencies
│
├── .gitignore                    # Git ignore file
├── LICENSE                       # MIT License
└── README.md                     # This file
```

---

## 🔧 Troubleshooting

### Problem: "Cannot connect to MongoDB"

**Solution 1 - Check MongoDB URI:**
- Ensure your MongoDB URI in `.env` is correct
- Make sure you replaced `<password>` and `<dbname>`
- Verify your database user has read/write permissions

**Solution 2 - Check Network Access:**
- In MongoDB Atlas, go to "Network Access"
- Add your IP address or use `0.0.0.0/0` for testing (allow all)

**Solution 3 - Check Database User:**
- In MongoDB Atlas, go to "Database Access"
- Ensure your user exists and has correct permissions

---

### Problem: "Port 5000 already in use"

**Solution:**
- Another application is using port 5000
- Change PORT in `backend/.env` to a different port (e.g., 5001)
- Update `REACT_APP_BACKEND_URL` in `frontend/.env` accordingly

---

### Problem: "JWT malformed" or "No token provided"

**Solution 1 - Clear localStorage:**
- Open browser developer tools (F12)
- Go to "Application" tab → "Local Storage"
- Delete the `token` item
- Logout and login again

**Solution 2 - Check JWT_SECRET:**
- Ensure JWT_SECRET in `.env` is set and not empty

---

### Problem: "CORS error" in browser console

**Solution:**
- Ensure backend is running on port 5000 (or your configured port)
- Check that `cors` is installed in backend (`npm list cors`)
- Verify `REACT_APP_BACKEND_URL` matches your backend port

---

### Problem: Charts not displaying

**Solution:**
- Add at least one expense first
- Ensure chart.js is installed: `npm list chart.js`
- Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
- Check browser console for errors

---

### Problem: "Module not found" errors

**Solution:**
- Delete `node_modules` folder:
  ```bash
  # In backend folder
  rm -rf node_modules
  npm install

  # In frontend folder
  rm -rf node_modules
  npm install
  ```

---

### Problem: Changes not reflecting in browser

**Solution:**
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Restart the development server:
  ```bash
  # Stop with Ctrl+C, then:
  npm start
  ```

---

## 📝 Features Summary

- **✅ User Authentication** - Secure JWT-based login/signup
- **✅ Multi-Category Expense Entry** - Add multiple categories to one title at once
- **✅ Smart Editing** - Edit all categories for a title together
- **✅ Interactive Charts** - Bar and pie charts with Chart.js
- **✅ Title Filtering** - Filter expenses by specific events/titles
- **✅ Custom Categories** - Create your own expense categories
- **✅ Responsive Design** - Works on all screen sizes
- **✅ Real-time Updates** - Charts update instantly after changes

---

## 📄 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2024 Bhavana Madireddy

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 👨‍💻 Author

**Bhavana Madireddy**
- GitHub: [@bmadired](https://github.com/bmadired)

---

## 🎯 Quick Start Summary

```bash
# 1. Clone the repo
git clone https://github.com/bmadired/personal-expense-tracker.git
cd personal-expense-tracker

# 2. Setup backend
cd backend
npm install
# Create .env file and add MONGO_URI, JWT_SECRET, PORT
npm start

# 3. In a new terminal, setup frontend
cd frontend
npm install
npm start

# 4. Open http://localhost:3000 in your browser
```

**That's it! You're ready to track your expenses!** 🎉
