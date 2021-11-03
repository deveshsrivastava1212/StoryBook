const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const path = require('path');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const passport = require('passport');
const methodOverride = require('method-override');
const session = require('express-session');
const MongoStore = require('connect-mongo')
const connect_DB = require('./config/db')

//Load Config
dotenv.config({path: './config/config.env'})

//passport Config
require('./config/passport')(passport)
const port = process.env.PORT || 3000;
connect_DB()

const app = express();

//body parser
app.use(express.urlencoded({extended: false}))
app.use(express.json());

//Method Override
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method
      delete req.body._method
      return method
    }
}))

app.use(morgan('dev'))

//handlebars
const { formatDate, truncate, stripTags, editIcon } = require('./helpers/hbs')

app.engine('.hbs', exphbs ({helpers:{
     formatDate, truncate, stripTags, editIcon 
    },
    defaultLayout: 'main',
    extname: '.hbs' 
}))

app.set('view engine', '.hbs')

//Sessions
app.use(session({
    secret: 'Hey Dude',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
    })
})
);

//passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Set global var
app.use(function(req, res, next) {
    res.locals.user = req.user || null
    next();
})

//Static Folder
app.use(express.static(path.join(__dirname, 'public')))


//Routes
app.use('/stories',require('./routes/stories'))
app.use('/', require('./routes/index'))
app.use('/auth',require('./routes/auth'))


app.listen(port, () =>{
    console.log(`Server is running on port ${port}`)
    console.log(`URL is: http://localhost:${port}`)
})