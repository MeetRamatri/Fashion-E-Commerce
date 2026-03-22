const request = require('supertest');
const app = require('../src/app');
const orderService = require('../src/Services/order.service');

jest.mock('../src/Services/order.service');

describe('Order Router (/api/orders)', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /', () => {
        it('should return 201 on successful order creation', async () => {
            const mockOrder = { id: 'order-123', user_id: 'user-1', total_amount: 100 };
            orderService.createOrder.mockResolvedValue(mockOrder);

            const res = await request(app).post('/api/orders').send({
                user_id: 'user-1',
                total_amount: 100
            });

            expect(res.statusCode).toEqual(201);
            expect(res.body).toEqual(mockOrder);
            expect(orderService.createOrder).toHaveBeenCalledWith({
                user_id: 'user-1',
                total_amount: 100
            });
        });

        it('should return 400 on error', async () => {
            orderService.createOrder.mockRejectedValue(new Error('Validation Failed'));

            const res = await request(app).post('/api/orders').send({});

            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('message', 'Validation Failed');
        });
    });

    describe('GET /:id', () => {
        it('should return 200 and the order', async () => {
            const mockOrder = { id: 'order-123', user_id: 'user-1', total_amount: 100 };
            orderService.getOrderById.mockResolvedValue(mockOrder);

            const res = await request(app).get('/api/orders/order-123');

            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(mockOrder);
            expect(orderService.getOrderById).toHaveBeenCalledWith('order-123');
        });

        it('should return 404 if order not found', async () => {
            orderService.getOrderById.mockRejectedValue(new Error('Order not found'));

            const res = await request(app).get('/api/orders/order-999');

            expect(res.statusCode).toEqual(404);
            expect(res.body).toHaveProperty('message', 'Order not found');
        });
    });

    describe('GET /user/:userId', () => {
        it('should return 200 and a list of orders for the user', async () => {
            const mockOrders = [
                { id: 'order-1', user_id: 'user-1' },
                { id: 'order-2', user_id: 'user-1' }
            ];
            orderService.getOrdersByUser.mockResolvedValue(mockOrders);

            const res = await request(app).get('/api/orders/user/user-1');

            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(mockOrders);
            expect(orderService.getOrdersByUser).toHaveBeenCalledWith('user-1');
        });

        it('should return 500 on internal error', async () => {
            orderService.getOrdersByUser.mockRejectedValue(new Error('Internal Server Error'));

            const res = await request(app).get('/api/orders/user/user-1');

            expect(res.statusCode).toEqual(500);
            expect(res.body).toHaveProperty('message', 'Internal Server Error');
        });
    });

    describe('PUT /:id/status', () => {
        it('should return 200 on successful status update', async () => {
            const mockUpdatedOrder = { id: 'order-123', status: 'SHIPPED' };
            orderService.updateOrderStatus.mockResolvedValue(mockUpdatedOrder);

            const res = await request(app).put('/api/orders/order-123/status').send({
                status: 'SHIPPED'
            });

            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(mockUpdatedOrder);
            expect(orderService.updateOrderStatus).toHaveBeenCalledWith('order-123', 'SHIPPED');
        });

        it('should return 400 on error', async () => {
            orderService.updateOrderStatus.mockRejectedValue(new Error('Invalid update'));

            const res = await request(app).put('/api/orders/order-123/status').send({
                status: 'UNKNOWN_STATUS'
            });

            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('message', 'Invalid update');
        });
    });
});
