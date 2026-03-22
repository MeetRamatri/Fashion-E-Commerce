const request = require('supertest');
const app = require('../src/app');
const cartService = require('../src/Services/cart.service');

jest.mock('../src/Services/cart.service');

describe('Cart Router (/api/cart)', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /:userId', () => {
        it('should return 200 and the cart for the user', async () => {
            const mockCart = { user_id: 'user-1', items: [] };
            cartService.getCart.mockResolvedValue(mockCart);

            const res = await request(app).get('/api/cart/user-1');

            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(mockCart);
            expect(cartService.getCart).toHaveBeenCalledWith('user-1');
        });

        it('should return 500 on internal error', async () => {
            cartService.getCart.mockRejectedValue(new Error('Internal Server Error'));

            const res = await request(app).get('/api/cart/user-1');

            expect(res.statusCode).toEqual(500);
            expect(res.body).toHaveProperty('message', 'Internal Server Error');
        });
    });

    describe('POST /:userId/add', () => {
        it('should return 200 and add item to cart', async () => {
            const mockCart = { user_id: 'user-1', items: [{ product_id: 'prod-1', quantity: 1 }] };
            cartService.addToCart.mockResolvedValue(mockCart);

            const res = await request(app)
                .post('/api/cart/user-1/add')
                .send({ product_id: 'prod-1', quantity: 1 });

            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(mockCart);
            expect(cartService.addToCart).toHaveBeenCalledWith('user-1', { product_id: 'prod-1', quantity: 1 });
        });

        it('should return 400 on error', async () => {
            cartService.addToCart.mockRejectedValue(new Error('Invalid item'));

            const res = await request(app)
                .post('/api/cart/user-1/add')
                .send({});

            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('message', 'Invalid item');
        });
    });

    describe('PUT /:userId/update', () => {
        it('should return 200 and update item quantity', async () => {
            const mockCart = { user_id: 'user-1', items: [{ product_id: 'prod-1', quantity: 3 }] };
            cartService.updateItemQuantity.mockResolvedValue(mockCart);

            const res = await request(app)
                .put('/api/cart/user-1/update')
                .send({ product_id: 'prod-1', quantity: 3 });

            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(mockCart);
            expect(cartService.updateItemQuantity).toHaveBeenCalledWith('user-1', 'prod-1', 3);
        });

        it('should return 400 on error', async () => {
            cartService.updateItemQuantity.mockRejectedValue(new Error('Invalid update'));

            const res = await request(app)
                .put('/api/cart/user-1/update')
                .send({ product_id: 'prod-1', quantity: -1 });

            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('message', 'Invalid update');
        });
    });

    describe('DELETE /:userId/remove/:productId', () => {
        it('should return 200 and remove item from cart', async () => {
            const mockCart = { user_id: 'user-1', items: [] };
            cartService.removeItem.mockResolvedValue(mockCart);

            const res = await request(app).delete('/api/cart/user-1/remove/prod-1');

            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(mockCart);
            expect(cartService.removeItem).toHaveBeenCalledWith('user-1', 'prod-1');
        });

        it('should return 400 on error', async () => {
            cartService.removeItem.mockRejectedValue(new Error('Remove failed'));

            const res = await request(app).delete('/api/cart/user-1/remove/prod-1');

            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('message', 'Remove failed');
        });
    });

    describe('DELETE /:userId/clear', () => {
        it('should return 200 and clear the cart', async () => {
            const mockCart = { user_id: 'user-1', items: [] };
            cartService.clearCart.mockResolvedValue(mockCart);

            const res = await request(app).delete('/api/cart/user-1/clear');

            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(mockCart);
            expect(cartService.clearCart).toHaveBeenCalledWith('user-1');
        });

        it('should return 500 on error', async () => {
            cartService.clearCart.mockRejectedValue(new Error('Clear failed'));

            const res = await request(app).delete('/api/cart/user-1/clear');

            expect(res.statusCode).toEqual(500);
            expect(res.body).toHaveProperty('message', 'Clear failed');
        });
    });
});