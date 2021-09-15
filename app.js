const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const path = require('path');
const exphbs = require('express-handlebars');
const passport = require('passport');
const session = require('express-session');
const connect_DB = require('./config/db')

//Load Config
dotenv.config({path: './config/config.env'})

//passport Config
require('./config/passport')(passport)
const PORT = process.env.PORT || 3000
connect_DB()

const app = express();
if (process.env.NODE_ENV == 'development') {
    app.use(morgan('dev'))
}

//handlebars
app.engine('.hbs', exphbs ({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', '.hbs')

//Sessions
app.use(session({
    secret: 'Hey Dude',
    resave: false,
    saveUninitialized: false
}))

//passport middleware
app.use(passport.initialize())
app.use(passport.session())

//Static Folder
app.use(express.static(path.join(__dirname, 'public')))


//Routes
app.use('/', require('./routes/index'))
app.use('/auth',require('./routes/auth'))

app.listen(PORT, () =>{
    console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`)
    console.log(`URL is: http://localhost:${PORT}`)
})