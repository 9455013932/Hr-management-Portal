import { db } from "../utils/db.js";
import jwt from "jsonwebtoken";

export const loginController = async (req, res) => {
  try {
    const { uid, pass, detials, machineId } = req.body;

    if (!uid || !uid.trim())
      return res.status(400).send({ error: "uid is required" });
    if (!pass || !pass.trim())
      return res.status(400).send({ error: "pass is required" });

    const sql = "SELECT * FROM crbranch WHERE uid = ? AND pass = ? and status='0'";
    db.query(sql, [uid, pass], (err, result) => {
      if (err) {
        console.error(err.message);
        return res.status(500).send({
          success: false,
          message: "Internal server error",
          error: err.message,
        });
      }

      if (result.length > 0) {
        const user = result[0];
        const token = jwt.sign(
          { userId: user.Id, userUid: user.uid },
          process.env.Secret_Key,
          { expiresIn: '1h' }
        );
        console.log(token);
        res
          .cookie("token", token, {
            httpOnly: true,
            secure: true,
            maxAge: 60 * 60 * 1000,
          })
          .status(200)
          .send({
            success: true,
            message: "Successfully logged in",
            token,
            result,
          });
      } else {
        const fetchSql = "SELECT BId FROM crbranch ORDER BY BId DESC LIMIT 1";
        db.query(fetchSql, (fetchErr, fetchResult) => {
          if (fetchErr) {
            console.error(fetchErr.message);
            return res.status(500).send({
              success: false,
              message: "Internal server error",
              error: fetchErr.message,
            });
          }

          let newBId = "1001001";
          if (fetchResult.length > 0) {
            const BId = fetchResult[0].BId;
            const lastBId = parseInt(BId);
            newBId = `${(lastBId + 1)}`;
          }
          const sql = 'Insert into crbranch (BId,uid ,pass,system_details,machineId) values (?,?,?,?,?)'
          db.query(sql, [newBId, uid, pass, detials, machineId], (insErr, insResult) => {
            if (insErr) {
              console.error(insErr.message);
              return res.status(500).send({
                success: false,
                message: "Internal server error",
                error: insErr.message,
              });
            }
            res.status(201).send({ message: 'Inserted' })
          })
        })
      }
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({
      success: false,
      message: "Something went wrong in login controller",
      error: error.message,
    });
  }
};

// forget password controller
export const forgetPassController = async (req, res) => {
  try {
    const { uid, email } = req.body;
    if (!uid && uid.trim(""))
      return res.status(502).send({ error: "uid is required" });
    if (!email && email.trim(""))
      return res.status(502).send({ error: "pass is required" });
    const sql = "select * from login where uid=? and email=?";
    db.query(sql, [uid, email], (err, result) => {
      if (err) {
        res.status(404).send({
          success: false,
          message: "Inernal wrong",
          error: err.message,
        });
      }
      if (result) {
        res.status(200).send({
          success: false,
          message: "Check your email",
          result,
        });
      }
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something wrong to forget password controller",
      error: error.message,
    });
  }
};

// post api in database
export const apiController = async (req, res) => {
  try {
    const { api } = req.body;

    if (!api) {
      return res.status(400).send({ error: "api is required", api });
    }

    const sql = "INSERT INTO apitable (api) VALUES (?)";
    db.query(sql, [api], (err, result) => {
      if (err) {
        return res.status(500).send({
          success: false,
          message: "Internal server error",
          error: err.message,
        });
      }

      res.status(200).send({
        success: true,
        message: "API inserted successfully",
        result,
      });
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something went wrong in the API controller",
      error: error.message,
    });
  }
};

// delete user/admin login
export const deleteUserController = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).send({
      success: true,
      message: "Successfully logged out",
      data: [],
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something went wrong in deleteuser controller",
      error: error.message,
    });
  }
};
