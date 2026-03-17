const request = require('supertest');
const app = require('../src/app');
const productService = require('../src/Services/product.service');

jest.mock('../src/Services/product.service');

describe('Product Router (/api/products)', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /', () => {
        it('should return 201 on successful product creation', async () => {
            const mockProduct = { _id: '1', title: 'Test Product', price: 100 };
            productService.createProduct.mockResolvedValue(mockProduct);

            const res = await request(app).post('/api/products').send({
                title: 'Test Product',
                price: 100
            });

            expect(res.statusCode).toEqual(201);
            expect(res.body).toEqual(mockProduct);
            expect(productService.createProduct).toHaveBeenCalledWith({
                title: 'Test Product',
                price: 100
            });
        });

        it('should return 400 on error', async () => {
            productService.createProduct.mockRejectedValue(new Error('Validation Failed'));

            const res = await request(app).post('/api/products').send({});

            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('message', 'Validation Failed');
        });
    });

    describe('GET /', () => {
        it('should return 200 and a list of products', async () => {
            const mockProducts = {
                content: [{ _id: '1', title: 'Test Product' }],
                currentPage: 1,
                totalPages: 1
            };
            productService.getAllProducts.mockResolvedValue(mockProducts);

            const res = await request(app).get('/api/products').query({ category: 'shoes' });

            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(mockProducts);
            expect(productService.getAllProducts).toHaveBeenCalledWith({ category: 'shoes' });
        });

        it('should return 500 on internal error', async () => {
            productService.getAllProducts.mockRejectedValue(new Error('Internal Server Error'));

            const res = await request(app).get('/api/products');

            expect(res.statusCode).toEqual(500);
            expect(res.body).toHaveProperty('message', 'Internal Server Error');
        });
    });

    describe('GET /:id', () => {
        it('should return 200 and the product', async () => {
            const mockProduct = { _id: '1', title: 'Test Product' };
            productService.getProductById.mockResolvedValue(mockProduct);

            const res = await request(app).get('/api/products/1');

            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(mockProduct);
            expect(productService.getProductById).toHaveBeenCalledWith('1');
        });

        it('should return 404 if product not found', async () => {
            productService.getProductById.mockRejectedValue(new Error('Product not found'));

            const res = await request(app).get('/api/products/99');

            expect(res.statusCode).toEqual(404);
            expect(res.body).toHaveProperty('message', 'Product not found');
        });
    });

    describe('PUT /:id', () => {
        it('should return 200 on successful update', async () => {
            const mockUpdatedProduct = { _id: '1', title: 'Updated Product', price: 150 };
            productService.updateProduct.mockResolvedValue(mockUpdatedProduct);

            const res = await request(app).put('/api/products/1').send({ price: 150 });

            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(mockUpdatedProduct);
            expect(productService.updateProduct).toHaveBeenCalledWith('1', { price: 150 });
        });

        it('should return 400 on error', async () => {
            productService.updateProduct.mockRejectedValue(new Error('Invalid update'));

            const res = await request(app).put('/api/products/1').send({ price: -10 });

            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('message', 'Invalid update');
        });
    });

    describe('DELETE /:id', () => {
        it('should return 200 on successful deletion', async () => {
            productService.deleteProduct.mockResolvedValue('Product deleted successfully');

            const res = await request(app).delete('/api/products/1');

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('message', 'Product deleted successfully');
            expect(productService.deleteProduct).toHaveBeenCalledWith('1');
        });

        it('should return 500 on error', async () => {
            productService.deleteProduct.mockRejectedValue(new Error('Could not delete'));

            const res = await request(app).delete('/api/products/1');

            expect(res.statusCode).toEqual(500);
            expect(res.body).toHaveProperty('message', 'Could not delete');
        });
    });
});
