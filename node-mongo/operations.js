const assert = require('assert');

exports.insertDocument = (db, document, collection, callback) => {
    const coll = db.collection(collection);  // get the collection we want to insert into
    // db connection, document to insert, collection to insert into, callback to call once operation completes
    // coll.insert(document, (err, result) => {
    //     assert.strictEqual(err, null);
    //     console.log("Inserted " + result.result.n + " documents into collection " + collection);
    //     callback(result);
    // });
    return coll.insert(document);  // return the promise object
};   

exports.findDocuments = (db, collection, callback) => {
    const coll = db.collection(collection);
    // coll.find({}).toArray((err, docs) => {
    //     assert.strictEqual(null, err);
    //     callback(docs);
    // });
    return coll.find({}).toArray();  // return promise
}; 

exports.removeDocument = (db, document, collection, callback) => {
    const coll = db.collection(collection);
    // coll.deleteOne(document, (err, result) => {
    //     assert.strictEqual(err, null);
    //     console.log("Removed the document", document);   // use , since document is a JavaScript object 
    //     callback(result);
    // });
    return coll.deleteOne(document);  // return promise
}; 

exports.updateDocument = (db, document, update, collection, callback) => {
    const coll = db.collection(collection);
    // coll.updateOne(document, {$set: update}, null, (err, result) => {  // $set tells which fields to update
    //     assert.strictEqual(err, null);
    //     console.log("Updated the document with ", update);
    //     callback(result);
    // });
    return coll.updateOne(document, {$set: update}, null);  // return promise
};