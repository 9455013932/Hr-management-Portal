import { db } from "../utils/db.js"


const today = new Date()
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, '0');
const day = String(today.getDate()).padStart(2, '0');
const E_Date = `${year}-${month}-${day}`

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
  

export const GetCustomer=async(req,res)=>{
    try {
      const {AId}=req.params
        const sql=`WITH RECURSIVE CustomerChain AS (
    SELECT C_Id, Appliname, IntrodCode,Mobile
    FROM associate 
    WHERE C_Id = ? 

    UNION ALL

  
    SELECT c.C_Id, c.Appliname, c.IntrodCode, c.Mobile
    FROM associate c
    INNER JOIN CustomerChain cc ON  c.IntrodCode = cc.C_Id
)
SELECT * FROM CustomerChain`;
        const values=[AId];
        const result = await controllerFun(sql,values);

        if(result){
            return res.status(201).send({success:true,result})
        }
    } catch (error) {
        return res.status(500).send({ message:"error in the Getcustomer controller"})
    }
}