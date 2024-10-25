import { db } from '../../utils/db.js'
import path from 'path';
import fs, { unlink } from 'fs'
export const createBranchMemberController = async (req, res) => {
    // console.log(req.body)
    try {

        const { state, FormFee, user, MemberName, nationality, SupName, SO, MName, Mobile, gender, Category, JoinDate, DOB, PAN, branch, AccountNo, IFSC, Address, district, PinCode, NName, NAge, relation, NomAddr, branchCode } = req.body;
        const fields = { MemberName, user, SupName, nationality, SO, MName, Mobile, gender, Category, JoinDate, DOB, PAN, branch, AccountNo, IFSC, Address, district, PinCode, NName, NAge, relation, NomAddr, branchCode };

        for (const [key, value] of Object.entries(fields)) {
            if (!value) {
                return res.status(400).send({ error: `${key} is required` });
            }
        }

        const sql = 'SELECT M_Id FROM branchmember ORDER BY M_Id DESC LIMIT 1';
        const result = await memberController(sql);
        let newId = `${branchCode}000001`;

        if (result.length > 0) {
            const MID = result[0].M_Id;
            const lastId = parseInt(MID.slice(4, 10));
            newId = `${branchCode}${(lastId + 1).toString().padStart(6, '0')}`;
        }

        const insSql = `INSERT INTO branchmember (M_Id, BranchCode, nationality, state, FormFee, MemberName, SupName, SO, MName, Mobile, gender, Category, JoinDate, DOB, PAN, branch, AccountNo, IFSC, Address, district, PinCode, NName, NAge, relation, NomAddr, E_user) VALUES 
        (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
        const values = [newId, branchCode, nationality, state, FormFee, MemberName, SupName, SO, MName, Mobile, gender, Category, JoinDate, DOB, PAN, branch, AccountNo, IFSC, Address, district, PinCode, NName, NAge, relation, NomAddr, user];

        const insResult = await memberController(insSql, values);
        if (insResult) {
            return res.status(201).send({
                success: true,
                message: 'Inserted Successfully',
                result: insResult
            });
        }
    } catch (error) {
        console.log('Something went wrong inside createBranchMemberController', error.message);
        res.status(500).send({
            success: false,
            message: 'Something went wrong inside the createBranchMemberController'
        });
    }
};

// Promise function
const memberController = async (sql, values) => {
    return new Promise((resolve, reject) => {
        db.query(sql, values, (err, result) => {
            if (err) {
                return reject(err);
            }
            return resolve(result);
        });
    });
}

// access memeber data by member id
export const accessmemberData = async (req, res) => {
    try {
        const { value } = req.params
        if (!value) {
            res.status(400).send({ error: 'value is required' })
        }
        const sql = `select * from associate where C_Id like '%${value}%'`
        const result = await memberController(sql)
        if (result) {
            res.status(200).send({
                success: true,
                message: 'Access Successfully',
                result
            })
        }

    } catch (error) {
        console.log('Something went wrong inside accessmemberData', error.message);
        res.status(500).send({
            success: false,
            message: 'Something went wrong inside the accessmemberData'
        });
    }
}
// get all member for showing as table
export const getAllMemberController = async (req, res) => {
    try {
        const sql = 'select * from branchmember'
        const result = await memberController(sql)
        if (result) {
            res.status(200).send({
                success: true,
                message: 'Access SuccessFully',
                result
            })
        }
    } catch (error) {
        console.log('Something went wrong inside getAllMemberController', error.message);
        res.status(500).send({
            success: false,
            message: 'Something went wrong inside the getAllMemberController'
        });
    }
}


// update member
export const updateMemberController = async (req, res) => {
    try {
        const { Id } = req.params;
        const {
            state, FormFee, user, MemberName, nationality, SupName, SO,
            MName, Mobile, gender, Category, JoinDate, DOB, PAN, branch,
            AccountNo, IFSC, Address, district, PinCode, NName, NAge,
            relation, NomAddr, branchCode
        } = req.body;

        // Checking for missing fields
        const requiredFields = {
            state, FormFee, user, MemberName, nationality, SupName, SO,
            MName, Mobile, gender, Category, JoinDate, DOB, PAN, branch,
            AccountNo, IFSC, Address, district, PinCode, NName, NAge,
            relation, NomAddr, branchCode
        };

        for (const [key, value] of Object.entries(requiredFields)) {
            if (!value) {
                return res.status(400).send({ error: `${key} is required` });
            }
        }

        const sql = `
            UPDATE branchmember 
            SET 
                BranchCode=?, MemberName=?, nationality=?, So=?, state=?, SupName=?, 
                FormFee=?, MName=?, Mobile=?, gender=?, Category=?, JoinDate=?, DOB=?, 
                PAN=?, branch=?, AccountNo=?, IFSC=?, Address=?, district=?, PinCode=?, 
                NName=?, NAge=?, relation=?, NomAddr=?, M_User=? 
            WHERE Id=?
        `;

        const values = [
            branchCode, MemberName, nationality, SO, state, SupName, FormFee, MName,
            Mobile, gender, Category, JoinDate, DOB, PAN, branch, AccountNo, IFSC,
            Address, district, PinCode, NName, NAge, relation, NomAddr, user, Id
        ];

        const result = await memberController(sql, values);

        if (result.affectedRows > 0) {
            res.status(200).send({
                success: true,
                message: 'Update Successful',
                result
            });
        } else {
            res.status(404).send({
                success: false,
                message: 'Member not found'
            });
        }

    } catch (error) {
        console.error('Something went wrong inside updateMemberController', error.message);
        res.status(500).send({
            success: false,
            message: 'Something went wrong inside the updateMemberController'
        });
    }
};

// delete member
export const deleteMemberController = async (req, res) => {
    try {
        const { Id } = req.params;

        if (!Id) {
            return res.status(400).send({
                success: false,
                message: 'ID is required to delete a member'
            });
        }

        const sql = 'DELETE FROM branchmember WHERE Id=?';
        const values = [Id];
        const result = await memberController(sql, values);

        if (result.affectedRows > 0) {
            res.status(200).send({
                success: true,
                message: 'Member deleted successfully',
                result
            });
        } else {
            res.status(404).send({
                success: false,
                message: 'Member not found'
            });
        }
    } catch (error) {
        console.error('Something went wrong inside deleteMemberController', error.message);
        res.status(500).send({
            success: false,
            message: 'Something went wrong inside the deleteMemberController'
        });
    }
};
// access memer data
export const searchMemberData = async (req, res) => {
    try {
        const { value } = req.params
        if (!value) {
            res.status(400).send({ error: 'value is required' })
        }
        const sql = `select * from branchmember where M_Id like '%${value}%'`
        const result = await memberController(sql)
        if (result) {
            res.status(200).send({
                success: true,
                result
            })
        }
    } catch (error) {
        console.error('Something went wrong inside searchMemberData', error.message);
        res.status(500).send({
            success: false,
            message: 'Something went wrong inside the searchMemberData'
        });
    }
}
// for  suggestion to access member data 
export const accessmemberwiseData = async (req, res) => {
    try {
        const { value } = req.params
        if (!value) {
            res.status(400).send({ error: 'value is required' })
        }
        const sql = `SELECT * FROM branchmember WHERE M_Id LIKE '%${value}%' OR MemberName LIKE '%${value}%'`;

        const result = await memberController(sql)
        if (result) {
            res.status(200).send({
                success: true,
                result
            })
        }
    } catch (error) {
        console.error('Something went wrong inside accessmemberwiseData', error.message);
        res.status(500).send({
            success: false,
            message: 'Something went wrong inside the accessmemberwiseData'
        });
    }
}
// access member data by id
export const accessMemberDataById = async (req, res) => {
    try {
        const { accessmemberdata } = req.body
        if (!accessmemberdata) {
            res.status(400).send({ error: 'accessmemberdata is required' })
        }
        const sql = 'select * from branchmember where M_Id =?'
        const result = await memberController(sql, [accessmemberdata])
        if (result) {
            res.status(200).send({
                success: true,
                message: 'Successfully Accessed',
                result
            })
        }
    } catch (error) {
        console.error('Something went wrong inside accessMemberDataById', error.message);
        res.status(500).send({
            success: false,
            message: 'Something went wrong inside the accessMemberDataById'
        });
    }
}
// get plot price 
export const getPlotPrices = async (req, res) => {
    try {
        const { ProjectName } = req.body

        if (!ProjectName) {
            res.status(400).send({ error: 'ProjectSize is required' })
        }
        const sql = 'select * from crproject where projsite =?'
        const values = [ProjectName]

        const result = await memberController(sql, values)
        if (result) {
            res.status(200).send({
                success: true,
                message: 'Data accesss Successfully',
                result
            })
        }
    } catch (error) {
        console.error('Something went wrong inside getPlotPrices', error.message);
        res.status(500).send({
            success: false,
            message: 'Something went wrong inside the getPlotPrices'
        });
    }
}

// Expense Controller
export const getExpenseFromAdminController = async (req, res) => {
    try {
        const sql = 'SELECT * FROM crexpense'
        const result = await memberController(sql)
        if (result) {
            res.status(200).send({
                success: true,
                message: 'Data accessed successfully',
                result
            })
        } else {
            res.status(404).send({
                success: false,
                message: 'No expense data found'
            })
        }
    } catch (error) {
        console.error('Something went wrong inside getExpenseFromAdminController', error.message);
        res.status(500).send({
            success: false,
            message: 'Something went wrong inside the getExpenseFromAdminController'
        });
    }

}
// create expense constroller
export const createBranchExpenseController = async (req, res) => {
    try {
        const { user, Expense, Amount, Expense_Date, Status, P_Date, remark, P_Mode, PayDDN, PayDrawNo, ChequeBank, ChequeNo, ChequeHolder, ChequeBranch, ChequeIFSC, ChequeAmount, ChequeDate, TransBank, TransId, TransDate, TransAmount, TransType, TransHolderAC } = req.body
        const fields = { Expense, Amount, Expense_Date, Status, P_Date, remark }

        const file = req.file ? req.file.filename : ''
        // console.log(file.filename, file.orignalName)
        for (const [key, value] of Object.entries(fields)) {
            if (!value) {
                return res.status(400).send({ error: `${key} is required` });
            }
        }
        const sql = 'select E_Id from branchexpense order by E_Id desc limit 1'
        const result = await memberController(sql)

        let newId = '100001';
        if (result.length > 0) {
            const EID = result[0].E_Id;
            const lastId = parseInt(EID, 10);
            newId = lastId + 1;
        }

        const insSQL = `Insert into branchexpense (E_Id, Expense, Amount, Expense_Date, Status, P_Date,remark,P_Mode, PayDDN, PayDrawNo, ChequeBank, ChequeNo, ChequeHolder, ChequeBranch, ChequeIFSC, ChequeAmount, ChequeDate, TransBank, TransId, TransDate, TransAmount, TransType, TransHolderAC,Check_Img ,E_User)
                              values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`

        const values = [newId, Expense, Amount, Expense_Date, Status, P_Date, remark, P_Mode, PayDDN, PayDrawNo, ChequeBank, ChequeNo, ChequeHolder, ChequeBranch, ChequeIFSC, ChequeAmount, ChequeDate, TransBank, TransId, TransDate, TransAmount, TransType, TransHolderAC, file, user]
        const insResult = await memberController(insSQL, values)

        if (insResult.affectedRows > 0) {
            res.status(201).send({
                success: true,
                message: 'Expense created successfully',
                result: insResult
            })
        } else {
            res.status(400).send({
                success: false,
                message: 'Failed to create expense'
            })
        }
    } catch (error) {
        console.error('Something went wrong inside createBranchExpenseController', error.message);
        res.status(500).send({
            success: false,
            message: 'Something went wrong inside the createBranchExpenseController'
        });
    }
}
// get expense controller
export const getExpenseController = async (req, res) => {
    try {
        const sql = 'select * from branchexpense'
        const result = await memberController(sql)
        if (result) {
            res.status(200).send({
                success: true,
                message: 'Access Successfully',
                result
            })
        } else {
            res.status(400).send({
                success: false,
                message: 'Data not found',
            })
        }
    } catch (error) {
        console.error('Something went wrong inside getExpenseController', error.message);
        res.status(500).send({
            success: false,
            message: 'Something went wrong inside the getExpenseController'
        });
    }
}
// update branch expense
export const updateBranchExpenseController = async (req, res) => {
    try {
        const { Id } = req.params;
        const { user, Expense, Amount, Expense_Date, Status, P_Date, remark, P_Mode, images, PayDDN, PayDrawNo, ChequeBank, ChequeNo, ChequeHolder, ChequeBranch, ChequeIFSC, ChequeAmount, ChequeDate, TransBank, TransId, TransDate, TransAmount, TransType, TransHolderAC } = req.body;

        // Validate required fields
        const fields = { Expense, Amount, Expense_Date, Status, P_Date, remark };
        for (const [key, value] of Object.entries(fields)) {
            if (!value) {
                return res.status(400).send({ error: `${key} is required` });
            }
        }

        // Handle file upload
        const files = req.file ? req.file.filename : images;

        // Check if the record exists
        const sql = 'SELECT * FROM branchexpense WHERE Id = ?';
        const result = await memberController(sql, [Id]);

        if (result.length > 0) {
            const previousImage = result[0].Check_Img || 'Null';

            // Remove old image if exists and different
            if (previousImage && previousImage !== files) {
                const filePath = path.join("bonanza/expense", previousImage);
                fs.unlink(filePath, (unlinkErr) => {
                    if (unlinkErr) {
                        console.error('File unlink error:', unlinkErr);
                    }
                });
            }

            // Prepare SQL update query
            const insSql = `
                UPDATE branchexpense 
                SET Expense = ?, Amount = ?, Expense_Date = ?, Status = ?, P_Date = ?, remark = ?, P_Mode = ?, 
                    PayDDN = ?, PayDrawNo = ?, ChequeBank = ?, ChequeNo = ?, ChequeHolder = ?, 
                    ChequeBranch = ?, ChequeIFSC = ?, ChequeAmount = ?, ChequeDate = ?, 
                    TransBank = ?, TransId = ?, TransDate = ?, TransAmount = ?, TransType = ?, 
                    TransHolderAC = ?, Check_Img = ?, M_User = ? 
                WHERE Id = ?
            `;

            const values = [
                Expense, Amount, Expense_Date, Status, P_Date, remark, P_Mode, PayDDN, PayDrawNo, ChequeBank,
                ChequeNo, ChequeHolder, ChequeBranch, ChequeIFSC, ChequeAmount, ChequeDate, TransBank,
                TransId, TransDate, TransAmount, TransType, TransHolderAC, files, user, Id
            ];

            const insResult = await memberController(insSql, values);

            if (insResult.affectedRows > 0) {
                res.status(200).send({
                    success: true,
                    message: 'Updated Successfully',
                });
            } else {
                res.status(404).send({
                    success: false,
                    message: 'Unable to update',
                });
            }

        } else {
            res.status(404).send({
                success: false,
                message: 'Data not found',
            });
        }

    } catch (error) {
        console.error('Something went wrong inside updateBranchExpenseController', error.message);
        res.status(500).send({
            success: false,
            message: 'Something went wrong inside the updateBranchExpenseController',
        });
    }
};
// delete branch expense

export const deleteExpenseController = async (req, res) => {
    try {
        const { Id } = req.params;
        const sql = 'SELECT Check_Img FROM branchexpense WHERE Id = ?';
        const imgResult = await memberController(sql, [Id]);

        let imageDeleted = false;
        if (imgResult.length > 0) {
            const image = imgResult[0]?.Check_Img || '';
            const filePath = path.join("bonanza/expense", image);
            console.log(filePath)
            fs.access(filePath, fs.constants.F_OK, (accessErr) => {
                if (accessErr) {
                    console.warn('File not found:', filePath);
                } else {
                    fs.unlink(filePath, (unlinkErr) => {
                        if (unlinkErr) {
                            console.error('Error deleting file:', unlinkErr);
                        } else {
                            console.log('File deleted successfully:', filePath);
                            imageDeleted = true;
                        }
                    });
                }
            });
        }
        const delSql = 'DELETE FROM branchexpense WHERE Id = ?';
        const result = await memberController(delSql, [Id]);

        if (result.affectedRows > 0) {
            res.status(200).send({
                success: true,
                message: imageDeleted ? 'Data and image deleted successfully' : 'Data deleted, no image found',
            });
        } else {
            res.status(400).send({
                success: false,
                message: 'Data not found'
            });
        }
    } catch (error) {
        console.error('Something went wrong inside deleteExpenseController', error.message);
        res.status(500).send({
            success: false,
            message: 'Something went wrong inside the deleteExpenseController',
        });
    }
};

