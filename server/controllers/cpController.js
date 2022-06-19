require("../models/database");
//const { resolveSoa } = require("dns");
const Category=require("../models/Category");
const cp=require("../models/cp");

// Getting the homepage

exports.homepage = async (req, res) => {

    try{

        const limitNumber=5;
        const categories= await Category.find({}).limit(limitNumber);
        const latest = await cp.find({}).sort({_id:-1}).limit(limitNumber);
        const arrays= await cp.find({'category': 'Arrays'}).limit(limitNumber);
        const dp= await cp.find({'category': 'Dynamic Programming'}).limit(limitNumber);
        const stacks= await cp.find({'category': 'Stacks&Queues'}).limit(limitNumber);
        const graphs= await cp.find({'category': 'Graphs'}).limit(limitNumber);
        const misc= await cp.find({'category': 'Miscellaneous'}).limit(limitNumber);

        const blog= {latest,arrays,dp,stacks,graphs,misc};



        res.render('index', { title: 'CodeChimps-Home', categories, blog});
    } catch(error){
        res.status(500).send({message: error.message||"OOPS an error occured"});

    }


}


// Getting the categories

exports.exploreCategories = async (req, res) => {

    try{

        const limitNumber=20;
        const categories= await Category.find({}).limit(limitNumber);
        

        res.render('categories', { title: 'CodeChimps-Categories', categories });
    } catch(error){
        res.status(500).send({message: error.message||"OOPS an error occured"});

    }
}


exports.explorecp = async (req, res) => {

    try{
        let cpid= req.params.id;
        const Cp= await cp.findById(cpid);
        res.render('cp', { title: 'CodeChimps - Blog', Cp });
    } catch(error){
        res.status(500).send({message: error.message||"OOPS an error occured"});

    }
}



exports.searchBlog= async(req,res)=>{
    try{
        let searchTerm=req.body.searchTerm;
        let Cp= await cp.find({$text:{$search: searchTerm, $diacriticSensitive:true}});

        res.render('search', {title: "CodeChimps - Search", Cp});

    }catch(error){
        res.status(500).send({message: error.message||"OOPS an error occured"});
    }




    res.render('search', { title: 'CodeChimps - Search '});
}


exports.exploreCategoriesById = async (req, res) => {

    try{
        let categoryId=req.params.id;
        const limitNumber=40;
        const categoryById= await cp.find({'category': categoryId}).limit(limitNumber);
        

        res.render('categories', { title: 'Blogs by Topic', categoryById });
    } catch(error){
        res.status(500).send({message: error.message||"OOPS an error occured"});

    }
}

//get explore latest
exports.exploreLatest = async (req, res) => {
    try{
        const limitNumber=20;
        const Cp= await cp.find({}).sort({_id:-1}).limit(limitNumber);
        res.render('explore-latest', { title: 'CodeChimps-Explore Latest', Cp });
    } catch(error){
        res.status(500).send({message: error.message||"OOPS an error occured"});

    }
}
//get explore random
exports.exploreRandom = async (req, res) => {
    try{
        let count= await cp.find().countDocuments();
        let random=(Math.floor(Math.random() * count));
        let Cp=await cp.findOne().skip(random).exec();

        res.render('explore-random', { title: 'CodeChimps-Explore Random', Cp });
    } catch(error){
        res.status(500).send({message: error.message||"OOPS an error occured"});

    }
}

//
exports.submitBlog = async (req, res) => {
    const infoErrorsObj= req.flash("infoErrors");
    const infoSubmitObj= req.flash("infoSubmit");
    if(!req.isAuthenticated()){
        req.flash('error','You must be signed in!');
        return res.redirect('/login');
    }
    res.render('submit-blog', { title: 'CodeChimps-Submit Blog',infoErrorsObj,infoSubmitObj });
}

exports.submitBlogOnPost = async (req, res) => {

    try{
        let imageUploadFile;
        let uploadPath;
        let newImageName;
    


        if(!req.files || Object.keys(req.files).length === 0){
            console.log("No files to upload");
            
        } else{
            imageUploadFile= req.files.image;
            newImageName= Date.now() + imageUploadFile.name;
        
        
            uploadPath= require('path').resolve('./')+'/public/uploads/'+ newImageName;
            imageUploadFile.mv(uploadPath,function(err){
                if(err) return res.status(500).send(err);
            });
        
        }
        const newBlog= new cp({
            name: req.body.name,
            description: req.body.description,
            email: req.body.email,
            category: req.body.category,
            image: newImageName
        });

        await newBlog.save();

        req.flash("infoSubmit", "Blog has been posted!");
        res.redirect('/submit-blog');
    }catch(error){
        //res.json(error);
        req.flash("infoErrors", error);
        res.redirect("/submit-blog");
    }
}

exports.about =async (req, res) => {
    res.render('about', { title: 'CodeChimps- About Us'});
}
exports.ask =async (req, res) => {
    if(!req.isAuthenticated()){
        req.flash('error','You must be signed in!');
        return res.redirect('/login');
    }
    res.render('ask', { title: 'CodeChimps- Ask the Monks'});
}


// async function insertDummycpData(){
//     try{
//         await cp.insertMany([
//             {
//                 "name": "Merge Sort",
//                 "description": "Merge sort is a sorting technique based on divide and conquer technique. With worst-case time complexity being Ο(n log n), it is one of the most respected algorithms. Merge sort first divides the array into equal halves and then combines them in a sorted manner.",
//                 "email": "kumarankur507@gmail.com",
//                 "category": "Arrays",
//                 "image":"https://media.geeksforgeeks.org/wp-content/cdn-uploads/Merge-Sort-Tutorial.png"
//             },
//             {
//                 "name": "Travelling Salesman",
//                 "description": "The travelling salesman problem (also called the travelling salesperson problem or TSP) asks the following question: Given a list of cities and the distances between each pair of cities, what is the shortest possible route that visits each city exactly once and returns to the origin city? It is an NP-hard problem in combinatorial optimization, important in theoretical computer science and operations research.",
//                 "email": "bansal123aryan@gmail.com",
//                 "category": "Dynamic Programming",
//                 "image":"https://www.cdn.geeksforgeeks.org/wp-content/uploads/Euler12.png"
//             },
//             {
//                 "name": "Dijkstra Algorithm",
//                 "description":"You are given a directed or undirected weighted graph with n vertices and m edges. The weights of all edges are non-negative. You are also given a starting vertex s. ",
//                 "email": "lp14lakshyapant@gmail.com",
//                 "category": "Graphs",
//                 "image":"https://miro.medium.com/max/875/1*rX7jt8J61Pyeu6Qb98mXUg.jpeg"
//             },
//             {
//                 "name": "Stacks",
//                 "description": "Stack is a linear data structure which follows a particular order in which the operations are performed. ",
//                 "email": "bhavyagra3008@gmail.com",
//                 "category": "Stacks&Queues",
//                 "image":"https://cdn.programiz.com/sites/tutorial2program/files/stack.png"
//             },
//             {
//                 "name": "Binary Search",
//                 "description": "Binary Search is a searching algorithm for finding an element's position in a sorted array.  In this approach, the element is always searched in the middle of a portion of an array.",
//                 "email": "sankalpsharma707@gmail.com",
//                 "category": "Miscellaneous",
//                 "image":"https://hackernoon.com/hn-images/1*DOR__3reJYPwGuyytG520g.jpeg"
//             },
            
//         ]);
//     } catch (error){
//         console.log('err'+ error)
//     }
// }

// insertDummycpData();







// async function insertDummyCategoryData(){
//     try{
//         await Category.insertMany([
//             {
//                 "name": "Arrays",
//                 "image": "array.png"
//             },
//             {
//                 "name": "Dynamic Programming",
//                 "image": "dp.png"
//             },
//             {
//                 "name": "Stacks/Queues",
//                 "image": "stacks.png"
//             },
//             {
//                 "name": "Graphs",
//                 "image": "graph.png"
//             }, 
//             {
//                 "name": "Miscellaneous",
//                 "image": "more.png"
//             }

//         ]);
//     } catch (error){
//         console.log('err'+ error)
//     }
// }

// insertDummyCategoryData();