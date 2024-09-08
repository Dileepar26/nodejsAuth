const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const cookieParser = require('cookie-parser');
const { requireAuth } = require('./middleware/authMiddleware');

// middleware
app.use(express.static('public'));
app.use(cookieParser())

// view engine
app.set('view engine', 'ejs');
app.use(express.json());
// routes
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies',requireAuth, (req, res) => res.render('smoothies'));
console.log(process.env.data)
app .use(require('./routes/authRoutes'))
port = 5000
app.listen(port,()=>console.log(`server is running at port number ${port}`))