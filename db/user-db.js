var connection;
exports.setupDBAndTable = function (conn) {

    //save connection
    connection = conn;

    if (!process.env.VCAP_SERVICES) {
        connection.query('CREATE DATABASE IF NOT EXISTS order_management;', function (err, success) {
            if (err)  
                return console.log(err);
            else 
                return console.log('db creatioogn');
        });

        //Switch to 'projectsDB' database
        connection.query('USE  order_management;', function (err) {
            if (err)  return console.log(err);
        });
    }
    //setup 'projects' table w/ schema
    connection.query('SHOW TABLES LIKE "userinfo";', function (err, rows) {
        if (err) return console.log(err);

        //create table if it's not already setup
        if (rows.length == 0) { console.log("table is setting")
            var sql = "" +
                "CREATE TABLE userinfo(" +
                " name VARCHAR(250) NOT NULL default ''," +
                " email VARCHAR(250) NOT NULL default ''," +
                " userid VARCHAR(250) NOT NULL default '',"+
                " company VARCHAR(250) NOT NULL default ''," +
                " country VARCHAR(250) NOT NULL default ''," +
                " PRIMARY KEY (userid)" +
                ");";

            connection.query(sql, function (err) {
                if (err) 
                    return console.log(err);
                else 
                    return console.log("table is create");
            });
        }

    });


};

 exports.registerUser = function (task, callback) {
     connection.query("INSERT INTO userinfo (name, email, company, country, userid) VALUES (?, ?, ?, ?, ?)", [task.name, task.email, task.company, task.country, task.userid], callback);
 };

 exports.loginUser = function(email, callback) {
    connection.query("SELECT * FROM userinfo WHERE email=" + "'"+email+"'", callback)
 }



