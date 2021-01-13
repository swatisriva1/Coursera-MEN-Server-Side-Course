const mongoose = require('mongoose');
const Dishes = require('./models/dishes');

const url = 'mongodb://localhost:27017/conFusion';
const connect = mongoose.connect(url);

connect.then((db) => {
    console.log("Connected successfully to server");

    // var newDish = Dishes({
    //     name: 'Utthapizza',
    //     description: 'Test'
    // });
    Dishes.create({
        name: 'Utthapizza',
        description: 'Test'
    })
    // newDish.save()
    .then((dish) => {
        console.log("dish:\n", dish);
        return Dishes.findByIdAndUpdate(dish._id, {
            $set: { description: 'updated test' }
        }, {
            new: true    // once update is complete, updated dish is returned to us
        }).exec();   // find all dishes in dishes collection; exec ensures line is executed
    })
    .then((dish) => {
        console.log("dish:\n", dish);
        dish.comments.push({
            rating: 5,
            comment: "I'm getting a sinking feeling!",
            author: "Leonardo di Capprio"
        });
        return dish.save();
    })
    .then((dish) => {
        console.log('updated dish:\n', dish);
        return Dishes.remove({});    // remove all dishes
    })
    .then(() => {
        mongoose.connection.close();
    })
    .catch((err) => {
        console.log(err);
    });
});