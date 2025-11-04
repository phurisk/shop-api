const db = require("../config/database");

// GET /api/products
exports.getAllProducts = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM products");
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: error.message });
    }
};

// GET /api/products/:id
exports.getProductById = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM products WHERE id = ?", [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: error.message });
    }
};

// GET /api/shops/:id/products
exports.getProductsByShop = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM products WHERE shop_id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: "Products not found" });
        }
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: error.message });
    }
};

// GET /api/products
exports.createProduct = async (req, res) => {
    try {
        const { name, price, stock, shop_id } = req.body;
        
        if (!shop_id) {
            return res.status(400).json({ error: "Shop ID is required" });
        }

        const [shopExists] = await db.query('SELECT id FROM shops WHERE id = ?', [shop_id]);
        if (shopExists.length === 0) {
            return res.status(400).json({error: "Shop does not exist"});
        }

        if (price <= 0) {
            return res.status(400).json({ error: "Price must be greater than 0" });
        }

        if (stock < 0) {
            return res.status(400).json({error: 'Stock cannot be negative'});
        }

        if (!name || name.trim() === '') {
            return res.status(400).json({error: 'Product name is required'});
        }

        const [result] = await db.query(
            'INSERT INTO products (name, price, stock, shop_id) VALUES (?, ?, ?, ?)',
            [name, price, stock, shop_id]
        );

        res.status(201).json({
            id: result.insertId,
            name,
            price,
            stock,
            shop_id,
            message: 'Product created successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({error: error.message });
    }
};

// PUT /api/products/:id
exports.updateProduct = async (req, res) => {
    try {
        const {name, price, stock, shop_id} = req.body;
        
        if (shop_id){
            const [shopExists] = await db.query('SELECT id FROM shops WHERE id = ?', [shop_id]);
            if (shopExists.length === 0) {
                return res.status(400).json({error: 'Shop does not exist'});
            }
        }
        
        if (price !== undefined && price <= 0) {
            return res.status(400).json({error: 'Price must be greater than 0'});
        }

        if (stock !== undefined && stock < 0) {
            return res.status(400).json({error: 'Stock cannot be negative'});
        }

        if (name !== undefined && name.trim() === '') {
            return res.status(400).json({error: 'Product name cannot be empty'});
        }

        const [result] = await db.query(
            'UPDATE products SET name = ?, price = ?, stock = ?, shop_id = ? WHERE id = ?',
            [name, price, stock, shop_id, req.params.id]
        );

        
        if (result.affectedRows === 0) {
            return res.status(404).json({error: 'Product not found'});
        }   

        res.json({message: 'Product updated successfully'});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: error.message });
    }
};

        

// DELETE /api/products/:id
exports.deleteProduct = async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM products WHERE id = ?', [req.params.id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({error: 'Product not found'});
        }

        res.json({message: 'Product deleted successfully'});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: error.message });
    }
};
