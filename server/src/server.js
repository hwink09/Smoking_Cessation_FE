const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const app = express();
const port = process.env.PORT;
const bodyParser = require("body-parser");
const morgan = require("morgan");
const db = require('./db/index.js');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const authRouter = require('./routes/auth.route.js');
const userRouter = require('./routes/user.route.js');
const statusRouter = require('./routes/smokingStatus.route.js');
const badgeRouter = require('./routes/badge.route.js');
const userBadgeRouter = require('./routes/userBadge.route.js');
const coachProfileRouter = require('./routes/coachProfile.route.js');

const whiteList = ['http://localhost:5173'];
const corsOptions = {
    origin: function (origin, callback) {
        if (whiteList.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(cookieParser());
// Connect to MongoDB
db.connectDB();
// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Run the server
app.get('/', (req, res) => {
    res.send('API Smoking website')
})

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/smoking-status', statusRouter);
app.use('/api/badges', badgeRouter);
app.use('/api/user-badge', userBadgeRouter);
app.use('/api/coach-profile', coachProfileRouter);

app.use(async (err, req, res, next) => {
    res.status = err.status || 500,
        res.send({
            "error": {
                "status": err.status || 500,
                "message": err.message
            }
        });
})

app.listen(port, () => console.log(`Server is running on http://localhost:${port}`));