const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const dboper = require("./operations");

const url = 'mongodb://localhost:27017/';
const dbname = 'conFusion';

// with promises
MongoClient.connect(url).then((client) => {
    //assert.strictEqual(err, null);  // ensure there is no error

    console.log("Connected successfully to the server");
    
    const db = client.db(dbname);   // connect to database

    // using the functions we defined in operations.js
    dboper.insertDocument(db, {name: "Vadonut", description: "Test"}, 'dishes')
    .then((result) => {
        console.log('Insert document:\n', result.ops);   // ops = number of operations carried out

        return dboper.findDocuments(db, 'dishes');  
     })
    .then((docs) => {
        console.log('Found documents:\n', docs);
        
        // we can find a document with any of its fields
        return dboper.updateDocument(db, {name: "Vadonut"}, {description: "Updated Test"}, 'dishes')
    })
    .then((result) => {
        console.log('Updated documents:\n', result.result);
        return dboper.findDocuments(db, 'dishes')
    })
    .then((docs) => {
        console.log('Found documents:\n', docs);

        return db.dropCollection('dishes')
    })
    .then((result) => {
        console.log('Dropped collection: ', result);

        client.close();
    });
})
.catch((err) => console.log(err));


// without promises

// MongoClient.connect(url, (err, client) => {
//     assert.strictEqual(err, null);  // ensure there is no error

//     console.log("Connected successfully to the server");
    
//     const db = client.db(dbname);   // connect to database

//     // using the functions we defined in operations.js
//     dboper.insertDocument(db, {name: "Vadonut", description: "Test"}, 'dishes', (result) => {
//         console.log('Insert document:\n', result.ops);   // ops = number of operations carried out

//         dboper.findDocuments(db, 'dishes', (docs) => {
//             console.log('Found documents:\n', docs);

//             // we can find a document with any of its fields
//             dboper.updateDocument(db, {name: "Vadonut"}, {description: "Updated Test"}, 'dishes', (result) => {
//                 console.log('Updated documents:\n', result.result);
//                 dboper.findDocuments(db, 'dishes', (docs) => {
//                     console.log('Found documents:\n', docs);

//                     db.dropCollection('dishes', (result) => {
//                         console.log('Dropped collection: ', result);

//                         client.close();
//                     });
//                 });  
//             });
//         });
//     });


    // without operations.js module:

    // const collection = db.collection('dishes');   // access dishes collection in this database

    // collection.insertOne({"name": "Uthappizza", "description": "Test"}, (err, results) => {
    //     assert.strictEqual(err, null);
    //     console.log("After insert:\n");
    //     console.log(results.ops);  // how many operations have been carried out successfully; expect 1

    //     collection.find({}).toArray((err, docs) => {  //{} to find all records in the collection (emtpy JSON string)
    //         assert.strictEqual(err, null);
    //         console.log("Found:\n");
    //         console.log(docs);

    //         db.dropCollection('dishes', (err, result) => {
    //             assert.strictEqual(err, null);
    //             client.close();
    //         });
    //     });   
    // });
// });