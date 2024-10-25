// import { closeSync } from "fs";
import { db } from "../utils/db.js";
export const authController = async (req, res) => {
  try {

    console.log('userId', req.userId)
    const sql = "select * from login where Id=?";
    db.query(sql, [req.userId], (err, result) => {
      if (err) {
        res.status(500).send({
          success: false,
          message: "Internal wrong",
          error: err,
        });
      }
      if (result) {
        res.status(200).send({
          success: true,
          message: "User Details",
          result,
        });
      }
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message,
    });
  }
};

// export const changeRouteController = async (req, res) => {
//   try {
//     const { uid, pass } = req.body
//     const fields = { uid, pass }
//     for (const [key, value] of Object.entries(fields)) {
//       if (!value) {
//         res.status(404).send({ error: `${key} is required` })
//       }
//     }
//     const sql = 'select * from crbranch where user=? and pass=?'
//     db.query(sql, [uid, pass], (err, result) => {
//       if (err) {
//         console.log('Internal server Eror', err.message)
//         res.status(502).send({
//           success: false,
//           message: 'Internal Sever Error'
//         })
//       }
//       res.status(200).send({
//         succes: true,
//         message: 'Present here',
//         result
//       })
//     })

//   } catch (error) {
//     console.log('Something wrong inside the changeRouteController', error.message)
//     res.status(500).send({
//       success: false,
//       message: 'Something wrong inside the changeRouteController'
//     })
//   }
// }