// not exact matched
// partly matched
// return name and full address
const Customer = require('./models/customerModel'); // adjust the path

async function finderByCity(city) {
    try {
        // using a regular expression to match any city containing the 'city'
        const regex = new RegExp(city, 'i') 
        const customers = await Customer.find({"Customer.city": regex})
        .select('name address');
        return customers.map(customer => ({
            name: customer.name,
            fullAddress: `${customer.street}, ${customer.city},
            ${customer.zip}`
        }));
    } catch (error) {
        console.error(error);
        throw error;
    }
}

module.exports = finderByCity;