const express = require('express');
const cors = require('cors');
const productRouter = require('./Routers/product.router');
const cartRouter = require('./Routers/cart.router');
const orderRouter = require('./Routers/order.router');
const productVariantRouter = require('./Routers/productVariant.router');
const addressRouter = require('./Routers/address.router');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/products', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/orders', orderRouter);
app.use('/api/product-variants', productVariantRouter);
app.use('/api/addresses', addressRouter);

// Health Check Route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'ShopSmart Backend is running',
    timestamp: new Date().toISOString()
  });
});

// Root Route (optional, just to show something)
app.get('/', (req, res) => {
  res.send('ShopSmart Backend Service');
});

module.exports = app;
