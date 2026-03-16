const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));

const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler');

app.use('/public/uploads', express.static(__dirname + '/public/uploads'));
// app.use(authJwt()); 
app.use(errorHandler);

// Environment Variables
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/shop_app';

// MongoDB Connection
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB Connection is ready...');
  })
  .catch((err) => {
    console.log(err);
  });

// Routes
const usersRoutes = require('./routes/users');
const categoriesRoutes = require('./routes/categories');
const productsRoutes = require('./routes/products');
const ordersRoutes = require('./routes/orders');
const api = process.env.API_URL || '/api/v1';

app.use(`${api}/users`, usersRoutes);
app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/products`, productsRoutes);
app.use(`${api}/orders`, ordersRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running http://localhost:${PORT}`);
});
