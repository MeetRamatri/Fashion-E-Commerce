const request = require('supertest');
const app = require('../src/app');
const authService = require('../src/Services/auth.service');

jest.mock('../src/Services/auth.service');

describe('Auth Router (/api/auth)', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /register', () => {
        it('should return 400 if required fields are missing', async () => {
            const res = await request(app).post('/api/auth/register').send({
                name: 'Test',
                email: 'test@example.com'
            });
            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('message', 'Name, email, and password are required');
        });

        it('should return 201 when registration is successful', async () => {
            authService.registerUser.mockResolvedValue({ message: 'User registered successfully', userId: '123' });

            const res = await request(app).post('/api/auth/register').send({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123'
            });

            expect(res.statusCode).toEqual(201);
            expect(res.body).toEqual({ message: 'User registered successfully', userId: '123' });
            expect(authService.registerUser).toHaveBeenCalledWith({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123',
                phone: undefined,
                role: undefined
            });
        });

        it('should return 409 if user already exists', async () => {
            authService.registerUser.mockRejectedValue(new Error('User already exists'));

            const res = await request(app).post('/api/auth/register').send({
                name: 'Test',
                email: 'test@example.com',
                password: 'password123'
            });

            expect(res.statusCode).toEqual(409);
            expect(res.body).toHaveProperty('message', 'User already exists');
        });

        it('should return 500 on internal server error', async () => {
            authService.registerUser.mockRejectedValue(new Error('Database failed'));

            const res = await request(app).post('/api/auth/register').send({
                name: 'Test',
                email: 'test@example.com',
                password: 'password123'
            });

            expect(res.statusCode).toEqual(500);
            expect(res.body).toHaveProperty('message', 'Internal server error');
        });
    });

    describe('POST /login', () => {
        it('should return 400 if required fields are missing', async () => {
            const res = await request(app).post('/api/auth/login').send({
                email: 'test@example.com'
                // missing password
            });
            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('message', 'Email and password are required');
        });

        it('should return 200 on successful login', async () => {
            const mockTokenResponse = {
                token: 'fake-token',
                user: { id: '123', name: 'Test', email: 'test@example.com' }
            };
            authService.loginUser.mockResolvedValue(mockTokenResponse);

            const res = await request(app).post('/api/auth/login').send({
                email: 'test@example.com',
                password: 'password123'
            });

            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(mockTokenResponse);
            expect(authService.loginUser).toHaveBeenCalledWith('test@example.com', 'password123');
        });

        it('should return 401 on invalid credentials', async () => {
            authService.loginUser.mockRejectedValue(new Error('Invalid email or password'));

            const res = await request(app).post('/api/auth/login').send({
                email: 'test@example.com',
                password: 'wrongpassword'
            });

            expect(res.statusCode).toEqual(401);
            expect(res.body).toHaveProperty('message', 'Invalid email or password');
        });

        it('should return 500 on internal server error', async () => {
            authService.loginUser.mockRejectedValue(new Error('Some DB error'));

            const res = await request(app).post('/api/auth/login').send({
                email: 'test@example.com',
                password: 'password123'
            });

            expect(res.statusCode).toEqual(500);
            expect(res.body).toHaveProperty('message', 'Internal server error');
            expect(res.body).toHaveProperty('error', 'Some DB error');
        });
    });
});
