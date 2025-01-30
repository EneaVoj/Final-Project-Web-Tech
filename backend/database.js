import mysql from 'mysql2'
import dotenv from 'dotenv'
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config()

const secretKey = process.env.JWT_SECRET_KEY;

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
}).promise()

// user authenticatio queries 



// PRODUCTS DATABASE QUERIES


export async function getProducts() {
    const [rows] = await pool.query("SELECT * FROM products ORDER BY id DESC")
    return rows;

}

export async function getProductById(id) {
    const [rows] = await pool.query(`
    SELECT * 
    FROM products
    where id = ?  
    `, [id])
    return rows[0]; //use ? because of untrusted data. this ensures the id is not part of the query and does not become prey of sql injection attacks
}


export async function createProduct(name, desc, img, price) {
    const result = await pool.query(`
    INSERT INTO products (product_name, product_desc, product_img_path, product_price)
    VALUES (?,?,?,?) 
    `, [name, desc, img, price])

    const id = result[0].insertId;
    return getProductById(id);
}

export async function updateProduct(id, name, desc, img, price) {
    const result = await pool.query(`
        UPDATE products
        SET product_name = ?, product_desc = ?, product_img_path = ?, product_price = ?
        WHERE id = ?
    `, [name, desc, img, price, id]);

    if (result[0].affectedRows > 0) {
        return getProductById(id);
    } else {
        throw new Error('Product not found or update failed');
    }
}

export async function deleteProduct(id) {
    const deletedProduct = await getProductById(id)
    const result = await pool.query(`
    DELETE FROM products
     WHERE id = ?
    `, [id]);

    if (result[0].affectedRows > 0) {
        return deletedProduct;
    } else {
        throw new Error('Product not found or delete failed');
    }
}


//CUSTOMER DATABASE QUERIES


export async function getCustomers() {
    const [rows] = await pool.query("SELECT id,customer_name,customer_email,customer_phone,customer_address FROM customer")
    return rows;

}

export async function getCustomerById(id) {
    const [rows] = await pool.query(`
    SELECT *
    FROM customer
    where id = ?  
    `, [id])
    return rows[0]; //use ? because of untrusted data. this ensures the id is not part of the query and does not become prey of sql injection attacks
}

export async function getCustomerByEmail(email) {
    const [rows] = await pool.query(`
    SELECT * 
    FROM customer
    where customer_email = ?  
    `, [email])
    return rows[0]; //use ? because of untrusted data. this ensures the id is not part of the query and does not become prey of sql injection attacks
}


export async function createCustomer(name, email, address, phone, password) {

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(`
    INSERT INTO customer (customer_name, customer_email, customer_address, customer_phone, customer_password)
    VALUES (?,?,?,?,?) 
    `, [name, email, address, phone, hashedPassword])

    const id = result[0].insertId;
    return getCustomerById(id);
}

export async function updateCustomer(id, name, email, address, phone) {
    const result = await pool.query(`
        UPDATE customer
        SET customer_name = ?, customer_email = ?, customer_address = ?, customer_phone = ?, customer_password = ?
        WHERE id = ?
    `, [name, email, address, phone, password, id]);

    if (result[0].affectedRows > 0) {
        return getCustomerById(id);
    } else {
        throw new Error('Customer not found or update failed');
    }
}

export async function deleteCustomer(id) {
    const deletedCustomer = await getCustomerById(id)
    const result = await pool.query(`
    DELETE FROM customer
     WHERE id = ?
    `, [id]);

    if (result[0].affectedRows > 0) {
        return deletedCustomer;
    } else {
        throw new Error('Customer not found or delete failed');
    }
}


//subsription

export async function addSubscription(name, email, phone, msg) {
    const result = await pool.query(`
    INSERT INTO subscription (sub_name, sub_email, sub_phone, sub_msg)
    VALUES (?,?,?,?) 
    `, [name, email, phone, msg])

    const id = result[0].insertId;
    return getCustomerById(id);
}

export const login = async (req, res) => {

    try {
        const {
            customer_email,
            customer_password
        } = req.body;

        const user = await getCustomerByEmail(customer_email);

        if (user && (await bcrypt.compare(customer_password, user.customer_password))) {
            const accessToken = jwt.sign({
                id: user.id
            }, secretKey, {
                expiresIn: "24h",
            });
            delete user.customer_password;

            res
                .status(200)
                .json({
                    message: "Login successful",
                    accessToken,
                    userData: user
                });
        } else {
            res.status(400).json({
                message: "Invalid username or password"
            });
        }
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};


//ORDER FUNCTIONS

export async function createOrders(customerId, orders) {
    try {
        const [rows] = await pool.query("SELECT MAX(order_id) AS maxOrderId FROM order_history");
        const nextOrderId = (rows[0].maxOrderId || 0) + 1;

        const values = orders.map((order) => [order.id, customerId, order.quantity, nextOrderId]);

        const [result] = await pool.query(
            "INSERT INTO order_history (product_id, customer_id, quantity, order_id) VALUES ?",
            [values]
        );

        return {
            orderId: nextOrderId,
            insertedRows: result.affectedRows
        };
    } catch (error) {
        console.error("Error in createOrders:", error);
        throw new Error("Failed to create orders.");
    }
}

export async function getOrders(customerId) {
    try {
        const [rows] = await pool.query(
            `
        SELECT 
          o.order_id,
          o.quantity,
          p.id AS product_id,
          p.product_name,
          p.product_desc,
          p.product_img_path,
          p.product_price
        FROM order_history o
        LEFT JOIN products p ON o.product_id = p.id
        WHERE o.customer_id = ?
        ORDER BY o.order_id ASC
        `,
            [customerId]
        );

        const groupedOrders = rows.reduce((accumulator, row) => {
            const {
                order_id,
                quantity,
                product_id,
                product_name,
                product_desc,
                product_img_path,
                product_price
            } = row;

            if (!accumulator[order_id]) {
                accumulator[order_id] = [];
            }

            accumulator[order_id].push({
                product_id,
                product_name,
                product_desc,
                product_img_path,
                product_price,
                quantity,
            });

            return accumulator;
        }, {});

        return groupedOrders;
    } catch (error) {
        console.error("Error fetching orders:", error);
        throw new Error("Failed to fetch orders.");
    }
}

export async function getAllOrders() {
    try {
        const [rows] = await pool.query(
            `
        SELECT 
          o.order_id,
          o.quantity,
          p.id AS product_id,
          p.product_name,
          p.product_desc,
          p.product_img_path,
          p.product_price,
          c.id AS customer_id,
          c.customer_name,
          c.customer_email,
          c.customer_phone,
          c.customer_address
        FROM order_history o
        LEFT JOIN products p ON o.product_id = p.id
        LEFT JOIN customer c ON o.customer_id = c.id
        ORDER BY o.order_id ASC
        `
        );

        const groupedOrders = rows.reduce((accumulator, row) => {
            const {
                order_id,
                quantity,
                product_id,
                product_name,
                product_desc,
                product_img_path,
                product_price,
                customer_id,
                customer_name,
                customer_email,
                customer_phone,
                customer_address
            } = row;

            if (!accumulator[order_id]) {
                accumulator[order_id] = {
                    customer: {
                        customer_id,
                        customer_name,
                        customer_email,
                        customer_phone,
                        customer_address
                    },
                    products: []
                };
            }

            accumulator[order_id].products.push({
                product_id,
                product_name,
                product_desc,
                product_img_path,
                product_price,
                quantity
            });

            return accumulator;
        }, {});

        return groupedOrders;
    } catch (error) {
        console.error("Error fetching all orders:", error);
        throw new Error("Failed to fetch all orders.");
    }
}