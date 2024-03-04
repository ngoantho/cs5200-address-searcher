// exact matched name

const Customer = require('./models/customerModel'); // adjust the path

async function finderByName(name) {
    try {
        const customers = await Customer.find({name: name });
        return customers;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

module.exports = finderByName;