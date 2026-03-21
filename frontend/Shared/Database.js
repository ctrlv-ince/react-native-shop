import * as SQLite from 'expo-sqlite';

let db;

export const initDb = async () => {
    try {
        db = await SQLite.openDatabaseAsync('shopApp.db');
        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS Cart (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                productId TEXT NOT NULL,
                name TEXT,
                price REAL,
                image TEXT,
                quantity INTEGER,
                userId TEXT
            );
        `);
        try {
            await db.execAsync('ALTER TABLE Cart ADD COLUMN userId TEXT');
            await db.runAsync('UPDATE Cart SET userId = ? WHERE userId IS NULL', ['guest']);
        } catch (e) {
            // column already exists
        }
        console.log('Database initialized');
    } catch (error) {
        console.error('Error initializing db', error);
    }
};

export const fetchCartItems = async (userId = 'guest') => {
    if (!db) await initDb();
    try {
        const allRows = await db.getAllAsync('SELECT * FROM Cart WHERE userId = ?', [userId]);
        return allRows;
    } catch (error) {
        console.error('Error fetching cart items', error);
        return [];
    }
};

export const insertCartItem = async (item, quantityToAdd = 1, userId = 'guest') => {
    if (!db) await initDb();
    try {
        // check if exists
        const exists = await db.getFirstAsync('SELECT * FROM Cart WHERE productId = ? AND userId = ?', [item.id, userId]);
        if (exists) {
            await db.runAsync('UPDATE Cart SET quantity = quantity + ? WHERE productId = ? AND userId = ?', [quantityToAdd, item.id, userId]);
        } else {
            await db.runAsync(
                'INSERT INTO Cart (productId, name, price, image, quantity, userId) VALUES (?, ?, ?, ?, ?, ?)',
                [item.id, item.name, item.price, item.images?.[0]?.url || item.image || '', quantityToAdd, userId]
            );
        }
    } catch (error) {
        console.error('Error inserting item', error);
    }
};

export const updateCartItemQty = async (productId, newQuantity, userId = 'guest') => {
    if (!db) await initDb();
    try {
        await db.runAsync('UPDATE Cart SET quantity = ? WHERE productId = ? AND userId = ?', [newQuantity, productId, userId]);
    } catch (error) {
        console.error('Error updating item quantity', error);
    }
};

export const removeCartItem = async (productId, userId = 'guest') => {
     if (!db) await initDb();
     try {
         await db.runAsync('DELETE FROM Cart WHERE productId = ? AND userId = ?', [productId, userId]);
     } catch (error) {
         console.error('Error deleting item', error);
     }
};

export const clearCart = async (userId = 'guest') => {
     if (!db) await initDb();
     try {
         await db.runAsync('DELETE FROM Cart WHERE userId = ?', [userId]);
     } catch (error) {
          console.error('Error clearing cart', error);
     }
}
