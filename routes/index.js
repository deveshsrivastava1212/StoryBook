const express = require('express');
const router = express.Router();
const {ensureAuth, ensureUser} = require('../middleware/auth2')
const Story = require('../models/StoryModel')

//LOGIN PAGE
router.get('/', ensureUser, (req,res) => {
    res.render('login', {
        layout: 'login'
    })
})

//Dashboard Page
router.get('/dashboard', ensureAuth, async (req, res) => {
    try{
        const stories = await Story.find( { user: req.user.id }).lean()
        res.render('dashboard', {
            name: req.user.firstName,
            stories
        })
    }catch(err) {
        console.error(err)
        res.render('error/500');
    }
}),

//Logout User
// router- /auth/logout
router.get('/logout', (req,res) => {
    res.logout()
    res.redirect('/')
})

module.exports = router;