module.exports = (x, y, callback) => {
    if(x <= 0 || y <= 0) {
        setTimeout(() => callback(new Error("Dimensions must be greater than zero. Length l = " 
            + x + " and breadth b = " + y), null), 
            2000);
        console.log();
    }
    else {
        setTimeout(() => callback(null, 
            {
            perimeter: () => (2*(x+y)),  // don't need to pass in x and y here since accessible from above; this is called closure
            area: () => (x*y)
            }), 
        2000);
    }
}




