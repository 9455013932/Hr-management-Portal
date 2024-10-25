
import { db } from "../utils/db.js";
import path, { parse } from "path";
import fs, { unlink } from 'fs'
import { error } from "console";
// create branch controller
export const createBranchController = async (req, res) => {
  try {
    const { BName, BPrefix, uid, BAddress, pass, Bdistrict, BMNo, user, status, userType } =
      req.body;
    if (!BName) return res.status(502).send({ error: "BName is required" });
    if (!BPrefix) return res.status(502).send({ error: "BPrefix is required" });
    if (!uid) return res.status(502).send({ error: "uid is required" });
    if (!pass) return res.status(502).send({ error: "pass is required" });
    if (!BAddress)
      return res.status(502).send({ error: "BAddress is required" });
    if (!Bdistrict)
      return res.status(502).send({ error: "Bdistrict is required" });
    if (!BMNo) return res.status(502).send({ error: "BMNo is required" });
    if (!userType) return res.status(502).send({ error: "userType is required" });
    if (!user) return res.status(502).send({ error: "user is required" });
    if (!status) return res.status(502).send({ error: "status is required" });

    const sql = "SELECT * FROM crbranch WHERE Name=? AND uid=? AND pass=?";
    const values = [BName, uid, BMNo, pass];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error(err.message);
        return res.status(500).send({
          success: false,
          message: "Internal server error",
          error: err.message,
        });
      }

      if (result.length > 0) {
        return res.status(200).send({
          success: true,
          message: "Branch already present",
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

          const insertSql = `
            INSERT INTO crbranch (BId,userType, Name, BPrefix, pass, uid, BAddress, Bdistrict, Mobile, user, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)
          `;
          const insertValues = [
            newBId,
            userType,
            BName,
            BPrefix,
            pass,
            uid,
            BAddress,
            Bdistrict,
            BMNo,
            user,
            status,
          ];

          db.query(insertSql, insertValues, (inErr, inResult) => {
            if (inErr) {
              console.error(inErr.message);
              return res.status(500).send({
                success: false,
                message: "Internal server error",
                error: inErr.message,
              });
            }

            return res.status(201).send({
              success: true,
              message: "Branch created successfully",
              result: inResult,
            });
          });
        });
      }
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// get all branch controller
export const getBranchController = async (req, res) => {
  try {
    const sql = "SELECT * from crbranch where userType='Branch'";
    db.query(sql, (err, result) => {
      if (err) {
        console.error(err.message);
        res.status(404).send({
          success: false,
          message: "Inernal wrong",
          error: err.message,
        });
      }
      res.status(200).send({
        success: true,
        message: "",
        result,
      });
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something wrong in get all Branch Controller",
      error: error.message,
    });
  }
};
// update branch controller
export const updateBranchController = async (req, res) => {
  try {
    const { Id } = req.params;
    const { BName, BPrefix, uid, BAddress, Bdistrict, BMNo, status } =
      req.body;
    if (!Id) return res.status(502).send({ error: "Id is required" });
    if (!BName) return res.status(502).send({ error: "BName is required" });
    if (!BPrefix) return res.status(502).send({ error: "BPrefix is required" });
    if (!uid) return res.status(502).send({ error: "uid is required" });
    if (!BAddress)
      return res.status(502).send({ error: "BAddress is required" });
    if (!Bdistrict)
      return res.status(502).send({ error: "Bdistrict is required" });
    if (!BMNo) return res.status(502).send({ error: "BMNo is required" });
    if (!status) return res.status(502).send({ error: "status is required" });
    const values = [
      BName,
      BPrefix,
      uid,
      BAddress,
      Bdistrict,
      BMNo,
      status,
      Id,
    ];
    const sql =
      "Update crbranch set Name=?,BPrefix=?,uid=?,BAddress=?,Bdistrict=?,Mobile=?,status=? where Id=?";
    db.query(sql, values, (err, result) => {
      if (err) {
        console.error(err.message);
        res.status(404).send({
          success: false,
          message: "Inernal wrong",
          error: err.message,
        });
      }
      res.status(200).send({
        success: true,
        message: "Successfully Update Branch",
        result,
      });
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something wrong in Update Branch Controller",
      error: error.message,
    });
  }
};
// delete branch controller
export const deleteBranchController = async (req, res) => {
  try {
    const { Id } = req.params;

    // Validate input
    if (!Id) return res.status(400).send({ error: "Id is required" });

    const sql = "DELETE FROM crbranch WHERE Id = ?";

    db.query(sql, [Id], (err, result) => {
      if (err) {
        console.error(err.message);
        return res.status(500).send({
          success: false,
          message: "Internal server error",
          error: err.message,
        });
      }
      if (result.affectedRows === 0) {
        return res.status(404).send({
          success: false,
          message: "Branch not found",
        });
      }
      res.status(200).send({
        success: true,
        message: "Successfully deleted branch",
        result,
      });
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something went wrong in deleteBranchController",
      error: error.message,
    });
  }
};


// Create HR Controller ===========================
export const createHRController = async (req, res) => {
  try {
    const { HRName, HRId, email, HRAddress, DoJ, HRMNo, pass, userType, user } = req.body;

    const requiredFields = { HRName, HRId, email, HRAddress, DoJ, HRMNo, pass, userType };
    for (const [field, value] of Object.entries(requiredFields)) {
      if (!value) {
        return res.status(400).send({ error: `${field} is required` });
      }
    }

    const checkHRSql = "SELECT * FROM crhr WHERE HR_ID = ? OR email = ? OR HRMNo = ?";
    const checkHRValues = [HRId, email, HRMNo];

    db.query(checkHRSql, checkHRValues, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send({
          success: false,
          message: "Internal server error",
          error: err.message,
        });
      }

      if (result.length > 0) {
        return res.status(409).send({
          success: false,
          message: "HR already exists",
          result,
        });
      } else {
        const insertHRSql = "INSERT INTO crhr (HRName, HR_ID, email, HRAddress, HRMNo, DoJ,E_User) VALUES (?, ?, ?, ?, ?, ?,?)";
        const insertHRValues = [HRName, HRId, email, HRAddress, HRMNo, DoJ, user];

        db.query(insertHRSql, insertHRValues, (err, hrResult) => {
          if (err) {
            console.error(err);
            return res.status(500).send({
              success: false,
              message: "Internal server error",
              error: err.message,
            });
          }

          const insertUserSql = 'INSERT INTO crbranch (uid,Name,Mobile, pass, userType,user) VALUES (?, ?, ?,?,?,?)';
          const insertUserValues = [HRId, HRName, HRMNo, pass, userType, user];

          db.query(insertUserSql, insertUserValues, (err, userResult) => {
            if (err) {
              console.error(err);
              return res.status(500).send({
                success: false,
                message: "Internal server error",
                error: err.message,
              });
            }

            res.status(201).send({
              success: true,
              message: "Successfully Created HR",
              hrResult,
              userResult,
            });
          });
        });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong in createHRController",
      error: error.message,
    });
  }
};

// get alll hr
export const getHRController = async (req, res) => {
  try {
    const sql = "SELECT * from crhr";
    db.query(sql, (err, result) => {
      if (err) {
        console.error(err.message);
        res.status(404).send({
          success: false,
          message: "Inernal wrong",
          error: err.message,
        });
      }
      res.status(200).send({
        success: true,
        message: "",
        result,
      });
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({
      success: false,
      message: "Something wrong in get all HR Controller",
      error: error.message,
    });
  }
};
// update HR                                       Here problem occur during date updation
export const updateHRController = async (req, res) => {
  try {
    const { Id } = req.params;
    const { HRName, HRId, email, HRAddress, DoJ, HRMNo } = req.body;

    if (!HRName || !HRId || !email || !HRAddress || !DoJ || !HRMNo || !Id) {
      return res.status(400).send({
        error: "All fields are required",
      });
    }

    const values = [HRName, HRId, email, HRAddress, DoJ, HRMNo, Id];
    const sql =
      "UPDATE crhr SET HRName=?, HR_ID=?, email=?, HRAddress=?, DoJ=?, HRMNo=? WHERE Id=?";

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error(err.message);
        return res.status(500).send({
          success: false,
          message: "Internal server error",
          error: err.message,
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).send({
          success: false,
          message: "HR not found",
        });
      }
      res.status(200).send({
        success: true,
        message: "Successfully updated HR",
        result,
      });
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something went wrong in Update HR Controller",
      error: error.message,
    });
  }
};
// delete hr controller
export const deleteHRController = async (req, res) => {
  try {
    const { Id } = req.params;
    const sql = "delete from crhr where Id=?";
    db.query(sql, [Id], (err, result) => {
      if (err) {
        console.error(err.message);
        return res.status(500).send({
          success: false,
          message: "Internal server error",
          error: err.message,
        });
      }
      res.status(200).send({
        success: true,
        message: "Hr Deleted Successfully",
        result,
      });
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something went wrong in delete HR Controller",
      error: error.message,
    });
  }
};

// Project Controller start============
export const creatProjectController = async (req, res) => {
  try {
    const { PSName, PNPre, SPNo, EPNo, PArea, PPrice, SPG, user, term } = req.body;

    if (
      !PSName ||
      !PNPre ||
      !SPNo ||
      !EPNo ||
      !PArea ||
      !PPrice ||
      !SPG ||
      !user,
      !term
    ) {
      return res.status(400).send({
        error: "All fields are required",
      });
    }

    const checkSql = "SELECT * FROM crproject WHERE projsite=?";
    const checkValues = [PSName];
    db.query(checkSql, checkValues, (err, result) => {
      if (err) {
        console.error("Error checking project:", err.message);
        return res.status(500).send({
          success: false,
          message: "Internal error while checking project",
          error: err.message,
        });
      }

      if (result.length > 0) {
        return res.status(200).send({
          success: true,
          message: "Project already registered in the database",
          result,
        });
      } else {
        const fetchSql =
          "SELECT P_Id FROM crproject ORDER BY P_Id DESC LIMIT 1";
        db.query(fetchSql, (fetchErr, fetchResult) => {
          if (fetchErr) {
            console.error("Error fetching latest P_Id:", fetchErr.message);
            return res.status(500).send({
              success: false,
              message: "Internal error while fetching latest P_Id",
              error: fetchErr.message,
            });
          }

          let newPId = "PId101";
          if (fetchResult.length > 0) {
            const lastPId = fetchResult[0].P_Id;
            const numPart = parseInt(lastPId.slice(3));
            newPId = `PId${numPart + 1}`;
          }

          const insertSql =
            "INSERT INTO crproject (P_Id, projsite, proprefix, startpro, endpro, proarea, proprice, sitegrade, euser,`Term(yr)`) VALUES (?, ?, ?, ?, ?,?, ?, ?, ?, ?)";
          const insertValues = [
            newPId,
            PSName,
            PNPre,
            SPNo,
            EPNo,
            PArea,
            PPrice,
            SPG,
            user,
            term
          ];
          db.query(insertSql, insertValues, (insertErr, insertResult) => {
            if (insertErr) {
              console.error("Error inserting new project:", insertErr.message);
              return res.status(500).send({
                success: false,
                message: "Internal error while inserting new project",
                error: insertErr.message,
              });
            }

            const comSql =
              "INSERT INTO projectcomm (P_Id, cader, salary, commission, target) SELECT ?, cader, salary, commission, target FROM crrank";
            db.query(comSql, [newPId], (comErr, comResult) => {
              if (comErr) {
                console.error("Error inserting project comm:", comErr.message);
                return res.status(500).send({
                  success: false,
                  message: "Internal error while inserting project comm",
                  error: comErr.message,
                });
              }

              return res.status(201).send({
                success: true,
                message: "Successfully created project",
                result: comResult,
              });
            });
          });
        });
      }
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Something went wrong in createProjectController",
      error: error.message,
    });
  }
};

// get project
export const getProjectController = async (req, res) => {
  try {
    const sql = "Select * from crproject";
    db.query(sql, (err, result) => {
      if (err) {
        console.error(err.message);
        res.status(404).send({
          success: false,
          message: "Inernal wrong",
          error: err.message,
        });
      }

      res.status(200).send({
        success: true,
        message: "Get Successfully",
        result,
      });
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something went wrong in create Project Controller",
      error: error.message,
    });
  }
};
// update project
export const updateProjectController = async (req, res) => {
  try {
    const { Id } = req.params;
    const { PSName, PNPre, SPNo, EPNo, PArea, PPrice, SPG, user, term } = req.body;
    if (!PSName) return res.status(502).send({ error: "PSName is required" });
    if (!SPNo) return res.status(502).send({ error: "SPNo is required" });
    if (!PArea) return res.status(502).send({ error: "PArea is required" });
    if (!PNPre) return res.status(502).send({ error: "PNPre is required" });
    if (!user) return res.status(502).send({ error: "user is required" });
    if (!EPNo) return res.status(502).send({ error: "EPNo is required" });
    if (!PPrice) return res.status(502).send({ error: "PPrice is required" });
    if (!SPG) return res.status(502).send({ error: "SPG is required" });
    if (!term) return res.status(502).send({ error: "term is required" });
    const sql =
      "update crproject set projsite=?,proprefix=?,startpro=?,endpro=?,proarea=? ,proarea=? ,sitegrade=?,moduser=? ,Term(yr)=? where Id=?";
    db.query(
      sql,
      [PSName, PNPre, SPNo, EPNo, PArea, PPrice, SPG, user, term, Id],
      (err, result) => {
        if (err) {
          console.error(err.message);
          res.status(404).send({
            success: false,
            message: "Inernal wrong",
            error: err.message,
          });
        }
        if (result.affectedRows === 0) {
          return res.status(404).send({
            success: false,
            message: "Project not found",
          });
        }
        res.status(200).send({
          success: true,
          message: "Successfully updated Project",
          result,
        });
      }
    );
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something went wrong in update Project Controller",
      error: error.message,
    });
  }
};
// delete project
export const deleteProjectController = async (req, res) => {
  try {
    const { Id } = req.params;
    const sql = "delete from crproject where Id=?";
    db.query(sql, [Id], (err, result) => {
      if (err) {
        console.error(err.message);
        res.status(404).send({
          success: false,
          message: "Inernal wrong",
          error: err.message,
        });
      }
      if (result.affectedRows === 0) {
        return res.status(404).send({
          success: false,
          message: "projec not found",
        });
      }
      res.status(200).send({
        success: true,
        message: "Successfully Deleted",
        result,
      });
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something went wrong in delete Project Controller",
      error: error.message,
    });
  }
};
// get grade inside the project
export const accessGradeController = async (req, res) => {
  try {
    const sql = "select * from crgrade";
    db.query(sql, (err, result) => {
      if (err) {
        console.error(err.message);
        res.status(404).send({
          success: false,
          message: "Inernal server error",
          error: err.message,
        });
      }
      res.status(200).send({
        success: true,
        message: "Access Successfully",
        result,
      });
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something went wrong in access grade Controller",
      error: error.message,
    });
  }
};

// Rank Controller start =========
// create rank

export const rankController = async (req, res) => {
  try {
    const { cader, target, commission, salary } = req.body;

    // Validate required fields
    const requiredFields = { cader, target, commission, salary };
    for (const [field, value] of Object.entries(requiredFields)) {
      if (!value) {
        return res
          .status(400)
          .send({ success: false, error: `${field} is required` });
      }
    }
    const existingRank = await queryDatabase(
      "SELECT * FROM crrank WHERE cader=?",
      [cader]
    );

    if (existingRank.length > 0) {
      return res.status(200).send({
        success: true,
        message: "Rank Already Present",
        result: existingRank,
      });
    }
    // Insert new rank
    const RID = "RID101";

    await queryDatabase(
      "INSERT INTO crrank (R_Id, cader, target, commission, salary) VALUES (?,?,?,?,?)",
      [RID, cader, target, commission, salary]
    );
    res.status(201).send({
      success: true,
      message: "Successfully Created Rank",
    });
  } catch (error) {
    console.error("Error in rankController:", error);
    res.status(500).send({
      success: false,
      message: "Something went wrong in Create Rank Controller",
      error: error.message,
    });
  }
};

// Helper function to promisify database queries
function queryDatabase(sql, values) {
  return new Promise((resolve, reject) => {
    db.query(sql, values, (error, results) => {
      if (error) reject(error);
      else resolve(results);
    });
  });
}

// get rank controller
export const getRankController = async (req, res) => {
  try {
    const sql = "SELECT * from crrank ";
    // const sql='select * from crrank'
    db.query(sql, (err, result) => {
      if (err) {
        console.error(err.message);
        res.status(404).send({
          success: false,
          message: "Inernal wrong",
          error: err.message,
        });
      }

      res.status(200).send({
        success: true,
        message: "Get Successfully",
        result,
      });
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something went wrong in get Rank Controller",
      error: error.message,
    });
  }
};
//  update rank controller
export const updateRankController = async (req, res) => {
  try {
    const { Id } = req.params;
    const { cader, target, commission, salary } = req.body;
    if (!cader) return res.status(502).send({ error: "cader is required" });
    if (!target) return res.status(502).send({ error: "target is required" });

    if (!commission)
      return res.status(502).send({ error: "commission is required" });
    if (!salary) return res.status(502).send({ error: "salary is required" });
    const sql =
      "update crrank set cader=?,target=?,commission=?,salary=? where ID=?";
    db.query(sql, [cader, target, commission, salary, Id], (err, result) => {
      if (err) {
        console.error(err.message);
        res.status(404).send({
          success: false,
          message: "Inernal wrong",
          error: err.message,
        });
      }
      if (result.affectedRows === 0) {
        return res.status(404).send({
          success: false,
          message: "Rank not found",
        });
      }
      res.status(200).send({
        success: true,
        message: "Successfully updated Rank",
        result,
      });
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something went wrong in update Rank Controller",
      error: error.message,
    });
  }
};
// delete Rank
export const deleteRankController = async (req, res) => {
  try {
    const { Id } = req.params;
    const sql = "DELETE FROM crrank WHERE ID = ?";
    db.query(sql, [Id], (err, result) => {
      if (err) {
        console.error(err.message);
        res.status(404).send({
          success: false,
          message: "Inernal wrong",
          error: err.message,
        });
      }
      if (result.affectedRows === 0) {
        return res.status(404).send({
          success: false,
          message: "Rank not found",
        });
      }
      res.status(200).send({
        success: true,
        message: "Successfully Deleted",
        result,
      });
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something went wrong in delete Rank Controller",
      error: error.message,
    });
  }
};
// access project in rank
// export const accessProjectController = async (req, res) => {
//   try {
//     const sql = "Select * from crproject";
//     db.query(sql, (err, result) => {
//       if (err) {
//         console.error(err.message);
//         res.status(404).send({
//           success: false,
//           message: "Inernal server error",
//           error: err.message,
//         });
//       }
//       res.status(200).send({
//         success: true,
//         message: "Access Successfully",
//         result,
//       });
//     });
//   } catch (error) {
//     res.status(500).send({
//       success: false,
//       message: "Something went wrong in access project in rank Controller",
//       error: error.message,
//     });
//   }
// };

// Grade controller start
// create grade
export const createGradeController = async (req, res) => {
  try {
    const { Grade, GPer, user } = req.body;
    if (!Grade || !GPer || !user) {
      res.status(400).send({
        error: "All field is required",
      });
    }
    const sql = "SELECT * from crgrade where grade=? and grade_per=?";
    db.query(sql, [Grade, GPer], (err, result) => {
      if (err) {
        console.error(err.message);
        return res.status(404).send({
          success: false,
          message: "Internal error",
          error: err.message,
        });
      }
      if (result.length > 0) {
        return res.status(200).send({
          success: true,
          message: "Grade already registered",
          result,
        });
      } else {
        const sql =
          "Insert into crgrade (grade,grade_per,E_user) values (?,?,?)";
        const values = [Grade, GPer, user];
        db.query(sql, values, (err, result) => {
          if (err) {
            console.error(err.message);
            res.status(404).send({
              success: false,
              message: "Inernal wrong",
              error: err.message,
            });
          }
          res.status(201).send({
            success: true,
            message: "Successfully Insert Grade",
            result,
          });
        });
      }
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something went wrong in create grade Controller",
      error: error.message,
    });
  }
};
// get grade
export const getGradeController = async (req, res) => {
  try {
    const sql = "select * from crgrade";
    db.query(sql, (err, result) => {
      if (err) {
        console.error(err.message);
        return res.status(404).send({
          success: false,
          message: "Internal error",
          error: err.message,
        });
      }
      res.status(200).send({
        success: true,
        message: "Successfully access",
        result,
      });
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something went wrong in get grade Controller",
      error: error.message,
    });
  }
};
// upgrade/update/edit/update grade
export const updateGradeController = async (req, res) => {
  try {
    const { Id } = req.params;
    const { Grade, GPer, user, date } = req.body;
    if (!Grade || !GPer || !user || !date) {
      return res.status(400).send({
        success: false,
        message: "All fields are required",
      });
    }
    const sql =
      "UPDATE crgrade SET grade=?, grade_per=?, updated_at=?, m_user=? WHERE Id=?";
    const values = [Grade, GPer, date, user, Id];
    db.query(sql, values, (err, result) => {
      if (err) {
        console.error("Database error:", err.message);
        return res.status(500).send({
          success: false,
          message: "Internal server error",
          error: err.message,
        });
      }
      res.status(200).send({
        success: true,
        message: "Grade updated successfully",
        result,
      });
    });
  } catch (error) {
    console.error("Controller error:", error.message);
    res.status(500).send({
      success: false,
      message: "Something went wrong in update grade controller",
      error: error.message,
    });
  }
};



// Bonanza controller Start====
export const createBonanzaController = async (req, res) => {
  try {
    const { BItem, BDesc, EDate, SDate, user } = req.body;
    // Validate required fields
    if (!BDesc) return res.status(502).send({ error: "BDesc is required" });
    if (!BItem) return res.status(502).send({ error: "BItem is required" });
    if (!user) return res.status(502).send({ error: "user is required" });
    if (!EDate) return res.status(502).send({ error: "EDate is required" });
    if (!SDate) return res.status(502).send({ error: "SDate is required" });

    const image = req.file ? req.file.filename : null
    if (!image) return res.status(502).send({ error: "image is required" });
    const sql =
      "SELECT * FROM crbonanza WHERE BItem = ? AND BDesc = ? AND SDate = ? AND EDate = ? and BPic=?";
    const values = [BItem, BDesc, SDate, EDate, image];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error(err.message);
        return res.status(404).send({
          success: false,
          message: "Internal error",
          error: err.message,
        });
      }

      if (result.length > 0) {
        return res.status(200).send({
          success: true,
          message: "Bonanza already registered in the database",
          result,
        });
      } else {
        const fetchSql =
          "Select B_Id from crbonanza  order by B_Id desc limit 1";
        db.query(fetchSql, (fetchErr, fetchResult) => {
          if (fetchErr) {
            console.error(fetchErr.message);
            return res.status(404).send({
              success: false,
              message: "Internal error in B_Id",
              error: fetchErr.message,
            });
          }
          let newBId = "BId101";
          if (fetchResult.length > 0) {
            const BId = fetchResult[0].B_Id;
            const lastBId = parseInt(BId.slice(3));
            newBId = `BId${lastBId + 1}`;
          }
          const sql =
            "INSERT INTO crbonanza (B_Id, BItem, BDesc, EDate, SDate, Euser, BPic) VALUES (?, ?, ?, DATE_FORMAT(?, '%Y-%m-%d'), DATE_FORMAT(?, '%Y-%m-%d'), ?, ?)";
          const values = [newBId, BItem, BDesc, EDate, SDate, user, image];
          db.query(sql, values, (err, result) => {
            if (err) {
              res.status(404).send({
                success: false,
                message: "Internal error when fetching B_Id",
                error: err.message,
              });
            }
            res.status(200).send({
              success: true,
              message: "Successfully insert",
              result,
            });
          });
        });
      }
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something went wrong in create Bonanza Controller",
      error: error.message,
    });
  }
};
// upload image controller
export const imageUploadController = async (req, res) => {
  try {
    const imageName = req.file.originalname;
    const imagePath = path.join("bonanza", imageName);
    const sql = "SELECT * FROM images WHERE name = ? AND path = ?";
    const values = [imageName, imagePath];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error("Database query error:", err);
        return res.status(500).send({
          success: false,
          message: "Internal server error",
          error: err.message,
        });
      }

      if (result.length > 0) {
        return res.status(200).send({
          success: true,
          message: "Image already exists. Please change the image name.",
          result,
        });
      }

      const insertQuery = "INSERT INTO images (name, path) VALUES (?, ?)";
      db.query(insertQuery, values, (insertErr, insertResult) => {
        if (insertErr) {
          console.error("Image insertion error:", insertErr);
          return res.status(500).send({
            success: false,
            message: "Failed to upload image",
            error: insertErr.message,
          });
        }

        res.status(201).send({
          success: true,
          message: "File uploaded successfully",
          data: {
            id: insertResult.insertId,
            name: imageName,
            path: imagePath,
          },
        });
      });
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).send({
      success: false,
      message: "An unexpected error occurred",
      error: error.message,
    });
  }
};
// get bonanaza controller
export const getBonanzaController = async (req, res) => {
  try {
    const sql =
      "select images.*, crbonanza.* from crbonanza left join images on images.name = crbonanza.BPic";
    db.query(sql, (err, result) => {
      if (err) {
        console.error("Database error:", err.message);
        return res.status(500).send({
          success: false,
          message: "Internal server error",
          error: err.message,
        });
      }
      res.status(200).send({
        success: true,
        message: "Bonanza access successfully",
        result,
      });
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something went wrong in get Bonanza Controller",
      error: error.message,
    });
  }
};
// delete controller
export const getDeleteController = async (req, res) => {
  try {
    const { BPic, Id } = req.params;
    const fildPath = path.join('bonanza', BPic)

    fs.access(fildPath, fs.constants.F_OK, (accressErr) => {
      if (accressErr) {
        console.log('File path not found', fildPath)
        return res.status(404).send('File not find')
      }
      fs.unlink(fildPath, (unlinkErr) => {
        if (unlinkErr) {
          console.log('File deleted from directory', unlinkErr)
          return res.status(500).send({ message: 'Error deleting file', error: unlinkErr });
        }
      })
    })
    const sql = "DELETE FROM crbonanza WHERE Id = ?";
    db.query(sql, [Id], (err, result) => {
      if (err) {
        console.error(err.message);
        return res.status(500).send({
          success: false,
          message: "Transaction error",
          error: err.message,
        });
      }
      res.status(200).send({
        success: true,
        message: "Bonanza deleted successfully",
        result,
      });
    });


  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something went wrong in delete Bonanza Controller",
      error: error.message,
    });
  }
};
// update bonanza controller
export const updateBonanzaController = async (req, res) => {
  try {
    const { Id } = req.params;
    const { BItem, BDesc, EDate, SDate, user, BPic } = req.body;
    if (!BItem || !BDesc || !EDate || !SDate || !user) {
      return res.status(400).send({ error: "All fields are required" });
    }
    const Image = req.file ? req.file.filename : BPic
    const previousImageSql = "SELECT BPic FROM crbonanza WHERE Id = ?";
    db.query(previousImageSql, [Id], (err, result) => {
      if (err) {
        console.error(err.message);
        return res.status(500).send({
          success: false,
          message: "Internal Server error",
          error: err.message,
        });
      }
      const previousImage = result[0] ? result[0].BPic : null;
      if (previousImage && previousImage !== Image) {
        const previousImagePath = path.join('bonanza', previousImage);
        fs.unlink(previousImagePath, (err) => {
          if (err) {
            console.error("Error deleting previous image:", err);
          }
        });
      }
    });
    const sql =
      "UPDATE crbonanza SET BItem=?, BDesc=?, EDate=?, SDate=?, M_User=?, BPic=? WHERE Id=?";
    const values = [BItem, BDesc, EDate, SDate, user, Image, Id];
    db.query(sql, values, (err, result) => {
      if (err) {
        console.error(err.message);
        return res.status(500).send({
          success: false,
          message: "Internal Server error",
          error: err.message,
        });
      }
      if (result.affectedRows === 0) {
        return res.status(404).send({
          success: false,
          message: "Bonanza not found or no changes made",
        });
      }
      res.status(200).send({
        success: true,
        message: "Bonanza updated Successfully",
        result,
      });
    });

  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something went wrong in update Bonanza Controller",
      error: error.message,
    });
  }
};


// Advance Commission Start=====
// create advance
export const createAdvanceController = async (req, res) => {
  try {
    const { Excode, AdAmount, Paydate, PMode, UTRDate, UTRNo, user } = req.body;
    if (!Excode) return res.status(502).send({ error: "Excode is required" });
    if (!AdAmount)
      return res.status(502).send({ error: "AdAmount is required" });
    if (!Paydate) return res.status(502).send({ error: "Paydate is required" });
    if (!user) return res.status(502).send({ error: "user is required" });
    if (!PMode) return res.status(502).send({ error: "PMode is required" });
    if (!UTRDate) return res.status(502).send({ error: "UTRDate is required" });
    if (!UTRNo) return res.status(502).send({ error: "UTRNo is required" });
    const sql = "select * from cradvancomm where Excode=?";
    db.query(sql, [AdAmount], (err, result) => {
      if (err) {
        console.error(err.message);
        return res.status(500).send({
          success: false,
          message: "Internal Server error",
          error: err.message,
        });
      }
      if (result.length > 0) {
        return res.status(200).send({
          success: true,
          message: "Already Present in Database",
        });
      } else {
        const sql =
          "insert into  cradvancomm (Excode, AdAmount, Paydate, PMode, UTRDate,UTRNo,E_User) values (?,?,?,?,?,?,?)";
        const values = [Excode, AdAmount, Paydate, PMode, UTRDate, UTRNo, user];
        db.query(sql, values, (err, result) => {
          if (err) {
            console.error(err.message);
            return res.status(500).send({
              success: false,
              message: "Internal Server error",
              error: err.message,
            });
          }
          res.status(201).send({
            success: true,
            message: "Commission Added Successfully",
            result,
          });
        });
      }
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something went wrong in create Advance Commission Controller",
      error: error.message,
    });
  }
};
// get advance commission
export const getAdvanceController = (req, res) => {
  try {
    const sql = "select * from cradvancomm";
    db.query(sql, (err, result) => {
      if (err) {
        console.error(err.message);
        return res.status(500).send({
          success: false,
          message: "Internal Server error",
          error: err.message,
        });
      }
      return res.status(200).send({
        success: true,
        message: "Access Successfully",
        result,
      });
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something went wrong in get Advance Commission Controller",
      error: error.message,
    });
  }
};
// update advance commission controller
export const updateAdvanceController = (req, res) => {
  try {
    const { Id } = req.params;
    const { Excode, AdAmount, Paydate, PMode, UTRDate, UTRNo, user } = req.body;

    if (!Excode) return res.status(502).send({ error: "Excode is required" });
    if (!AdAmount)
      return res.status(502).send({ error: "AdAmount is required" });
    if (!Paydate) return res.status(502).send({ error: "Paydate is required" });
    if (!user) return res.status(502).send({ error: "user is required" });
    if (!PMode) return res.status(502).send({ error: "PMode is required" });
    if (!UTRDate) return res.status(502).send({ error: "UTRDate is required" });
    if (!UTRNo) return res.status(502).send({ error: "UTRNo is required" });

    const sql =
      "update cradvancomm set Excode=?,AdAmount=?,Paydate=?,PMode=?,UTRDate=?,UTRNo=?,M_User=? where Id=?";
    const values = [Excode, AdAmount, Paydate, PMode, UTRDate, UTRNo, user, Id];
    db.query(sql, values, (err, result) => {
      if (err) {
        console.error(err.message);
        return res.status(500).send({
          success: false,
          message: "Internal Server error",
          error: err.message,
        });
      }
      res.status(200).send({
        success: true,
        message: "Commission Update Successfully",
        result,
      });
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something went wrong in update Advance Commission Controller",
      error: error.message,
    });
  }
};
// delete advance commission controller
export const deleteAdvanceController = async (req, res) => {
  try {
    const { Id } = req.params;
    const sql = "delete from cradvancomm where Id=?";
    db.query(sql, [Id], (err, result) => {
      if (err) {
        console.error(err.message);
        return res.status(500).send({
          success: false,
          message: "Internal Server error",
          error: err.message,
        });
      }
      res.status(200).send({
        success: true,
        message: "Commission Delete Successfully",
        result,
      });
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something went wrong in delete Advance Commission Controller",
      error: error.message,
    });
  }
};


// Bank Controller Start=====
export const createBankController = async (req, res) => {
  try {
    const { BankName, BankBr, ACNo, IFSC, ACType, user } = req.body;

    if (!BankName)
      return res.status(502).send({ error: "BankName is required" });
    if (!BankBr) return res.status(502).send({ error: "BankBr is required" });
    if (!ACNo) return res.status(502).send({ error: "ACNo is required" });
    if (!user) return res.status(502).send({ error: "user is required" });
    if (!IFSC) return res.status(502).send({ error: "IFSC is required" });
    if (!ACType) return res.status(502).send({ error: "ACType is required" });

    const sql = "Select * from crbank where BankName=? and ACNo=? and IFSC=?";
    const values = [BankName, ACNo, IFSC];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error(err.message);
        return res.status(500).send({
          success: false,
          message: "Internal Server error",
          error: err.message,
        });
      }
      if (result.length > 0) {
        return res.status(200).send({
          success: true,
          message: "Already registered in the database",
          result,
        });
      } else {
        const fetchsql = "Select B_Id from crbank order by B_Id desc limit 1";
        db.query(fetchsql, (fetchErr, fetchResult) => {
          if (fetchErr) {
            console.error(fetchErr.message);
            return res.status(500).send({
              success: false,
              message: "Internal Server error",
              error: fetchErr.message,
            });
          }
          let newBID = "BID101";
          if (fetchResult.length > 0) {
            const BID = fetchResult[0].B_Id;
            const lastBID = parseInt(BID.slice(3));
            newBID = `BID${lastBID + 1}`;
          }

          const sql =
            "INSERT INTO crbank (B_Id,BankName, BankBr, ACNo, IFSC, ACType, E_User) values (?,?,?,?,?,?,?) ";
          const values = [newBID, BankName, BankBr, ACNo, IFSC, ACType, user];

          db.query(sql, values, (err, result) => {
            if (err) {
              console.error(err.message);
              return res.status(500).send({
                success: false,
                message: "Internal Server error",
                error: err.message,
              });
            }
            return res.status(201).send({
              success: true,
              message: "Insert Successfully",
              result,
            });
          });
        });
      }
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something went wrong in create bank Controller",
      error: error.message,
    });
  }
};
// get all bank details
export const getbankController = async (req, res) => {
  try {
    const sql = "select * from crbank ";
    db.query(sql, (err, result) => {
      if (err) {
        console.error(err.message);
        return res.status(500).send({
          success: false,
          message: "Internal Server error",
          error: err.message,
        });
      }
      return res.status(200).send({
        success: true,
        message: "Access Successfully",
        result,
      });
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something went wrong in get all bank Controller",
      error: error.message,
    });
  }
};
// update bank controller
export const updateBankController = async (req, res) => {
  try {
    const { Id } = req.params;
    const { BankName, BankBr, ACNo, IFSC, ACType, user } = req.body;

    // Validation
    if (!BankName)
      return res.status(400).send({ error: "BankName is required" });
    if (!BankBr) return res.status(400).send({ error: "BankBr is required" });
    if (!ACNo) return res.status(400).send({ error: "ACNo is required" });
    if (!user) return res.status(400).send({ error: "user is required" });
    if (!IFSC) return res.status(400).send({ error: "IFSC is required" });
    if (!ACType) return res.status(400).send({ error: "ACType is required" });

    // SQL query
    const sql =
      "UPDATE crbank SET BankName=?, BankBr=?, ACNo=?, IFSC=?, ACType=?, M_user=? WHERE Id=?";
    const values = [BankName, BankBr, ACNo, IFSC, ACType, user, Id];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error(err.message);
        return res.status(500).send({
          success: false,
          message: "Internal Server Error",
        });
      }
      return res.status(200).send({
        success: true,
        message: "Updated Successfully",
        result,
      });
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({
      success: false,
      message: "Something went wrong in update bank Controller",
    });
  }
};
// delete bank controller
export const deleteBankController = async (req, res) => {
  try {
    const { Id } = req.params;
    const sql = "delete from crbank where Id=?";
    db.query(sql, [Id], (err, result) => {
      if (err) {
        console.error(err.message);
        return res.status(500).send({
          success: false,
          message: "Internal Server Error",
        });
      }
      return res.status(200).send({
        success: true,
        message: "Deleted Successfully",
        result,
      });
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({
      success: false,
      message: "Something went wrong in update bank Controller",
    });
  }
};


// Commission controller start====
// get commission
export const getCommissionController = async (req, res) => {
  try {
    const sql = "select * from crproject";
    db.query(sql, (err, result) => {
      if (err) {
        console.error(err.message);
        return res.status(500).send({
          success: false,
          message: "Internal Server Error",
        });
      }
      return res.status(200).send({
        success: true,
        message: "Access Successfully",
        result,
      });
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({
      success: false,
      message: "Something went wrong in get commission Controller",
    });
  }
};
// access data
export const accessCommissionController = async (req, res) => {
  try {
    const { project } = req.body;
    const sql = "select * from projectcomm where P_Id=? order by salary asc";
    db.query(sql, [project], (err, result) => {
      if (err) {
        console.error(err.message);
        return res.status(500).send({
          success: false,
          message: "Internal Server Error",
        });
      }
      return res.status(200).send({
        success: true,
        message: "Access Successfully",
        result,
      });
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({
      success: false,
      message: "Something went wrong in access commission Controller",
    });
  }
};
// update Commission
export const updateCommissionController = async (req, res) => {
  try {
    const { Id } = req.params;
    const { commission } = req.body;

    // Validation
    if (!commission)
      return res.status(400).send({ error: "commission is required" });

    // SQL query
    const sql = "UPDATE projectcomm SET commission=? WHERE Id=?";
    const values = [commission, Id];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error(err.message);
        return res.status(500).send({
          success: false,
          message: "Internal Server Error",
        });
      }
      return res.status(200).send({
        success: true,
        message: "Updated Successfully",
        result,
      });
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({
      success: false,
      message: "Something went wrong in update bank Controller",
    });
  }
};
// delete commission
export const deleteCommissionController = async (req, res) => {
  try {
    const { Id } = req.params;
    const sql = "delete from projectcomm where Id=?";
    db.query(sql, [Id], (err, result) => {
      if (err) {
        console.error(err.message);
        return res.status(500).send({
          success: false,
          message: "Internal Server Error",
        });
      }
      return res.status(200).send({
        success: true,
        message: "Deleted Successfully",
        result,
      });
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({
      success: false,
      message: "Something went wrong in update bank Controller",
    });
  }
};


// TDS controller start===
// create TDSPage
export const createTDSController = async (req, res) => {
  try {
    const {
      TDSWPan,
      TDSWIPan,
      LFine,
      ProFee,
      MemFe,
      SAFFee,
      SCFFee,
      SACCFFee,
      AOAmount,
      SRevival,
      user,
    } = req.body;
    if (
      !TDSWIPan ||
      !TDSWPan ||
      !LFine ||
      !ProFee ||
      !MemFe ||
      !SAFFee ||
      !SCFFee ||
      !SACCFFee ||
      !AOAmount ||
      !SRevival ||
      !user
    ) {
      return res.status(400).send({ error: "All fields are required" });
    }
    // const sql='select * from crlatetds where accformfee=?,accopenfee=?,'
    const sql =
      "insert into crlatetds (tdswpan,tdswopan,latefine,procefee,memberfee,assofee,cusfee,accformfee,accopenfee,revival,E_User) values (?,?,?,?,?,?,?,?,?,?,?)";
    const values = [
      TDSWPan,
      TDSWIPan,
      LFine,
      ProFee,
      MemFe,
      SAFFee,
      SCFFee,
      SACCFFee,
      AOAmount,
      SRevival,
      user,
    ];
    db.query(sql, values, (err, result) => {
      if (err) {
        console.error(err.message);
        return res.status(500).send({
          success: false,
          message: "Internal Server Error",
        });
      }
      return res.status(200).send({
        success: true,
        message: "Insert Successfully",
        result,
      });
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({
      success: false,
      message: "Something went wrong in create tds Controller",
    });
  }
};
// get tds
export const getTDSController = async (req, res) => {
  try {
    const sql = "select * from crlatetds";
    db.query(sql, (err, result) => {
      if (err) {
        console.error(err.message);
        return res.status(500).send({
          success: false,
          message: "Internal Server Error",
        });
      }
      return res.status(200).send({
        success: true,
        message: "Access Successfully",
        result,
      });
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({
      success: false,
      message: "Something went wrong in get tds Controller",
    });
  }
};
// update tds
export const updateTDSController = async (req, res) => {
  try {
    const { Id } = req.params;
    const {
      TDSWPan,
      TDSWIPan,
      LFine,
      ProFee,
      MemFe,
      SAFFee,
      SCFFee,
      SACCFFee,
      AOAmount,
      SRevival,
      user,
    } = req.body;

    if (
      !TDSWIPan ||
      !TDSWPan ||
      !LFine ||
      !ProFee ||
      !MemFe ||
      !SAFFee ||
      !SCFFee ||
      !SACCFFee ||
      !AOAmount ||
      !SRevival ||
      !user
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const sql = `
      UPDATE crlatetds 
      SET tdswpan=?, tdswopan=?, latefine=?, procefee=?, memberfee=?, assofee=?,
          cusfee=?, accformfee=?, accopenfee=?, revival=?, M_User=? 
      WHERE Id=?
    `;
    const values = [
      TDSWPan,
      TDSWIPan,
      LFine,
      ProFee,
      MemFe,
      SAFFee,
      SCFFee,
      SACCFFee,
      AOAmount,
      SRevival,
      user,
      Id,
    ];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({
          success: false,
          message: "Internal Server Error",
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "No record found with the given Id",
        });
      }

      res.status(200).json({
        success: true,
        message: "Updated Successfully",
        result,
      });
    });
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong in update TDS Controller",
    });
  }
};
// delete tds
export const deleteTDSController = (req, res) => {
  try {
    const { Id } = req.params;
    const sql = "delete from crlatetds where Id=?";
    db.query(sql, [Id], (err, result) => {
      if (err) {
        console.error(err.message);
        return res.status(500).send({
          success: false,
          message: "Internal Server Error",
        });
      }
      return res.status(200).send({
        success: true,
        message: "Deleted Successfully",
        result,
      });
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({
      success: false,
      message: "Something went wrong in update bank Controller",
    });
  }
};

// Associate controller start===
// destrict controller
export const getDistrictController = async (req, res) => {
  try {
    const { state } = req.body;
    const sql = `SELECT name FROM districts WHERE state = ?`;
    db.query(sql, [state], (err, result) => {
      if (err) {
        console.error(err.message);
        return res.status(500).send({
          success: false,
          message: "Internal Server Error",
        });
      }
      return res.status(200).send({
        success: true,
        message: "Access Successfully",
        result,
      });
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({
      success: false,
      message: "Something went wrong in get district Controller",
    });
  }
};

//create Associate controller
export const createAssociateController = async (req, res) => {
  try {
    const {
      Appliname, OfficeC, IntrodCode, IntrodName, state, FaHuName, MName, gender, designation, BankCode, AccountNo, IFSC, BankAddr, Mobile, memberId,
      JoinDate, DOB, blood, Occupation, Qualif, Pan, passNo, DLNo, Icard, bankName, performance, FormFee, user,
      Address, district, PinCode, Landline, email, company, experience, CompanyAdd, NName, NAge, relation, NomAddr, organization, AreaOccu, TSize,
    } = req.body;

    const file = req.file ? req.file.filename : null;


    const rowfields = {
      Appliname, OfficeC, state, blood, IntrodCode, IntrodName, FaHuName, MName, gender, designation, BankCode, AccountNo, IFSC, BankAddr, Mobile,
      JoinDate, DOB, Occupation, Qualif, Pan, passNo, DLNo, Icard, bankName, performance, memberId,
      Address, district, PinCode, Landline, email, NName, NAge, relation, NomAddr, organization, AreaOccu, TSize, file,
    };

    // Check for any missing fields
    const missingField = Object.keys(rowfields).find(name => !rowfields[name]);
    if (missingField) {
      return res.status(400).send({ error: `${missingField} is required` });
    }

    const sql = 'SELECT * FROM associate WHERE OfficeC = ? AND Appliname = ? and IntrodCode=?';
    db.query(sql, [OfficeC, Appliname, IntrodCode], (err, result) => {
      if (err) {
        console.error('Database Query Error:', err.message);
        return res.status(500).send({
          success: false,
          message: "Internal Server Error",
        });
      }

      if (result.length > 0) {
        return res.status(200).send({
          success: true,
          message: "Already Present",
        });
      } else {
        const fetchSql = 'SELECT C_Id FROM associate ORDER BY C_Id DESC LIMIT 1';
        db.query(fetchSql, (fetchErr, fetchResult) => {
          if (fetchErr) {
            console.error(fetchErr.message);
            return res.status(500).send({
              success: false,
              message: "Internal Server Error",
            });
          }

          let newCId = '100100001';
          if (fetchResult.length > 0) {
            const lastCId = parseInt(fetchResult[0].C_Id.slice(4), 10);
            newCId = `1001${(lastCId + 1).toString().padStart(5, '0')}`;
          }

          const insSql = `
            INSERT INTO associate (
              C_Id, Appliname, state, OfficeC, IntrodCode, IntrodName, FaHuName, MName, gender, designation, BankCode, AccountNo, IFSC, BankAddr, Mobile,
              JoinDate, DOB, blood, Occupation, Qualif, Pan, passNo, DLNo, Icard, bankName, performance, FormFee, 
              Address, district, PinCode, Landline, email, company, experience, CompanyAdd, memberId, NName, NAge, relation, NomAddr, organization, AreaOccu, TSize, image, E_User
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)
          `;

          const values = [
            newCId, Appliname, state, OfficeC, IntrodCode, IntrodName, FaHuName, MName, gender, designation, BankCode, AccountNo, IFSC, BankAddr, Mobile,
            JoinDate, DOB, blood, Occupation, Qualif, Pan, passNo, DLNo, Icard, bankName, performance, FormFee,
            Address, district, PinCode, Landline, email, company, experience, CompanyAdd, memberId, NName, NAge, relation, NomAddr, organization, AreaOccu, TSize, file, user
          ];

          db.query(insSql, values, (insErr, insResult) => {
            if (insErr) {
              if (insErr.code === 'ER_DUP_ENTRY') {
                console.error('Duplicate C_Id Error:', insErr.message);
                return res.status(200).send({
                  success: false,
                  message: "Duplicate Entry, please try again.",
                });
              }
              console.error('SQL Insert Error:', insErr.message);
              return res.status(500).send({
                success: false,
                message: "Internal Server Error",
              });
            }

            return res.status(201).send({
              success: true,
              message: "Inserted Successfully",
              result: insResult
            });
          });
        });
      }
    });
  } catch (error) {
    console.error('Controller Error:', error.message);
    res.status(500).send({
      success: false,
      message: "Something went wrong in createAssociateController",
    });
  }
};


// get Associate
export const getAssociateController = (req, res) => {
  try {
    const sql = 'Select * from associate'
    db.query(sql, (err, result) => {
      if (err) {
        console.error(err.message);
        return res.status(500).send({
          success: false,
          message: "Internal Server Errordsd",
        });
      }
      return res.status(200).send({
        success: true,
        message: "Inserted Successfully",
        result: result
      });
    })
  } catch (error) {
    console.error(error.message);
    res.status(500).send({
      success: false,
      message: "Something went wrong in getAssociateController",
    });
  }
}
// delete associate
export const deleteAssociateController = async (req, res) => {
  try {
    const { image, Id } = req.params;
    const filePath = path.join("bonanza/associate", image);
    const sql = 'DELETE FROM associate WHERE Id = ?';
    db.query(sql, [Id], (dbErr, result) => {
      if (dbErr) {
        console.error('Error deleting from database:', dbErr.message);
        return res.status(500).send({
          success: false,
          message: 'Internal Server Error during database operation',
        });
      }

      console.log('Database record deleted successfully:', result);
      return res.status(200).send({
        success: true,
        message: 'Deleted Successfully',
      });
    });
    fs.access(filePath, fs.constants.F_OK, (accessErr) => {
      if (accessErr) {
        console.error('File not found:', filePath);
        return res.status(404).send({ message: 'File not found' });
      }
      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) {
          console.error('Error deleting file:', unlinkErr);
          return res.status(500).send({ message: 'Error deleting file', error: unlinkErr });
        }
      });
    });
  } catch (error) {
    console.error('Unexpected error in deleteAssociateController:', error);
    res.status(500).send({
      success: false,
      message: `Something went wrong in deleteAssociateController: ${error.message}`,
    });
  }
};
// update associate


export const updateAssociateController = async (req, res) => {
  try {
    const { Id } = req.params;
    const {
      images, Appliname, OfficeC, IntrodCode, IntrodName, state, FaHuName, MName, gender, designation, BankCode, AccountNo, IFSC, BankAddr, Mobile, memberId,
      JoinDate, DOB, blood, Occupation, Qualif, Pan, passNo, DLNo, Icard, bankName, performance, FormFee, user,
      Address, district, PinCode, Landline, email, company, experience, CompanyAdd, NName, NAge, relation, NomAddr, organization, AreaOccu, TSize,
    } = req.body;

    const file = req.file ? req.file.filename : images;

    const rowfields = {
      Appliname, OfficeC, state, user, IntrodCode, IntrodName, FaHuName, MName, gender, designation, BankCode, AccountNo, IFSC, BankAddr, Mobile,
      JoinDate, DOB, blood, Occupation, Qualif, Pan, passNo, DLNo, Icard, bankName, performance,
      Address, district, PinCode, Landline, email, NName, NAge, relation, NomAddr, organization, AreaOccu, TSize,
    };

    for (const [name, value] of Object.entries(rowfields)) {
      if (!value) {
        return res.status(400).send({ error: `${name} is required` });
      }
    }

    // Fetch previous image
    const sqlSelectImage = 'SELECT image FROM associate WHERE Id = ?';
    db.query(sqlSelectImage, [Id], (err, result) => {
      if (err) {
        console.error('Database query error:', err.message);
        return res.status(502).send({ error: 'Internal Server Error' });
      }

      const previousImage = result[0] ? result[0].image : null;

      // Remove old image if a new one is uploaded
      if (previousImage && previousImage !== file) {
        const filePath = path.join("bonanza/associate", previousImage);
        fs.unlink(filePath, (unlinkErr) => {
          if (unlinkErr) {
            console.error('File unlink error:', unlinkErr);
          }
        });
      }

      // Update the associate record
      const sqlUpdate = `
        UPDATE associate 
        SET Appliname=?, OfficeC=?, state=?, IntrodCode=?, IntrodName=?, FaHuName=?, MName=?, gender=?, designation=?, BankCode=?, AccountNo=?, IFSC=?, BankAddr=?, Mobile=?, 
            JoinDate=?, DOB=?, blood=?, Occupation=?, Qualif=?, Pan=?, passNo=?, DLNo=?, Icard=?, bankName=?, performance=?, memberId=?, FormFee=?,
            Address=?, district=?, PinCode=?, Landline=?, email=?, company=?, experience=?, CompanyAdd=?, NName=?, NAge=?, relation=?, NomAddr=?, organization=?, AreaOccu=?, TSize=?, 
            image=?, M_User=?  
        WHERE Id=?
      `;

      const values = [
        Appliname, OfficeC, state, IntrodCode, IntrodName, FaHuName, MName, gender, designation, BankCode, AccountNo, IFSC, BankAddr, Mobile,
        JoinDate, DOB, blood, Occupation, Qualif, Pan, passNo, DLNo, Icard, bankName, performance, memberId, FormFee,
        Address, district, PinCode, Landline, email, company, experience, CompanyAdd, NName, NAge, relation, NomAddr, organization, AreaOccu, TSize, file, user, Id
      ];

      db.query(sqlUpdate, values, (err, result) => {
        if (err) {
          console.error('Database update error:', err.message);
          return res.status(500).send({
            success: false,
            message: `Database error: ${err.message}`,
          });
        }
        return res.status(200).send({
          success: true,
          message: "Updated Successfully",
          result
        });
      });
    });
  } catch (error) {
    console.error('Unexpected error in updateAssociateController:', error);
    res.status(500).send({
      success: false,
      message: `Something went wrong in updateAssociateController: ${error.message}`,
    });
  }
};


// Customer controller start===
export const createCustomerController = async (req, res) => {
  try {
    const {
      FormFee, BranchCode, MemberId, ApplicantName, SO, SupName, Address, IncomeGroup, Mobile,
      Category, user, IntroCode, IntroName, AgreeDate, DOB, Nationality, GaurdName, GaurdAge, GuardAddr,
      PAN, branch, AccountNo, PropertyType, IFSC, PayType, ProjectName, ProjectSize, PayDate, PayDDN, relation,
      PayableAmount, BookAmount, Discount, ProReference, PLCCost, DeveCharge, ProCost, PayMode, PayDMode, PayDrawNo,
      PayableAt, AmountWord, TransBank, TransId, TransDate, EMI,
      TransAmount, TransHolderAC, TransType, ChequeBank, ChequeAcc, ChequeNo, ChequeHolder, ChequeBranch, ChequeIFSC, ChequeAmount,
      ChequeDate, term
    } = req.body;

    const files = req.files ? req.files.map(file => file.filename) : null;

    const requiredFields = {
      BranchCode, MemberId, ApplicantName, SO, SupName, Address, Mobile,
      Category, IntroCode, IntroName, AgreeDate, DOB, Nationality, GaurdName,
      GaurdAge, GuardAddr, PAN, branch,
      AccountNo, PropertyType, IFSC, PayType, ProjectName, ProjectSize,
      PayableAmount, Discount, ProReference, DeveCharge, ProCost, PayMode,
      PayDMode, PayDate, PayableAt, AmountWord
    };

    for (const [name, value] of Object.entries(requiredFields)) {
      if (!value) {
        return res.status(400).send({ error: `${name} is required` });
      }
    }

    const sql = 'SELECT * FROM customer WHERE BranchCode = ? AND ApplicantName = ?';
    db.query(sql, [BranchCode, ApplicantName], (err, result) => {
      if (err) {
        console.error(err.message);
        return res.status(500).send({ success: false, message: "Internal Server Error" });
      }
      if (result.length>0) {
        return res.status(200).send({ success: true, message: "Customer already exists" });
      } else {
        const fetchSql = 'SELECT C_Id FROM customer ORDER BY C_Id DESC LIMIT 1';
        db.query(fetchSql, (fetchErr, fetchResult) => {
          if (fetchErr) {
            console.error(fetchErr.message);
            return res.status(500).send({ success: false, message: "Internal Server Error" });
          }

          let newCId = '100100001';
          if (fetchResult.length > 0) {
            const lastCId = parseInt(fetchResult[0].C_Id.slice(4), 10);

            newCId = `1001${(lastCId + 1).toString().padStart(5, '0')}`;
          }

          const insSql = `INSERT INTO customer (
            C_Id, FormFee, BranchCode, MemberId, ApplicantName, SO, SupName, Address, IncomeGroup, Mobile,
            Category, E_User , IntroCode, IntroName, AgreeDate, DOB, Nationality, GaurdName,
             GaurdAge, GuardAddr, PAN, branch, AccountNo, PropertyType, IFSC, PayType, ProjectName, ProjectSize,
            PayableAmount, BookAmount, Discount, ProReference, PLCCost, DeveCharge, ProCost, PayMode, PayDMode, PayDate,
            PayDDN, PayDrawNo, PayableAt, AmountWord,TransBank, TransId, TransDate, TransAmount, TransHolderAC, TransType,
             ChequeBank, ChequeAcc, ChequeNo,ChequeHolder, ChequeBranch, ChequeIFSC, ChequeAmount, ChequeDate,
            image, chequeImg,relation,EMI,term
           
          ) VALUES (
           ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 
           ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 
           ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
           ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
           ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? ,?,?)`;

          const values = [
            newCId, FormFee, BranchCode, MemberId, ApplicantName, SO, SupName, Address, IncomeGroup, Mobile,
            Category, user, IntroCode, IntroName, AgreeDate, DOB, Nationality, GaurdName, GaurdAge, GuardAddr, PAN,
            branch, AccountNo, PropertyType, IFSC, PayType, ProjectName, ProjectSize, PayableAmount, BookAmount, Discount,
            ProReference, PLCCost, DeveCharge, ProCost, PayMode, PayDMode, PayDate, PayDDN, PayDrawNo, PayableAt, AmountWord,
            TransBank, TransId, TransDate, TransAmount, TransHolderAC, TransType, ChequeBank, ChequeAcc, ChequeNo,
            ChequeHolder, ChequeBranch, ChequeIFSC, ChequeAmount, ChequeDate,
            files ? files[0] : null, files ? files[1] : null, relation, EMI, term
          ];

          db.query(insSql, values, (insErr, insResult) => {
            if (insErr) {
              console.error(insErr.message);
              return res.status(500).send({ success: false, message: "Internal Server Error" });
            }
            return res.status(201).send({ success: true, message: "Inserted Successfully", result: insResult });
          });
        });
      }
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ success: false, message: "Something went wrong in createCustomerController" });
  }
};
// get customer controller
export const getCustomerController = async (req, res) => {
  try {
    const sql = 'Select * from customer'
    db.query(sql, (err, result) => {
      if (err) {
        console.error(err.message);
        return res.status(500).send({
          success: false,
          message: "Internal Server Errordsd",
        });
      }
      return res.status(200).send({
        success: true,
        message: "Inserted Successfully",
        result: result
      });
    })
  } catch (error) {
    console.error(error.message);
    res.status(500).send({
      success: false,
      message: "Something went wrong in getCustomerController",
    });
  }
}
// delete customer controller
export const deleteCustomerController = async (req, res) => {
  try {
    const { Id } = req.params;
    const getImagesSql = 'SELECT image, chequeImg FROM customer WHERE Id = ?';
    db.query(getImagesSql, [Id], (err, result) => {
      if (err) {
        console.error(err.message);
        return res.status(500).send({
          success: false,
          message: 'Internal Server Error',
        });
      }
      if (result.length > 0) {
        const { image, chequeImg } = result[0];
        const imagesToDelete = [image, chequeImg].filter(Boolean);
        imagesToDelete.forEach((img) => {
          const filePath = path.join('bonanza/customer', img);
          fs.access(filePath, fs.constants.F_OK, (accessErr) => {
            if (accessErr) {
              console.error('File not found:', filePath);
              return res.status(404).send({ message: 'File not found' });
            }
            fs.unlink(filePath, (unlinkErr) => {
              if (unlinkErr) {
                console.error('Error deleting file:', unlinkErr);
                return res.status(500).send({ message: 'Error deleting file', error: unlinkErr });
              }
              console.log('File deleted:', filePath);
            });
          });
        });
      } else {
        return res.status(404).send({
          success: false,
          message: 'Customer not found',
        });
      }
      const deleteCustomerSql = 'DELETE FROM customer WHERE Id = ?';
      db.query(deleteCustomerSql, [Id], (delErr, delResult) => {
        if (delErr) {
          console.error(delErr.message);
          return res.status(500).send({
            success: false,
            message: 'Internal Server Error',
          });
        }
        console.log('Database record deleted successfully:', delResult);
        return res.status(200).send({
          success: true,
          message: 'Deleted Successfully',
        });
      });
    });
  } catch (error) {
    console.error('Unexpected error in deleteCustomerController:', error);
    res.status(500).send({
      success: false,
      message: `Something went wrong in deleteCustomerController: ${error.message}`,
    });
  }
};
// update customer controller
export const updateCustomerController = async (req, res) => {
  try {
    const { Id } = req.params;
    const {
      FormFee, BranchCode, MemberId, ApplicantName, SO, SupName, Address, IncomeGroup, Mobile, EMI,
      Category, user, IntroCode, IntroName, AgreeDate, DOB, Nationality, GaurdName, GaurdAge, GuardAddr,
      PAN, branch, AccountNo, PropertyType, IFSC, PayType, ProjectName, ProjectSize, PayDate, PayDDN,
      PayableAmount, BookAmount, Discount, ProReference, PLCCost, DeveCharge, ProCost, PayMode, PayDMode, PayDrawNo,
      PayableAt, AmountWord, TransBank, TransId, TransDate,
      TransAmount, TransHolderAC, TransType, ChequeBank, ChequeAcc, ChequeNo, ChequeHolder, ChequeBranch, ChequeIFSC, ChequeAmount,
      ChequeDate, chequeImg, image, term
    } = req.body;

    const files = [image, chequeImg];
    const uploadedFiles = req.files ? req.files.map(file => file.filename) : [];

    // Check for required fields
    const requiredFields = {
      FormFee, BranchCode, MemberId, ApplicantName, SO, SupName, Address, IncomeGroup, Mobile,
      Category, user, IntroCode, IntroName, AgreeDate, DOB, Nationality, GaurdName,
      GaurdAge, GuardAddr, PAN, branch,
      AccountNo, PropertyType, IFSC, PayType, ProjectName, ProjectSize,
      PayableAmount, BookAmount, Discount, ProReference, PLCCost, DeveCharge, ProCost, PayMode,
      PayDMode, PayDate, PayableAt, AmountWord
    };

    for (const [name, value] of Object.entries(requiredFields)) {
      if (!value) {
        return res.status(400).send({ error: `${name} is required` });
      }
    }

    const sql = 'SELECT image, chequeImg FROM customer WHERE Id = ?';
    db.query(sql, [Id], (err, result) => {
      if (err) {
        console.error(err.message);
        return res.status(500).send({
          success: false,
          message: 'Internal Server Error'
        });
      }

      if (result.length > 0) {
        const { image: oldImage, chequeImg: oldChequeImg } = result[0];
        const deleteFile = [];
        if (uploadedFiles[0] && oldImage && oldImage !== uploadedFiles[0]) {
          deleteFile.push(oldImage);
        }
        if (uploadedFiles[1] && oldChequeImg && oldChequeImg !== uploadedFiles[1]) {
          deleteFile.push(oldChequeImg);
        }

        deleteFile.forEach((el) => {
          const filePath = path.join("bonanza/customer", el);
          fs.unlink(filePath, (unlinkErr) => {
            if (unlinkErr) {
              console.error('Error deleting file:', unlinkErr);
              return res.status(500).send({ message: 'Error deleting file', error: unlinkErr });
            }
          });
        });

        const updateSql = `UPDATE customer SET FormFee=?, BranchCode=?, MemberId=?, ApplicantName=?, SO=?, SupName=?, Address=?, IncomeGroup=?, Mobile=?,
          Category=?, IntroCode=?, IntroName=?, AgreeDate=?, DOB=?, Nationality=?, GaurdName=?, GaurdAge=?, GuardAddr=?, PAN=?, branch=?, 
          AccountNo=?, PropertyType=?, IFSC=?, PayType=?, ProjectName=?, ProjectSize=?, PayableAmount=?, BookAmount=?, Discount=?, ProReference=?, 
          PLCCost=?, DeveCharge=?, ProCost=?, PayMode=?, PayDMode=?, PayDate=?, PayDDN=?, PayDrawNo=?, PayableAt=?, AmountWord=?, TransBank=?, 
          TransId=?, TransDate=?, TransAmount=?, TransHolderAC=?, TransType=?, ChequeBank=?, ChequeAcc=?, ChequeNo=?, ChequeHolder=?, ChequeBranch=?, 
          ChequeIFSC=?, ChequeAmount=?, ChequeDate=?, image=?, chequeImg=?,EMI=?,term=? WHERE Id=?`;
        const values = [
          FormFee, BranchCode, MemberId, ApplicantName, SO, SupName, Address, IncomeGroup, Mobile,
          Category, IntroCode, IntroName, AgreeDate, DOB, Nationality, GaurdName, GaurdAge, GuardAddr, PAN,
          branch, AccountNo, PropertyType, IFSC, PayType, ProjectName, ProjectSize, PayableAmount, BookAmount, Discount,
          ProReference, PLCCost, DeveCharge, ProCost, PayMode, PayDMode, PayDate, PayDDN, PayDrawNo, PayableAt, AmountWord,
          TransBank, TransId, TransDate, TransAmount, TransHolderAC, TransType, ChequeBank, ChequeAcc, ChequeNo,
          ChequeHolder, ChequeBranch, ChequeIFSC, ChequeAmount, ChequeDate, uploadedFiles[0] || oldImage, uploadedFiles[1] || oldChequeImg, EMI, term, Id];

        db.query(updateSql, values, (InsErr, InsResult) => {
          if (InsErr) {
            console.error(InsErr.message);
            return res.status(500).send({
              success: false,
              message: 'Internal Server Error'
            });
          }
          return res.status(200).send({ success: true, message: "Updated Successfully" });
        });
      } else {
        return res.status(404).send({ success: false, message: "Customer not found" });
      }
    });

  } catch (error) {
    console.error('Unexpected error in updateCustomerController:', error);
    res.status(500).send({
      success: false,
      message: `Something went wrong in updateCustomerController: ${error.message}`
    });
  }
}



// access brachCode
export const branchCodeController = async (req, res) => {
  try {
    const { code } = req.params
    if (!code) {
      res.status(404).send({
        error: 'code is required'
      })
    }
    const sql = `select DISTINCT OfficeC from associate where OfficeC like '%${code}%'`
    db.query(sql, (err, result) => {
      if (err) {
        console.error(err.message);
        return res.status(500).send({
          success: false,
          message: 'Internal Server Error'
        });
      }
      return res.status(200).send({
        success: true, message: "Access Successfully",
        result
      });
    })

  } catch (error) {
    console.error('Unexpected error in branchCodeController:', error);
    res.status(500).send({
      success: false,
      message: `Something went wrong in branchCodeController: ${error.message}`
    });
  }
}
// access brachCode
export const CustbranchCodeController = async (req, res) => {
  try {
    const { code } = req.params
    if (!code) {
      res.status(404).send({
        error: 'code is required'
      })
    }
    const sql = `select DISTINCT BranchCode from customer where BranchCode like '%${code}%'`
    db.query(sql, (err, result) => {
      if (err) {
        console.error(err.message);
        return res.status(500).send({
          success: false,
          message: 'Internal Server Error'
        });
      }
      return res.status(200).send({
        success: true, message: "Access Successfully",
        result
      });
    })

  } catch (error) {
    console.error('Unexpected error in CustbranchCodeController:', error);
    res.status(500).send({
      success: false,
      message: `Something went wrong in CustbranchCodeController: ${error.message}`
    });
  }
}
// introducer Code Controller
export const introCodeController = async (req, res) => {
  try {
    const { intro } = req.params;

    if (!intro) {
      return res.status(400).send({ error: 'Intro is required' });
    }

    const sql = `SELECT DISTINCT * FROM associate WHERE C_Id LIKE '%${intro}%'`

    db.query(sql, (err, result) => {
      if (err) {
        console.error('Database error:', err.message);
        return res.status(500).send({
          success: false,
          message: 'Internal Server Error',
        });
      }

      return res.status(200).send({
        success: true,
        message: 'Access Successfully',
        result,
      });
    });

  } catch (error) {
    console.error('Unexpected error in introCodeController:', error);
    res.status(500).send({
      success: false,
      message: `Something went wrong in introCodeController: ${error.message}`,
    });
  }
};
// from cuctomer
export const CustintroCodeController = async (req, res) => {
  try {
    const { intro } = req.params;

    if (!intro) {
      return res.status(400).send({ error: 'Intro is required' });
    }

    const sql = `SELECT DISTINCT * FROM customer WHERE C_Id LIKE '%${intro}%'`

    db.query(sql, (err, result) => {
      if (err) {
        console.error('Database error:', err.message);
        return res.status(500).send({
          success: false,
          message: 'Internal Server Error',
        });
      }

      return res.status(200).send({
        success: true,
        message: 'Access Successfully',
        result,
      });
    });

  } catch (error) {
    console.error('Unexpected error in CustintroCodeController:', error);
    res.status(500).send({
      success: false,
      message: `Something went wrong in CustintroCodeController: ${error.message}`,
    });
  }
};
// get introducer name 
export const getIntroducrController = async (req, res) => {
  try {
    const { introName } = req.body
    if (!introName) {
      res.status(404).send({ error: 'IntroName is required' })
    }
    const sql = `select IntrodName from associate where IntrodCode=?`
    db.query(sql, [introName], (err, result) => {
      if (err) {
        console.error('Database error:', err.message);
        return res.status(500).send({
          success: false,
          message: 'Internal Server Error',
        });
      }
      return res.status(200).send({
        success: true,
        message: 'Access Successfully',
        result,
      });
    })

  } catch (error) {
    console.error('Unexpected error in getIntroducrController:', error);
    res.status(500).send({
      success: false,
      message: `Something went wrong in getIntroducrController: ${error.message}`,
    });
  }
}


// Create Expense Controller
export const createExpenseController = async (req, res) => {
  try {
    const { search, user } = req.body;

    if (!search) {
      return res.status(400).send({ success: false, message: 'search is required' });
    }
    if (!user) {
      return res.status(400).send({ success: false, message: 'user is required' });
    }

    const sql = 'SELECT * FROM crexpense WHERE expense_name = ?';
    db.query(sql, [search], (err, result) => {
      if (err) {
        console.error('Error in search query:', err.message);
        return res.status(500).send({ success: false, message: 'Internal Server Error' });
      }

      if (result.length > 0) {
        return res.status(200).send({ success: true, message: 'Already exists in the database' });
      }

      const IdSql = 'SELECT E_Id FROM crexpense ORDER BY E_Id DESC LIMIT 1';
      db.query(IdSql, (Iderr, Idresult) => {
        if (Iderr) {
          console.error('Error in ID query:', Iderr.message);
          return res.status(500).send({ success: false, message: 'Internal Error' });
        }

        let newId = '100'; // Default ID if Idresult is empty
        if (Idresult.length > 0) {
          const EID = Idresult[0].E_Id; // Get the E_Id from the first element
          const lastId = parseInt(EID); // Convert E_Id to an integer
          newId = (lastId + 1).toString(); // Increment and convert back to string
        }


        const insSql = 'INSERT INTO crexpense (expense_name, E_Id,E_User) VALUES (?, ?,?)';
        const values = [search, newId, user];
        db.query(insSql, values, (insErr, insResult) => {
          if (insErr) {
            console.error('Error in insert query:', insErr.message);
            return res.status(500).send({ success: false, message: 'Internal Error' });
          }

          res.status(201).send({
            success: true,
            message: 'Inserted Successfully',
            result: insResult,
          });
        });
      });
    });
  } catch (error) {
    console.error('Unexpected error in createExpenseController:', error);
    res.status(500).send({
      success: false,
      message: `Something went wrong: ${error.message}`,
    });
  }
};
// get expense controller
export const getExpenseController = async (req, res) => {
  try {
    const sql = 'select * from crexpense'
    db.query(sql, (err, result) => {
      if (err) {
        console.log(err.message)
        res.status(400).send({
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
    console.error('Unexpected error in getExpenseController:', error);
    res.status(500).send({
      success: false,
      message: `Something went wrong: ${error.message}`,
    });
  }
}

// update expense controller
export const updateExpenseController = async (req, res) => {
  try {
    const { Id } = req.params
    const { search } = req.body
    // console.log(Id, search)
    if (!search) {
      res.status(400).send({
        error: 'search is required'
      })
    }
    const sql = 'update crexpense set expense_name=? where Id=?'
    const values = [search, Id]
    db.query(sql, values, (err, result) => {
      if (err) {
        console.log(err.message)
        res.status(400).send({
          success: false,
          message: 'Internal server error'
        })
      }
      res.status(200).send({
        success: true,
        message: 'Update Successfully'
      })
    })


  } catch (error) {
    console.error('Unexpected error in updateExpenseController:', error);
    res.status(500).send({
      success: false,
      message: `Something went wrong: ${error.message}`,
    });
  }
}
// delete expense
export const deleteExpenseController = async (req, res) => {
  try {
    const { Id } = req.params
    const sql = 'delete from crexpense where Id=?'
    db.query(sql, Id, (err, result) => {
      if (err) {
        console.log(err.message)
        res.status(400).send({
          success: false,
          message: 'Internal server error'
        })
      }
      res.status(200).send({
        success: true,
        message: 'Deleted Successfully'
      })
    })
  } catch (error) {
    console.error('Unexpected error in deleteExpenseController:', error);
    res.status(500).send({
      success: false,
      message: `Something went wrong: ${error.message}`,
    });
  }
}