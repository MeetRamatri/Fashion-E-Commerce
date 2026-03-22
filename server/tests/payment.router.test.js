const request = require('supertest');
const app = require('../src/app');
const paymentService = require('../src/Services/payment.service');

jest.mock('../src/Services/payment.service');

describe('Payment Router (/api/payments)', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /', () => {
        it('should return 201 on successful payment creation', async () => {
            const mockPayment = { id: 'pay-123', order_id: 'order-1', amount: 100 };
            paymentService.createPayment.mockResolvedValue(mockPayment);

            const res = await request(app).post('/api/payments').send({
                order_id: 'order-1',
                amount: 100
            });

            expect(res.statusCode).toEqual(201);
            expect(res.body).toEqual(mockPayment);
            expect(paymentService.createPayment).toHaveBeenCalledWith({
                order_id: 'order-1',
                amount: 100
            });
        });

        it('should return 400 on error', async () => {
            paymentService.createPayment.mockRejectedValue(new Error('Validation Failed'));

            const res = await request(app).post('/api/payments').send({});

            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('message', 'Validation Failed');
        });
    });

    describe('GET /:id', () => {
        it('should return 200 and the payment', async () => {
            const mockPayment = { id: 'pay-123', order_id: 'order-1', amount: 100 };
            paymentService.getPaymentById.mockResolvedValue(mockPayment);

            const res = await request(app).get('/api/payments/pay-123');

            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(mockPayment);
            expect(paymentService.getPaymentById).toHaveBeenCalledWith('pay-123');
        });

        it('should return 404 if payment not found', async () => {
            paymentService.getPaymentById.mockRejectedValue(new Error('Payment not found'));

            const res = await request(app).get('/api/payments/pay-999');

            expect(res.statusCode).toEqual(404);
            expect(res.body).toHaveProperty('message', 'Payment not found');
        });
    });

    describe('GET /order/:orderId', () => {
        it('should return 200 and the payment for the order', async () => {
            const mockPayment = { id: 'pay-123', order_id: 'order-1', amount: 100 };
            paymentService.getPaymentByOrderId.mockResolvedValue(mockPayment);

            const res = await request(app).get('/api/payments/order/order-1');

            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(mockPayment);
            expect(paymentService.getPaymentByOrderId).toHaveBeenCalledWith('order-1');
        });

        it('should return 404 if no payment found for the order', async () => {
            paymentService.getPaymentByOrderId.mockResolvedValue(null);

            const res = await request(app).get('/api/payments/order/order-999');

            expect(res.statusCode).toEqual(404);
            expect(res.body).toHaveProperty('message', 'Payment not found for this order');
        });

        it('should return 500 on internal error', async () => {
            paymentService.getPaymentByOrderId.mockRejectedValue(new Error('Internal Server Error'));

            const res = await request(app).get('/api/payments/order/order-1');

            expect(res.statusCode).toEqual(500);
            expect(res.body).toHaveProperty('message', 'Internal Server Error');
        });
    });

    describe('PUT /:id/status', () => {
        it('should return 200 on successful status update', async () => {
            const mockUpdatedPayment = { id: 'pay-123', status: 'COMPLETED' };
            paymentService.updatePaymentStatus.mockResolvedValue(mockUpdatedPayment);

            const res = await request(app).put('/api/payments/pay-123/status').send({
                status: 'COMPLETED'
            });

            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(mockUpdatedPayment);
            expect(paymentService.updatePaymentStatus).toHaveBeenCalledWith('pay-123', 'COMPLETED');
        });

        it('should return 400 on error', async () => {
            paymentService.updatePaymentStatus.mockRejectedValue(new Error('Invalid update'));

            const res = await request(app).put('/api/payments/pay-123/status').send({
                status: 'UNKNOWN_STATUS'
            });

            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('message', 'Invalid update');
        });
    });
});
