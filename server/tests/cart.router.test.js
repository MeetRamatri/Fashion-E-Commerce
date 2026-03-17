const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app'); // Your Express app

describe('Cart API Endpoints', () => {
    const mockAuthToken = 'Bearer your_test_jwt_token_here';
  let testProductId = new mongoose.Types.ObjectId().toString();
  describe('GET /api/cart', () => {
    it('should fetch the current users cart', async () => {
      const res = await request(app)
        .get('/api/cart')
        .set('Authorization', mockAuthToken);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('items');
    });
  });

  describe('POST /api/cart', () => {
    it('should add a new product to the cart', async () => {
      const res = await request(app)
        .post('/api/cart')
        .set('Authorization', mockAuthToken)
        .send({
          productId: testProductId,
          quantity: 1
        });
      expect([200, 201]).toContain(res.statusCode);
      expect(res.body.message).toBeDefined(); 
    });
  });

  describe('PUT /api/cart/:itemId', () => {
    it('should update the quantity of an item in the cart', async () => {
      const res = await request(app)
        .put(`/api/cart/${testProductId}`)
        .set('Authorization', mockAuthToken)
        .send({
          quantity: 3
        });

      expect(res.statusCode).toEqual(200);
    });
  });

  describe('DELETE /api/cart/:itemId', () => {
    it('should remove an item from the cart', async () => {
      const res = await request(app)
        .delete(`/api/cart/${testProductId}`)
        .set('Authorization', mockAuthToken);

      expect(res.statusCode).toEqual(200);
    });
  });
});