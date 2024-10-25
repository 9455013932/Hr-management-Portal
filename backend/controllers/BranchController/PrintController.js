import { db } from "../../utils/db.js";

export const getAssociateDataById = async (req, res) => {
    try {
        const { search } = req.body
        const sql = 'select * from  associate where C_Id=?'
        db.query(sql, [search], (err, result) => {
            if (err) {
                console.log(err.message)
                res.status(502).send({
                    success: false,
                    message: 'Internal Server Error'
                })
            }
            res.status(200).send({
                success: true,
                message: 'Access Successfully',
                result
            })
        })

    } catch (error) {
        console.log('Something wrong to inside the getAssociateDataById', error.message)
        res.status(500).send({
            success: false,
            message: 'Something wrong inside getAssociateDataById '
        })
    }
}