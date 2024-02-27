const mongoose = require('mongoose');

const addressSchema = mongoose.Schema(
    {
        lastName: {
            type: String, 
            required: [true, "Please enter a last name"],
        },

        firstName: {
            type: String, 
            required: [true, "Please enter a first name"],
        },

        street: {
            type: String,
            required: [true, "Please enter a street"],
            default: " ",
        },
        
        city: {
            type: String,
            required: [true, "Please enter a City"],
            default: " ",
        },
        
        county: {
            type: String,
            required: [true, "Please enter a county"],
            default: " ",
        },
        
        state: {
            type: String,
            required: [true, "Please enter a state"],
            default: " ",
        },
        
        zip: {
            type: Number,
            required: true, 
        },
        
        country: {
            type: String,
            required: [true, "Please enter a country"],
        },
        
        countryCode: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: true
    }
);

const address = mongoose.model('address', addressSchema);

module.exports = address;

