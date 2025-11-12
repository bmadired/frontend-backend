# 📦 Product Management System

A full-stack MERN (MongoDB, Express, React, Node.js) application for managing products with complete CRUD (Create, Read, Update, Delete) functionality.

## 🚀 Features

- **Create Products**: Add new products with name, price, and quantity
- **Read Products**: View all products in a responsive grid layout
- **Update Products**: Edit existing product details
- **Delete Products**: Remove products with confirmation dialog
- **Real-time Updates**: Instant UI updates after CRUD operations
- **Error Handling**: User-friendly error messages and loading states
- **Form Validation**: Input validation for all fields
- **CORS Enabled**: Seamless communication between frontend and backend

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool & dev server
- **Axios** - HTTP client for API calls
- **CSS** - Inline styling for UI components

### Backend
- **Node.js** - JavaScript runtime
- **Express 5** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM (Object Data Modeling)
- **CORS** - Cross-Origin Resource Sharing
- **Dotenv** - Environment variables

## 📁 Project Structure

```
project_folder/
├── client/                          # React Frontend
│   ├── src/
│   │   ├── App.jsx                 # Main app component
│   │   ├── main.jsx                # Entry point
│   │   ├── index.css               # Global styles
│   │   ├── App.css                 # App styles
│   │   ├── api/
│   │   │   └── products.js         # API calls to backend
│   │   ├── components/
│   │   │   ├── ProductCard.jsx     # Individual product card
│   │   │   ├── ProductForm.jsx     # Create/Edit form
│   │   │   └── ProductList.jsx     # Products grid display
│   │   ├── pages/
│   │   │   ├── Home.jsx            # Main page with all logic
│   │   │   └── EditProduct.jsx     # Edit page (optional)
│   │   └── assets/                 # Images and assets
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── eslint.config.js
│
└── server/                          # Express Backend
    ├── index.js                    # Main server file
    ├── package.json
    ├── .env                        # Environment variables
    ├── config/
    │   └── db.js                   # MongoDB connection
    ├── models/
    │   └── product.model.js        # Product schema
    ├── controllers/
    │   └── product.controller.js   # Business logic
    └── routes/
        └── product.routes.js       # API endpoints
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone/Download Project
```bash
cd project_folder
```

### 2. Setup Backend

```bash
cd server

# Install dependencies
npm install

# Create .env file with MongoDB connection
echo MONGODB_URI=mongodb://localhost:27017/products > .env
echo PORT=25252 >> .env

# Start server
npm run dev
```

The server will run on: **http://localhost:25252**

### 3. Setup Frontend

```bash
cd ../client

# Install dependencies
npm install

# Start development server
npm run dev
```

The client will run on: **http://localhost:5175** (or next available port)

## 📡 API Endpoints

All endpoints are prefixed with `/api/products`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products |
| GET | `/api/products/:id` | Get product by ID |
| POST | `/api/products` | Create new product |
| PUT | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |

### Example Request/Response

**POST** `/api/products`
```json
Request:
{
  "name": "Laptop",
  "price": 999.99,
  "quantity": 5
}

Response:
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Laptop",
  "price": 999.99,
  "quantity": 5,
  "__v": 0
}
```

## 🎯 How to Use the Application

1. **Open the Application**
   - Navigate to `http://localhost:5175` in your browser

2. **Add a Product**
   - Enter product name, price, and quantity in the form
   - Click "➕ Add Product" button
   - Product appears in the list below

3. **Edit a Product**
   - Click "✏️ Edit" button on any product card
   - Form will populate with current values
   - Update the values as needed
   - Click "✏️ Update Product" button
   - Click "❌ Cancel Edit" to discard changes

4. **Delete a Product**
   - Click "🗑️ Delete" button on any product card
   - Confirm deletion in the dialog
   - Product is removed from the list

## 🔑 Environment Variables

### Server (.env)
```
MONGODB_URI=mongodb://localhost:27017/products
PORT=25252
NODE_ENV=development
```

### MongoDB Connection
**Local**: `mongodb://localhost:27017/products`
**Atlas**: `mongodb+srv://username:password@cluster.mongodb.net/products`

## 📝 Product Schema

```javascript
{
  _id: ObjectId,
  name: String (required),
  price: Number (required),
  quantity: Number (required),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

## 🚀 Running the Project

### Development Mode (Both Servers)

**Terminal 1 - Start Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Start Frontend:**
```bash
cd client
npm run dev
```

### Production Build

**Frontend:**
```bash
cd client
npm run build
npm run preview
```

**Backend:**
```bash
cd server
node index.js
```

## 🐛 Troubleshooting

### Port Already in Use
- **Issue**: "Port 5173/25252 is already in use"
- **Solution**: Kill the process or use a different port:
  ```bash
  # For Windows
  netstat -ano | findstr :5173
  taskkill /PID <PID> /F
  ```

### MongoDB Connection Failed
- **Issue**: "MongoServerError: connect ECONNREFUSED"
- **Solution**: 
  - Ensure MongoDB is running locally
  - Or update `.env` with MongoDB Atlas connection string

### CORS Error in Console
- **Issue**: "Access to XMLHttpRequest blocked by CORS policy"
- **Solution**: Verify CORS is enabled in `server/index.js`

### API Not Responding
- **Issue**: "Failed to fetch products"
- **Solution**: 
  - Check if server is running on port 25252
  - Verify MongoDB connection
  - Check browser console for error details

## 📚 Component Details

### App.jsx
Main entry point that renders the Home page.

### Home.jsx
Contains all product management logic:
- Fetches products from API
- Handles create, update, delete operations
- Manages edit mode state
- Error handling and loading states

### ProductForm.jsx
Reusable form component for creating and editing products:
- Form validation
- Supports both create and edit modes
- Displays appropriate button text based on mode

### ProductCard.jsx
Individual product display card:
- Shows product details (name, price, quantity)
- Edit and Delete buttons
- Responsive design

### ProductList.jsx
Grid container for displaying all products:
- Maps through products array
- Renders ProductCard components
- Shows message when no products exist

### products.js (API)
Axios instance and API functions:
- `getProducts()` - Fetch all products
- `createProduct(data)` - Create new product
- `updateProduct(id, data)` - Update product
- `deleteProduct(id)` - Delete product

## 🔐 Security Considerations

- Add authentication & authorization
- Validate all inputs on backend
- Use HTTPS in production
- Implement rate limiting
- Add request validation middleware

## 📈 Future Enhancements

- User authentication & authorization
- Product categories & filtering
- Search functionality
- Pagination
- Product images
- Stock alerts
- Inventory reports
- Admin dashboard
- Mobile app (React Native)

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review the console for error messages
3. Verify all services are running (MongoDB, servers)

## 📄 License

This project is open source and available for learning purposes.

## 👤 Author

Created as a full-stack MERN project for product management demonstration.

---

**Happy Coding! 🎉**
