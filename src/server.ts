import * as dotenv from 'dotenv';
import { FastifyInstance } from "fastify";
import User from "./modules/user/user.model";
import sequelize from "./config/mysql.adapter";
import { mainFastify } from "./index";
import Product from "./modules/product/product.model";
import UpsellModel from "./modules/upsell/upsell.model";
import { Transaction, TransactionProduct } from "./modules/transaction/transaction.model";

dotenv.config();

const server: FastifyInstance = mainFastify({ logger: true})

// graceful shutdown
const listeners = ['SIGINT', 'SIGTERM']
listeners.forEach((signal) => {
    process.on(signal, async () => {
        await server.close()
        process.exit(0)
    })
})

const start = async () => {
    try {
        // Authenticate DB
        await sequelize.authenticate();

        // Synchronise DB Models
        await User.sync();
        await Product.sync();
        await UpsellModel.sync();
        await Transaction.sync();
        await TransactionProduct.sync();

        const port: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;
        await server.listen({ port, host: '0.0.0.0' });
        console.log('Server listening on http://localhost:3000');
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};

void start();
