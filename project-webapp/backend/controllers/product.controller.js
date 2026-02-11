import Product from "../models/productModel.js"

export const createProduct = async (req, res) => {
    try {
        const { name, category } = req.body;

        const product = await Product.create({
            name,
            category,
            userRef: req.user._id
        });

        res.status(201).json({
            success: true,
            product
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({
            userRef: req.user._id
        });

        res.status(200).json({
            success: true,
            count: products.length,
            products
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findOneAndUpdate(
            {
                _id: req.params.id,
                userRef: req.user._id   // tenent isolation; no data leaks possible
            },
            req.body,
            { new: true }
        );

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            product
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findOneAndDelete({
            _id: req.params.id,
            userRef: req.user._id   // tenent isolation; isolation on the DB layer
        });

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Product deleted"
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};