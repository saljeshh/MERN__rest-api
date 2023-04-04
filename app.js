const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = 4500

// connect
mongoose.connect("mongodb://127.0.0.1:27017/Restexample").then(() => {
    console.log("Connected to mongodb")
}).catch((err) => {
    console.log(err)
})

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

// schema
const productSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number
})

// this is model or collection
const Product = new mongoose.model("Product", productSchema);


//create product
app.post("/api/v1/product/new", async (req, res) => {
    const product = await Product.create(req.body);
    res.status(201).json({
        success: true,
        product
    })
})

// read product
app.get("/api/v1/products", async (req, res) => {
    const products = await Product.find();
    res.status(200).json({
        success: true,
        products
    })
})

//update product
app.put("/api/v1/product/:id", async (req, res) => {
    let product = await Product.findById(req.params.id);

    if(!product){
        return res.status(500).json({
            success: false,
            message: "Product not found"
        })
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, useFindAndModify: false, runValidators: true })

    res.status(200).json({
        success: true,
        product
    })
})

//delete product
app.delete("/api/v1/product/:id", async(req,res)=>{

    const product = await Product.findById(req.params.id);

    if(!product){
        return res.status(500).json({
            success: false,
            message: "Product not found"
        })
    }

    await product.deleteOne();

    res.status(200).json({
        success: true,
        message: "Product deleted successfully"
    })
})

app.listen(PORT, () => {
    console.log("Server listening on port " + PORT);
})
