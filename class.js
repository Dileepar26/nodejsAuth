const mysql = require("mysql")

const config = {
    user:"dileep",
    host:"db4free.net",
    password:"Dileep@26",
    database:"my_development",
}

class Database {
    constructor() {
        this.connection = mysql.createConnection(config);
    }
    query(sql, args) {
        return new Promise((resolve, reject) => {
            this.connection.query(sql, args, (err, rows) => {
                if (err) {
                    this.connection.end(err => {
                        if (err) {
                            return reject(err);
                        }
                    })
                    return reject(err);
                }
                resolve(rows);
            });
        });
    }

    close() {
        return new Promise((resolve, reject) => {
            this.connection.end(err => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    }
}

module.exports = {Database}