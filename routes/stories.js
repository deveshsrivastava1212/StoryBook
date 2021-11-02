const express = require('express');
const router = express.Router();
const {ensureAuth} = require('../middleware/auth2')

const Story = require('../models/StoryModel')

//Show add Page
//routes /stories/add
router.get('/add', ensureAuth, (req,res) => {
    res.render('stories/add')
})

//Show add story
//routes @POST/stories
router.post('/', ensureAuth, async (req,res) => {
    try {
        // console.log(req.body)
        req.body.user = req.user.id
        await Story.create(req.body)
        res.redirect('/dashboard')
    } catch (err) {
        console.log(err);
        res.render("error/500 ")
    }
})

//Show All public stories
//routes @GET/stories
router.get('/', ensureAuth, async(req,res) => {
    try {
        const stories = await Story.find({status: 'public'})
            .populate('user')
            .sort({createdAt: 'desc'})
            .lean()
        // console.log(stories)
        res.render('stories/index', {
            stories,
        })
    } catch (err) {
        console.error(err);
        res.render('error/500')
    }
})

//Show single story
//routes GET/stories/:id
router.get('/:id', ensureAuth, async (req,res) => {
   try {
       const story = await Story.findById(req.params.id)
        .populate('user')
        .lean()

    if(!story){
        res.render('error/404')
    }

    res.render('stories/show', {
        story
    })
   } catch (err) {
       console.log(err);
       res.render("error/500")
   }
})

//Show add edit page
//routes /stories/edit/:id
router.get('/edit/:id', ensureAuth, async (req,res) => {
    try {
        const story = await Story.findOne({
            _id: req.params.id
        }).lean()
    
        if(!story){
            res.render("error/404")
        }
    
        if (story.user != req.user.id){
            res.render("/stories")
        } else {
            res.render('stories/edit',{
                story,
            })
        }
    } catch (err) {
        console.log(err);
        res.render("error/500")
    }
    
})

//To edit the story
//routes /stories/:id
router.put('/:id', ensureAuth, async (req,res) => {
    try {
        const story = await Story.findById({_id: req.params.id}).lean();
        if(!story){
            return res.render("error/404")
      }
        if (story.user != req.user.id){
          res.render("/stories")
         } else {
        const story = await Story.findOneAndUpdate({_id: req.params.id}, req.body, {
            new: true
        })

        res.redirect('/dashboard')
    }
    } catch (err) {
        console.log(err);
        res.render("error/500")
    }
    
})

//To delete story
//routes /stories/:id
router.delete('/:id', ensureAuth, async (req,res) => {
    try {
        const story = await Story.findByIdAndDelete({_id: req.params.id})
        res.redirect('/dashboard');
        window.alert("Deleted Successfully");
    } catch (err) {
        console.log(err);
        res.render("error/500")
    }
    
})

//Show User profile
//routes /stories/user/:userId
router.get('/user/:userId', ensureAuth, async(req,res) => {
    try {
        const stories = await Story.find({ 
            user: req.params.userId,
            status: 'public'
        })
        .populate('user')
        .lean()
        res.render('stories/index', {stories})
    } catch (err) {
        console.log(err);
        res.render('error/500')
    }
})

//to add comment in story
//routes /stories/:id
router.post('/:id', ensureAuth, async(req,res) => {
    try {
        const story = await Story.findById(req.params.id)
            .populate('user')
            .lean()
        if(!story){
            res.render('error/404')
        }
        const comment = req.body.comment;

        await Story.create(comment);
        res.render('stories/show', {
            story
        })
        
    } catch (err) {
        console.log(err);
        res.render("error/500")
    }
})

module.exports = router;

