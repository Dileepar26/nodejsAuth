const mysql = require("mysql")

const config = {
    user:process.env.user,
    host:process.env.host,
    password:process.env.password,
    database: process.env.database
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