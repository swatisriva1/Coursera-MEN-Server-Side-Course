// var rect = {
//     perimeter: (x, y) => (2*(x+y)),
//     area: (x, y) => (x*y)
// };

var rect = require('./rectangle');

function solveRect(l, b) {
    console.log("Solving for rectangle with length l = " + l + " and breadth b = " + b);
    rect(l, b, (err, rectangle) => {
        if(err) {
            console.log("Error: " + err.message);
        }
        else {
            console.log("The area of the rectangle of dimensions l = " 
                + l + " and b = " + b + " is " + rectangle.area());
            console.log("The perimeter of the rectangle of dimensions l = " 
                + l + " and b = " + b + " is " + rectangle.perimeter());
        }
    });
    console.log("This statement is after the call to rect");
    
    // if(l <= 0 || b <= 0) {
    //     console.log("Dimensions must be greater than zero. Length l = " + l + " and breadth b = " + b);
    // }
    // else {
    //     var area = rect.area(l, b);
    //     console.log("The area of the rectangle is " + area);
    //     var perim = rect.perimeter(l, b);
    //     console.log("The perimeter of the rectangle is " + perim);
    // }

}

solveRect(2, 4);
solveRect(3, 5);
solveRect(0, 5);
solveRect(-3, 5);