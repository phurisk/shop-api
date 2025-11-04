const db = require("../config/database");

// Get api/shops
exports.getAllShops = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM shops');
        res.json(rows);
    } catch (error) {
        console.error('Error getting all shops:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get api/shops/:id
exports.getShopById = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM shops WHERE id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Shop not found' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Error getting shop by id:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// POST api/shops 
exports.createShop = async (req, res) => {
    try {
        const { name, owner, province } = req.body;
        
        // ตรวจสอบข้อมูลที่จำเป็น
        if (!name || name.trim() === '') {
            return res.status(400).json({ error: 'Shop name is required' });
        }
        if (!owner || owner.trim() === '') {
            return res.status(400).json({ error: 'Owner is required' });
        }
        if (!province || province.trim() === '') {
            return res.status(400).json({ error: 'Province is required' });
        }

        // ตรวจสอบชื่อร้านซ้ำ
        const [existingShop] = await db.query(
            'SELECT id FROM shops WHERE name = ?',
            [name.trim()]
        );
        
        if (existingShop.length > 0) {
            return res.status(409).json({ 
                error: 'Shop name already exists',
                message: 'ชื่อร้านนี้มีอยู่ในระบบแล้ว กรุณาใช้ชื่ออื่น'
            });
        }

        // เพิ่มร้านใหม่
        const [result] = await db.query(
            'INSERT INTO shops (name, owner, province) VALUES (?, ?, ?)',
            [name.trim(), owner.trim(), province.trim()]
        );
        
        res.status(201).json({
            id: result.insertId,
            name: name.trim(),
            owner: owner.trim(),
            province: province.trim(),
            message: 'Shop created successfully'
        });
    } catch (error) {
        console.error('Error creating shop:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// PUT api/shops/:id
exports.updateShop = async (req, res) => {
    try {
        const { name, owner, province } = req.body;
        const shopId = req.params.id;

        // ตรวจสอบข้อมูลที่จำเป็น
        if (!name || name.trim() === '') {
            return res.status(400).json({ error: 'Shop name is required' });
        }
        if (!owner || owner.trim() === '') {
            return res.status(400).json({ error: 'Owner is required' });
        }
        if (!province || province.trim() === '') {
            return res.status(400).json({ error: 'Province is required' });
        }

        // ตรวจสอบว่าร้านที่จะอัพเดทมีอยู่จริงหรือไม่
        const [currentShop] = await db.query(
            'SELECT id FROM shops WHERE id = ?',
            [shopId]
        );
        
        if (currentShop.length === 0) {
            return res.status(404).json({ error: 'Shop not found' });
        }

        // ตรวจสอบชื่อร้านซ้ำ (ห้ามซ้ำกับร้านอื่น แต่อนุญาตให้ใช้ชื่อเดิมของร้านตัวเอง)
        const [existingShop] = await db.query(
            'SELECT id FROM shops WHERE name = ? AND id != ?',
            [name.trim(), shopId]
        );
        
        if (existingShop.length > 0) {
            return res.status(409).json({ 
                error: 'Shop name already exists',
                message: 'ชื่อร้านนี้มีอยู่ในระบบแล้ว กรุณาใช้ชื่ออื่น'
            });
        }

        // อัพเดทข้อมูลร้าน
        const [result] = await db.query(
            'UPDATE shops SET name = ?, owner = ?, province = ? WHERE id = ?',
            [name.trim(), owner.trim(), province.trim(), shopId]
        );

        res.json({ message: 'Shop updated successfully' });

    } catch (error) {
        console.error('Error updating shop:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

//  DELETE api/shops/:id
exports.deleteShop = async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM shops WHERE id = ?', [req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Shop not found' });
        }

        res.json({ message: 'Shop deleted successfully' });
    } catch (error) {
        console.error('Error deleting shop:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};