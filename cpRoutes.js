const express=require('express');
const { append } = require('express/lib/response');
const router=express.Router();
const cpController=require('../controllers/cpController');


router.get('/',cpController.homepage);
router.get('/categories',cpController.exploreCategories);
router.get('/cp/:id',cpController.explorecp);
router.get('/categories/:id',cpController.exploreCategoriesById);
router.post('/search', cpController.searchBlog);
router.get("/explore-latest", cpController.exploreLatest);
router.get("/explore-random", cpController.exploreRandom);
router.get("/about", cpController.about);
router.get("/ask", cpController.ask);
router.get("/submit-blog", cpController.submitBlog);
router.post("/submit-blog", cpController.submitBlogOnPost);


module.exports=router;