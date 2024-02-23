const express = require('express');
const app = express();
const Address = require('./models/addressModel') // address model
const mongoose =  require('mongoose');
const { error } = require('console');

// express access to json type
app.use(express.json());

// routes
// get request
// front page
app.get('/', (req, res) => {
    res.send('Hello cs5200Team5 API');
});

// testing pages
app.get('/blog', (req, res) => {
    res.send('Hello Classes, We are Team5');
});

// return all list of addresses
app.get('/addresses', async(req, res) => {
    try {
        // all addresses in the list
        const addresses = await Address.find({});
        res.status(200).json(addresses);
    } catch {
        res.status(500).json({message: error.message})
    }
});

// based on id find the address
// we can update this to find target
app.get('/addresses/:id', async(req, res) => {
    try {
        // find by id
        const {id} = req.params;
        const address = await Address.findById(id);
        res.status(200).json(address);
    } catch {
        res.status(500).json({message: error.message})
    }
});

// create a new address and save to database. 
app.post('/address', async(req, res) => {
    try{
        const address = await Address.create(req.body);
        res.status(200).json(address);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: error.message})
    }
});

// update a address
app.put('/addresses/:id', async(req, res) => {
    try{
        const {id} = req.params;
        const address =await Address.findByIdAndUpdate(id, req.body);
        // not find any addresses in the database
        if(!address){
            return res.status(404).json({message: 'cannot find any address with id ${id}'});
        }
        const updatedAddress = await Address.findById(id);
        res.status(200).json(updatedAddress);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: error.message})
    }
});

// delete method
app.delete('/addresses/:id', async(req, res)=> {
    try {
        const {id} = req.params;
        const address = await Address.findByIdAndDelete(id);
        if(!product) {
            return res.status(404).json({message: 'cannot find any product with ID ${id}'})
        }
        res.status(200).json(address);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: error.message})
    }
});

// connecting module to mongoDB
mongoose.connect('mongodb+srv://admin:cs5200Team5@cs5200team5api.dnzdxjz.mongodb.net/cs5200Team5?retryWrites=true&w=majority&appName=cs5200Team5API')
.then(()=> {

    console.log('connected to MongoDB');

    app.listen(3000, ()=> {
        console.log('Node API app is running on port 3000');
    });

}).catch((error)=> {
    console.log(error);
})

