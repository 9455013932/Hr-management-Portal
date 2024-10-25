
import { db } from "../utils/db.js";

export const createUserController = async (req, res) => {
    try {
        const { Password, mobile, email, Name, BCode, UserType, user } = req.body;
        const fields = { Password, mobile, email, Name, BCode, UserType, user };

        for (const [key, value] of Object.entries(fields)) {
            if (!value || value === '') {
                return res.status(400).send({ error: `${key} is required` });
            }
        }

        const sql = 'SELECT * FROM usertable WHERE email = ? AND branchCode = ?';
        const result = await controllerFun(sql, [email, BCode]);

        if (result.length > 0) {
            return res.status(200).send({
                success: true,
                message: 'Already Present'
            });
        }

        const fetchId = 'SELECT U_Id FROM usertable ORDER BY U_Id DESC LIMIT 1';
        const fetchResult = await controllerFun(fetchId);

        let U_Id = 'UID00001';
        if (fetchResult.length > 0) {
            const UID = fetchResult[0].U_Id;
            const lastId = parseInt(UID.slice(3), 10);
            U_Id = `UID${(lastId + 1).toString().padStart(5, '0')}`;
        }

        const insSql = 'INSERT INTO usertable (U_Id, password, email, name, branchCode, Mobile,userType, E_user) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        const insValues = [U_Id, Password, email, Name, BCode, mobile, UserType, user];
        const insResult = await controllerFun(insSql, insValues);

        if (insResult) {
            return res.status(201).send({
                success: true,
                message: 'Inserted Successfully'
            });
        }

    } catch (error) {
        console.log(error.message);
        res.status(500).send({
            success: false,
            message: 'Something went wrong inside createUserController'
        });
    }
};

// get User details
export const getUserDetailsController = async (req, res) => {
    try {
        const sql = 'Select * from usertable'
        const result = await controllerFun(sql)
        if (result) {
            console.log('Access User Data')
            res.status(200).send({
                success: true,
                message: 'Access SuccessFully',
                result
            })
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).send({
            success: false,
            message: 'Something went wrong inside getUserDetailsController'
        });
    }
}
// update user details
export const updateUserDetailsController = async (req, res) => {
    try {
        const { Id } = req.params
        const { Password, mobile, email, Name, BCode, UserType, user } = req.body
        const fields = { Password, mobile, email, Name, BCode, UserType, user };

        for (const [key, value] of Object.entries(fields)) {
            if (!value || value === '') {
                return res.status(400).send({ error: `${key} is required` });
            }
        }
        const sql = 'update usertable set password=?, email=?, name=?, branchCode=?, Mobile=?,userType=?,M_User=? where Id=?'
        const values = [Password, email, Name, BCode, mobile, UserType, user, Id]
        const result = await controllerFun(sql, values)
        if (result) {
            res.status(200).send({
                success: true,
                message: 'Update Successfully'
            })
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).send({
            success: false,
            message: 'Something went wrong inside updateUserDetailsController'
        });
    }
}

const controllerFun = async (sql, values) => {
    return await new Promise((resolve, reject) => {
        db.query(sql, values, (err, result) => {
            if (err) {
                console.error('SQL Error:', err);
                reject(err);
            }
            resolve(result);
        });
    });
};

// find daata
export const findDataController = async (req, res) => {
    try {
        const { value } = req.params
        if (!value) {
            res.status(404).send({ error: 'value is required' })
        }
        const sql = `SELECT * FROM usertable WHERE U_Id like '%${value}%' `
        const result = await controllerFun(sql)
        if (result) {
            res.status(200).send({
                success: true,
                message: 'Access data',
                result
            })
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).send({
            success: false,
            message: 'Something went wrong inside findDataController'
        });
    }
}
// delete user Data Controller
export const deleteUserDataController = async (req, res) => {
    try {
        const { Id } = req.params
        const sql = `DELETE FROM usertable WHERE Id = ?`
        const values = [Id]
        const result = await controllerFun(sql, values)
        if (result) {
            res.status(200).send({
                success: true,
                message: 'Delete Successfully'
            })
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).send({
            success: false,
            message: 'Something went wrong inside deleteUserDataController'
        });
    }
}

// block user Controller
export const userStatusController = async (req, res) => {
    try {
        const { Id } = req.params
        const { status } = req.body
        if (!status) {
            res.status(404).send({ error: 'status is required' })
        }
        const sql = `update usertable set status=? where Id=? `
        const result = await controllerFun(sql, [status, Id])
        if (result) {
            res.status(200).send({
                success: true,
                message: 'block user successfully'
            })
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).send({
            success: false,
            message: 'Something went wrong inside userStatusController'
        });
    }
}