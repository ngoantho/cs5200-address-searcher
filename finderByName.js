const Customer = require('./models/customerModel'); // adjust the path

async function finderByName(name) {
    try {
        const address = await Customer.findOne({name: name });
        return address;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

module.exports = finderByName;