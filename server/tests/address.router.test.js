const request = require('supertest');
const app = require('../src/app');
const addressService = require('../src/Services/address.service');

jest.mock('../src/Services/address.service');

describe('Address Router (/api/addresses)', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /', () => {
        it('should return 201 on successful address creation', async () => {
            const mockAddress = { id: 'addr-123', user_id: 'user-1', street: '123 Main St' };
            addressService.addAddress.mockResolvedValue(mockAddress);

            const res = await request(app).post('/api/addresses').send({
                user_id: 'user-1',
                street: '123 Main St'
            });

            expect(res.statusCode).toEqual(201);
            expect(res.body).toEqual(mockAddress);
            expect(addressService.addAddress).toHaveBeenCalledWith({
                user_id: 'user-1',
                street: '123 Main St'
            });
        });

        it('should return 400 on error', async () => {
            addressService.addAddress.mockRejectedValue(new Error('Validation Failed'));

            const res = await request(app).post('/api/addresses').send({});

            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('message', 'Validation Failed');
        });
    });

    describe('GET /:id', () => {
        it('should return 200 and the address', async () => {
            const mockAddress = { id: 'addr-123', user_id: 'user-1', street: '123 Main St' };
            addressService.getAddressById.mockResolvedValue(mockAddress);

            const res = await request(app).get('/api/addresses/addr-123');

            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(mockAddress);
            expect(addressService.getAddressById).toHaveBeenCalledWith('addr-123');
        });

        it('should return 404 if address not found', async () => {
            addressService.getAddressById.mockRejectedValue(new Error('Address not found'));

            const res = await request(app).get('/api/addresses/addr-999');

            expect(res.statusCode).toEqual(404);
            expect(res.body).toHaveProperty('message', 'Address not found');
        });
    });

    describe('GET /user/:userId', () => {
        it('should return 200 and a list of addresses for the user', async () => {
            const mockAddresses = [
                { id: 'addr-1', user_id: 'user-1' },
                { id: 'addr-2', user_id: 'user-1' }
            ];
            addressService.getAddressesByUser.mockResolvedValue(mockAddresses);

            const res = await request(app).get('/api/addresses/user/user-1');

            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(mockAddresses);
            expect(addressService.getAddressesByUser).toHaveBeenCalledWith('user-1');
        });

        it('should return 500 on internal error', async () => {
            addressService.getAddressesByUser.mockRejectedValue(new Error('Internal Server Error'));

            const res = await request(app).get('/api/addresses/user/user-1');

            expect(res.statusCode).toEqual(500);
            expect(res.body).toHaveProperty('message', 'Internal Server Error');
        });
    });

    describe('PUT /:id', () => {
        it('should return 200 on successful address update', async () => {
            const mockUpdatedAddress = { id: 'addr-123', street: '456 New St' };
            addressService.updateAddress.mockResolvedValue(mockUpdatedAddress);

            const res = await request(app).put('/api/addresses/addr-123').send({
                street: '456 New St'
            });

            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(mockUpdatedAddress);
            expect(addressService.updateAddress).toHaveBeenCalledWith('addr-123', {
                street: '456 New St'
            });
        });

        it('should return 400 on error', async () => {
            addressService.updateAddress.mockRejectedValue(new Error('Invalid update'));

            const res = await request(app).put('/api/addresses/addr-123').send({});

            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('message', 'Invalid update');
        });
    });

    describe('DELETE /:id', () => {
        it('should return 200 on successful address deletion', async () => {
            addressService.deleteAddress.mockResolvedValue({ id: 'addr-123' });

            const res = await request(app).delete('/api/addresses/addr-123');

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('message', 'Address deleted successfully');
            expect(addressService.deleteAddress).toHaveBeenCalledWith('addr-123');
        });

        it('should return 500 on error during deletion', async () => {
            addressService.deleteAddress.mockRejectedValue(new Error('Could not delete check DB'));

            const res = await request(app).delete('/api/addresses/addr-123');

            expect(res.statusCode).toEqual(500);
            expect(res.body).toHaveProperty('message', 'Could not delete check DB');
        });
    });
});
