import express from 'express'
import dotenv from 'dotenv'
import 'colors'
import cors from 'cors'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser';
import { db } from './utils/db.js'
import userRouter from './routes/userRoutes.js'
import createRoute from './routes/createRoute.js'
import authrouter from './routes/authRoute.js'
import paymentRouter from './routes/paymentRoute.js'
import createUserRouter from './routes/createUser.js'
import branchEmiPaymentRouter from './routes/BranchRoutes/EMIPaymentRoute.js'
import branchprintRoute from './routes/BranchRoutes/PrintRoute.js'


import colors from 'colors';
import router from './routes/hr.routes.js'
import Associaterouter from './routes/associateRoute.js' 

import memberRouter from './routes/BranchRoutes/memberRoute.js'

db.connect((err) => {
    if (err) {
        console.log('Database Connection error'.bgRed.white, err)
        return
    }
    console.log('Mysql conneced')
})
dotenv.config()
// object
const app = express()

app.use(cors({
    origin:['http://localhost:5173/'],
    methods:["POST","GET","PUT","DELETE"],
    // credentials:'include'
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser())

app.set('strict routing', false);
app.set('case sensitive routing', false);

// routes 
app.get('/', (req, res) => {
    res.send('<h1>Hello World !</h1>')
})
app.use('/api/v1', userRouter)
app.use('/api/v1', createRoute)
app.use('/api/v1', authrouter)
app.use('/api/v1', paymentRouter)
app.use('/api/v1', createUserRouter)
app.use('/api/v1', branchEmiPaymentRouter)
app.use('/api/v1', branchprintRoute)

app.use('/api/v1', router)

app.use('/api/v1', Associaterouter)

app.use('/api/v1', memberRouter)

// Port
const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`.bgMagenta.white)
})