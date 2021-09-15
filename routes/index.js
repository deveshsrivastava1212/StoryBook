const express = require('express');
const router = express.Router();

//LOGIN PAGE
router.get('/', (req,res) => {
    res.render('Login', {
        layout: 'login'
    })
})

//Dashboard Page
router.get('/dashboard', (req,res) => {
    res.render('dashboard')
})

//Logout User
// router- /auth/logout
router.get('/logout', (req,res) => {
    res.logout()
    res.redirect('/')
})

module.exports = router;