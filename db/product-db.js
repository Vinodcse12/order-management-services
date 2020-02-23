var connection;
exports.setupDBAndTable2 = function (conn) {

    //save connection
    connection = conn;

    if (!process.env.VCAP_SERVICES) {
        connection.query('CREATE DATABASE IF NOT EXISTS order_management;', function (err) {
            if (err)  return console.log(err);
        });

        //Switch to 'projectsDB' database
        connection.query('USE  order_management;', function (err) {
            if (err)  return console.log(err);
        });
    }

    //setup 'projects' table w/ schema
    connection.query('SHOW TABLES LIKE "productlist";', function (err, rows) {
        if (err) return console.log(err);

        //create table if it's not already setup
        if (rows.length == 0) { console.log("table is setting")
            var sql = "" +                
                "CREATE TABLE productlist(" +
                " productName VARCHAR(50) NOT NULL default ''," +
                " productPrice VARCHAR(50) NOT NULL default ''," +
                " productQuantity VARCHAR(50) NOT NULL default ''," +
                " totalAmount VARCHAR(50) NOT NULL default '',"+
                " paymentMode VARCHAR(50) NOT NULL default ''," +
                " userid VARCHAR(250) NOT NULL default ''," +
                " productId VARCHAR(250) NOT NULL default '',"+
                " PRIMARY KEY (productId)" +
                ");";
              
            connection.query(sql, function (err) {
                if (err) 
                  return console.log(err);
                else return 
                  console.log("table is create");
            });
        }

    });

};

exports.createList = function (task, callback) {
   // console.log(task); 
    connection.query("INSERT INTO productlist (productName, productPrice, productQuantity, totalAmount, paymentMode, userid, productId) VALUES (?, ?, ?, ?, ?, ?, ?)", [task.productName, task.productPrice, task.productQuantity, task.totalAmount, task.paymentMode, task.userid, task.productId], callback);
};

exports.getItemList = function (task, callback) {
   // console.log(task);
    connection.query("SELECT * FROM productlist WHERE userid=" + "'"+task.id+"'", callback)
};

exports.deleterUser = function(task, callback) {
    console.log(task)
    connection.query("DELETE FROM user_info WHERE url="+ "'"+task.url+"'", callback)
};