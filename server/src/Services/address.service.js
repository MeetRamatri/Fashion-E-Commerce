const Address = require('../models/Address');
const crypto = require('crypto');

const addAddress = async (data) => {
    try {
        if (!data.id) {
            data.id = crypto.randomUUID();
        }
        const address = new Address(data);
        return await address.save();
    } catch (error) {
        throw error;
    }
};

const getAddressById = async (id) => {
    try {
        const address = await Address.findOne({ id });
        if (!address) {
            throw new Error('Address not found');
        }
        return address;
    } catch (error) {
        throw error;
    }
};

const getAddressesByUser = async (userId) => {
    try {
        return await Address.find({ user_id: userId });
    } catch (error) {
        throw error;
    }
};

const updateAddress = async (id, data) => {
    try {
        const address = await Address.findOneAndUpdate(
            { id },
            data,
            { new: true }
        );
        if (!address) {
            throw new Error('Address not found');
        }
        return address;
    } catch (error) {
        throw error;
    }
};

const deleteAddress = async (id) => {
    try {
        const address = await Address.findOneAndDelete({ id });
        if (!address) {
            throw new Error('Address not found');
        }
        return address;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    addAddress,
    getAddressById,
    getAddressesByUser,
    updateAddress,
    deleteAddress
};
