const express = require('express');
const router = express.Router();
const {ensureAuth} = require('../middleware/auth2')
const Story = require('../models/StoryModel')

//Show add Page
//routes /stories/add
router.get('/add', ensureAuth, (req,res) => {
    res.render('stories/add')
    // try {
    //     const title = req.body.title;
    //     const
    // } catch (err) {
        
    // }
})

module.exports = router;