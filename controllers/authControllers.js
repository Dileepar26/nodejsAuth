const {Database} = require("../class");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// create json web token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, 'Dileep secret', {
    expiresIn: maxAge
  });
};

const signup_get = async (req, res) => {
    // try {
    //     const {id} = req.query;
    //     const db = new Database();
    //     const sql = "SELECT * FROM user_details WHERE id = ?";
    //     const users = await db.query(sql, [id]);
    //     db.close();
    //     return res.status(200).json({
    //         message: "Users fetched successfully",
    //         users
    //     }); 
    // } catch (error) {
    //     console.log(error.stack);
    //     return res.status(500).json({
    //         message: "Internal server error",
    //         error: error.message
    //     });
    // }
    res.render('signup');
}

const signup_post = async (req, res) => {
    try {
        const {email, name, password} = req.body;
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        const db = new Database();
        const sql = "INSERT INTO user_details (email, name, password) VALUES (?, ?, ?)";
        const user = await db.query(sql, [email, name, hashedPassword]);
        const token = createToken(user.insertId);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        db.close();
        return res.status(200).json({
            message: "User created successfully",
            user_id: user.insertId
        });    
    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}

const login_get = (req, res) => {
    res.render('login');
}

const login_post = async (req, res) => {
    try {
        const {email, password} = req.body;
        const db = new Database();
        const sql = "SELECT * FROM user_details WHERE email = ?";
        const user = await db.query(sql, [email]);
        const comparePassword = await bcrypt.compare(password, user[0].password);
        if(user.length === 0) {
            db.close();
            return res.status(400).json({
                message: "User not found"
            });

        } else {
            if (comparePassword) {
                const token = createToken(user[0].id);
                res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
                return res.status(200).json({
                    message: "User logined successfully",
                    user_id: user[0].id
                });
            }
            throw Error('incorrect password');
        }    
    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}

const logout_get = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
}

module.exports = { 
    signup_get,
    signup_post,
    login_get,
    login_post,
    logout_get
}