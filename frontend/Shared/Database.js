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
                quantity INTEGER
            );
        `);
        console.log('Database initialized');
    } catch (error) {
        console.error('Error initializing db', error);
    }
};

export const fetchCartItems = async () => {
    if (!db) await initDb();
    try {
        const allRows = await db.getAllAsync('SELECT * FROM Cart');
        return allRows;
    } catch (error) {
        console.error('Error fetching cart items', error);
        return [];
    }
};

export const insertCartItem = async (item) => {
    if (!db) await initDb();
    try {
        // check if exists
        const exists = await db.getFirstAsync('SELECT * FROM Cart WHERE productId = ?', [item.id]);
        if (exists) {
            await db.runAsync('UPDATE Cart SET quantity = quantity + 1 WHERE productId = ?', [item.id]);
        } else {
            await db.runAsync(
                'INSERT INTO Cart (productId, name, price, image, quantity) VALUES (?, ?, ?, ?, ?)',
                [item.id, item.name, item.price, item.images?.[0]?.url || item.image || '', 1]
            );
        }
    } catch (error) {
        console.error('Error inserting item', error);
    }
};

export const removeCartItem = async (productId) => {
     if (!db) await initDb();
     try {
         await db.runAsync('DELETE FROM Cart WHERE productId = ?', [productId]);
     } catch (error) {
         console.error('Error deleting item', error);
     }
};

export const clearCart = async () => {
     if (!db) await initDb();
     try {
         await db.runAsync('DELETE FROM Cart');
     } catch (error) {
          console.error('Error clearing cart', error);
     }
}
