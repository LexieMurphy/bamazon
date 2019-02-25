var inquirer = require('inquirer');
var mysql = require('mysql');
var Table = require('cli-table');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Lovegod88*",
    database: "bamazon_db"
})


//Displays MySQL items and adds them into table for display in CLI.  
var checkAndBuy2 = function () {
    connection.query('SELECT * FROM products', function (err, res) {

        var table = new Table({
            head: ['ID', 'Product Name', 'Department', 'Price', 'Stock Quantity']
        });


        //Displays what is for sale in the table in the console and adds a separator to split from previous purchase.
        console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
        console.log("Here is what is avialble for purchase: ");

        for (var i = 0; i < res.length; i++) {
            table.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price.toFixed(2), res[i].stock_quantity]);
        }
        console.log(table.toString());
        inquirer.prompt([{
            name: "item_id",
            type: "input",
            message: "What is the ID of the product you wish to purchase?",
            validate: function (value) {
                if (isNaN(value) == false) {
                    return true;
                } else {
                    return false;
                }
            }
        }, {
            name: "Quantity",
            type: "input",
            message: "How many units of the product would you like to purchase?",
            validate: function (value) {
                if (isNaN(value) == false) {
                    return true;
                } else {
                    return false;
                }
            }
            
        }]).then(function (answer) {
            var chosenId = answer.item_id - 1
            var chosenProduct = res[chosenId]
            var chosenQuantity = answer.Quantity
            if (chosenQuantity < res[chosenId].stock_quantity) {
                console.log("Your total for " + "(" + answer.Quantity + ")" + " - " + res[chosenId].product_name + " is: " + res[chosenId].price.toFixed(2) * chosenQuantity);
                connection.query("UPDATE products SET ? WHERE ?", [{
                    stock_quantity: res[chosenId].stock_quantity - chosenQuantity
                }, {
                    item_id: res[chosenId].item_id
                }], function (err, res) {
                    //console.log(err); 
                    checkAndBuy2();
                });

            } else {
                console.log("SORRY - INSUFFICIENT QUANTITY! Order is canceled.");
                checkAndBuy2();
            }
        })
    })
}

checkAndBuy2(); 
