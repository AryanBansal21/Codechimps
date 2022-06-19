const mongoose =require("mongoose");
const cpSchema= new mongoose.Schema({
    name:{
        type: String,
        required: 'This field is required.'
    },
    description:{
        type: String,
        required: 'This field is required.'
    },
    email:{
        type: String,
        required: 'This field is required.'
    },
    category:{
        type: [String],
        enum: ['Arrays', 'Dynamic Programming', 'Stacks&Queues', 'Graphs','Miscellaneous'],
        required: 'This field is required.'
    },
    image:{
        type: String,
        required: 'This field is required.'
    },
});

cpSchema.index({name: "text", description: "text"});
//we are indexing name and description so as to search


module.exports= mongoose.model('cp', cpSchema);

