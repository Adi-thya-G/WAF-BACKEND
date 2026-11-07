
// 1. Unused variable
function calculateTotal(price, quantity) {
    let discount = 10;
    let unusedValue = 100;

    // 2. Use of var instead of let/const

    
    var total = price * quantity;

    // 3. Duplicate condition
    if (total > 1000) {
        total = total - 100;
    } else if (total > 1000) {
        total = total - 200;
    }

    // 4. Unnecessary boolean comparison
    if (total > 0 === true) {
        console.log("Valid total");
    }

    return total;
}

// 5. Hardcoded credentials (Security Hotspot)
const username = "admin";
const password = "admin123";

// 6. Empty function
function processPayment() {
}

// 7. Nested if statements
function checkUser(user) {
    if (user) {
        if (user.age > 18) {
            if (user.active) {
                console.log("Eligible");
            }
        }
    }
}

// 8. Console logging
console.log("Application started");

// 9. Use of == instead of ===
function compareValues(a, b) {
    if (a == b) {
        return true;
    }
    return false;
}

// 10. Infinite loop (do not execute this function)
function infiniteLoop() {
    while (true) {
        console.log("Running forever");
    }
}

// 11. Duplicate code
function addNumbers(a, b) {
    console.log(a + b);
}

function sumValues(x, y) {
    console.log(x + y);
}

// 12. Unreachable code
function getResult() {
    return "Success";
    console.log("This will never execute");
}

// 13. Possible null/undefined access
function getUserName(user) {
    return user.profile.name;
}

// 14. Hardcoded sensitive information
const apiKey = "1234567890abcdef";
