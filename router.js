const express = require('express');

const router = express.Router();
const ProductModel = require("./models/product.model");


//Post Method
router.post('/products/add', async (req, res) => {
    try {
        const { Name, Sku, Description } = req.body;
        if(!Name || !Sku || !Description) {
            return res.status(400).send({ status: false, message: "Validation error" });
        }
        const product = new ProductModel({ Name, Sku, Description });
        await product.save();
        return res.send({ status: true, data: product });
    } catch {
        res.status(500).send({ status: false, message: "something went wrong" });
    }
})

//Get all Method
router.get('/getAll', async(req, res) => {
   
    try {
       const productData = await ProductModel.find();
        return res.send({ status: true, data: productData })
    } catch (error) {
        console.error(error.message)

    }
})

//Get by ID Method
router.get('/getOne/:id', (req, res) => {
    res.send('Get by ID API')
})

//Update by ID Method
router.put('/update/:id', (req, res) => {
    res.send('Update by ID API')
    try {

        
        
    } catch (error) {
        console.error(error.message)
    }
})

//Delete by ID Method
router.delete('/delete/:id', (req, res) => {
    res.send('Delete by ID API')
})





















module.exports = router;