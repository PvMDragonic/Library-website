import { database } from './database/database';
import { router } from './routes';
import express from 'express';
import cors from 'express'

database.connect((err) => {
    err ? console.log(err) : console.log('Connected to database.');
});

const app = express();
const port = process.env.PORT || 3333;

app.use(cors());

app.use((_, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.use(express.json());

app.use(router);

app.listen(port, () => console.log(`Server started on localhost:${port}`));