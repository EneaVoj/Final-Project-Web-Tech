import express from 'express'
import path from 'path';
import {
    fileURLToPath
} from 'url';
import cors from 'cors';
import multer from 'multer';

import {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} from './database.js';
import {
    getCustomers,
    login,
    getCustomerById,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    addSubscription
} from './database.js';
import {
    createOrders,
    getOrders,
    getAllOrders
} from './database.js';

import {
    authenticate,
    authorizeAdmin
} from './middleware.js';

const app = express();
app.use(express.json())


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
const upload = multer({
    storage
})

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//CORS allows us to connect front with back

const corsOptions = {
    origin: 'http://127.0.0.1:5500', // Allow this specific origin
    optionsSuccessStatus: 200, // For legacy browser support
};
app.use(cors(corsOptions));

const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/images', express.static(path.join(__dirname, 'images')));

app.post("/uploadImg", upload.single('file'), async (req, res) => {
    res.send('Uploaded successfully')
})

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//PRODUCTS HTTP REQUESTS
app.get("/getProducts", async (req, res) => {
    const products = await getProducts()
    res.send(products)
})

app.get("/getProductById/:id", async (req, res) => {
    const id = req.params.id
    const product = await getProductById(id)
    res.send(product)
})


app.post("/createProduct", authenticate, authorizeAdmin, upload.single('file'), async (req, res) => {
    const {
        product_name,
        product_desc,
        product_price
    } = req.body;

    const product_img_path = req.file.filename;
    const product = await createProduct(product_name, product_desc, product_img_path, product_price)
    res.send(product)
})


app.put("/updateProduct/:id", authenticate, authorizeAdmin, upload.single('file'), async (req, res) => {
    const id = req.params.id
    const {
        product_name,
        product_desc,
        product_price
    } = req.body;

    const product_img_path = req.file.filename;
    try {
        const updatedProduct = await updateProduct(id, product_name, product_desc, product_img_path, product_price);
        res.json(updatedProduct);
    } catch (error) {
        res.status(400).send({
            error: error.message
        });
    }
});


app.delete("/deleteProduct/:id", authenticate, authorizeAdmin, async (req, res) => {
    const id = req.params.id
    try {
        const deletedProduct = await deleteProduct(id);
        res.json(deletedProduct);
    } catch (error) {
        res.status(400).send({
            error: error.message
        });
    }
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//CUSTOMER HTTP REQUESTS 


app.get("/getCustomers", authenticate, async (req, res) => {
    const customers = await getCustomers()
    res.send(customers)
})

app.post("/login", login)

app.get("/getCustomerById/:id", async (req, res) => {
    const id = req.params.id
    const customer = await getCustomerById(id)
    res.send(customer)
})


app.post("/createCustomer", async (req, res) => {
    try {
        const {
            customer_name,
            customer_email,
            customer_address,
            customer_phone,
            customer_password
        } = req.body
        const customer = await createCustomer(customer_name, customer_email, customer_address, customer_phone, customer_password)
        res.send(customer)
    } catch (error) {
        return res
            .status(403)
            .json({
                message: error
            });
    }
})


app.put("/updateCustomer/:id", async (req, res) => {
    const id = req.params.id
    const {
        customer_name,
        customer_email,
        customer_address,
        customer_phone,
        customer_password
    } = req.body;
    try {
        const updatedCustomer = await updateCustomer(id, customer_name, customer_email, customer_address, customer_phone, customer_password);
        res.json(updatedCustomer);
    } catch (error) {
        res.status(400).send({
            error: error.message
        });
    }
});


app.delete("/deleteCustomer/:id", async (req, res) => {
    const id = req.params.id
    try {
        const deletedCustomer = await deleteCustomer(id);
        res.json(deletedCustomer);
    } catch (error) {
        res.status(400).send({
            error: error.message
        });
    }
});


///// subs



app.post("/subscribe", async (req, res) => {
    const {
        sub_name,
        sub_email,
        sub_phone,
        sub_msg
    } = req.body
    const customer = await addSubscription(sub_name, sub_email, sub_phone, sub_msg)
    res.send(customer)
})


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//ORDERS HTTP REQUESTS 

app.post("/createOrder", authenticate, async (req, res) => {
    try {
        const customerId = req.user.id;
        const orders = req.body;

        if (!Array.isArray(orders) || orders.length === 0) {
            return res.status(400).json({
                message: "Invalid orders data."
            });
        }

        const result = await createOrders(customerId, orders);

        res.status(201).json({
            message: "Order created successfully.",
            orderId: result.orderId,
        });
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({
            message: "An error occurred while creating the order."
        });
    }
});

app.get("/getOrders", authenticate, async (req, res) => {
    try {
        const customerId = req.user.id;

        const orders = await getOrders(customerId);

        res.status(200).json({
            message: "All orders fetched for customer"+customerId,
            orders,
        });
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({
            message: "An error occurred while fetching the orders."
        });
    }
});

app.get("/getAllOrders", async (req, res) => {
    try {
        const orders = await getAllOrders();

        res.status(200).json({
            message: "All orders fetched successfully.",
            orders
        });
    } catch (error) {
        console.error("Error fetching all orders:", error);
        res.status(500).json({
            message: "An error occurred while fetching all orders."
        });
    }
});



//
const server = app.listen(3000, '0.0.0.0', (error) => {
    if (error) {
        throw error // e.g. EADDRINUSE
    }
    console.log(`Listening on ${JSON.stringify(server.address())}`)
})