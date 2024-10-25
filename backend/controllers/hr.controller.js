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

export const RegisterEmployee = async (req, res) => {
  try {
    // Extract form data
    const { name, relname, dob, gender, department, designation, dateofjoining, mobile, email, address, state, district,
      baseSalary, hra, da, cca, ta, professionaltax, providentfund, medical, pan, aadhar, qualification } = req.body;

    // Check for required fields
    const fields = {
      name, relname, dob, gender, department, designation,
      baseSalary, mobile, email, address, state, district
    };

    for (const [key, value] of Object.entries(fields)) {
      if (!value) {
        return res.status(400).send({ error: `${key} is required` });
      }
    }

    // Extract files
    const image1 = req.files['image1'] ? req.files['image1'][0].filename : 'NA';
    const image2 = req.files['image2'] ? req.files['image2'][0].filename : 'NA';
    const image3 = req.files['image3'] ? req.files['image3'][0].filename : 'NA';

    console.log(`image1: ${image1}`);
    console.log(`image2: ${image2}`);
    console.log(`image3: ${image3}`);

    // Fetch the last EId from hremployee table
    const fetchSql = "SELECT EId FROM hremployee ORDER BY EId DESC LIMIT 1";
    db.query(fetchSql, (fetchErr, fetchResult) => {
      if (fetchErr) {
        console.error('Fetch Error:', fetchErr.message);
        return res.status(500).send({
          success: false,
          message: "Internal server error",
          error: fetchErr.message,
        });
      }

      // Generate new EId
      let newEId = "1001001"; // Default starting EId if no records exist
      if (fetchResult.length > 0) {
        const lastEId = parseInt(fetchResult[0].EId, 10);
        newEId = `${lastEId + 1}`;
      }

      // Insert new employee with generated EId
      const insertSql = `INSERT INTO hremployee (
        EId, name, relname, dateofbirth, gender, department, designation, dateofjoining, mobile, email, address, state, district,
        salary, hra, da, cca, ta, professionaltax, providentfund, medical,
        image, cv, cheque, aadhar, pan, qualification, E_Date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?, ?,
         ?, ?, ?, ?, ?, ?, ?)`;

      const insertValues = [
        newEId, name, relname, dob, gender, department, designation, dateofjoining, mobile, email, address, state, district,
        baseSalary, hra, da, cca, ta, professionaltax, providentfund, medical,
        image1, image2, image3, aadhar, pan, qualification, E_Date
      ];


      db.query(insertSql, insertValues, (inErr, inResult) => {
        if (inErr) {
          return res.status(500).send({
            success: false,
            message: "Internal server error",
            error: inErr.message,
          });
        }
        return res.status(201).send({
          success: true,
          message: "Employee registered successfully",
          result: inResult,
        });
      });
    });

  } catch (error) {
   
    return res.status(500).send({
      success: false,
      message: "Error inserting data",
      error: error.message,
    });
  }
};

export const GetAllEmlpoyee = async (req, res) => {
  try {
    const sql = `SELECT * from hremployee WHERE status='1'`;

    const result = await controllerFun(sql);

    if (result) {
      res.status(200).send({
        success: true,
        message: 'Access SuccessFully',
        result
      })
    }
  }
  catch (error) {
    return res.status(500).send({
      success: false,
      message: 'Error in fetching employee List'
    });
  }
}

export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, relname, dob, gender, department, designation,
      baseSalary, mobile, email, address, state, district } = req.body;

    if (!name || !relname || !dob || !gender || !department || !designation ||
      !baseSalary || !mobile || !email || !address || !state || !district) {
      return res.status(400).send({
        error: "All fields are required",
      });
    }

    const values = [name, relname, dob, gender,
      department, designation, baseSalary, mobile, email, address, state, district, id];
    const sql =
      "UPDATE hremployee SET  name=?, relname=?, dateofbirth=?, gender=?, department=?, designation=?,salary=?, mobile=?, email=?, address=?, state=?, district=? WHERE id=?";

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
          message: "Employee not found",
        });
      }
      res.status(200).send({
        success: true,
        message: "Successfully updated Employee",
        result,
      });
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something went wrong in Update Employee",
      error: error.message,
    });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    const { Id } = req.params;
    if (!Id) return res.status(400).send({ error: "Id is required" });

    const sql = "UPDATE hremployee SET status=0 WHERE Id = ?";

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
        message: "Employee Deleted Successful",
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
}

export const EmployeeLeave = async (req, res) => {
  const { EId, name, reason, ltype, startDate, endDate } = req.body;

  const fields={EId, name, reason, ltype, startDate, endDate};

for(const[key,value] of Object.entries(fields)){
  if(!value){
    return res.status(400).send({error: `${key} is required`})
  }
}

  try {
    const insertSql = `INSERT INTO hrleave (EId,name, reason, leavetype, startdate, enddate) 
    VALUES (?, ?, ?, ?, ?, ?)`;
    const insertValues = [EId, name, reason, ltype, startDate, endDate];

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
        message: "Employee Leave successfully",
        result: inResult,
      })

    });

  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error inserting data",
      error: error.message,
    });
  }
}

export const GetEmlpoyee = async (req, res) => {
  try {
    const sql = `SELECT * from hremployee`;

    const result = await controllerFun(sql);

    if (result) {
      res.status(200).send({
        success: true,
        message: 'Access SuccessFully',
        result
      })
    }
  }
  catch (error) {
    return res.status(500).send({
      success: false,
      message: 'Error in fetching employee List'
    });
  }
}

export const getAllLeave = async (req, res) => {
  const { startdate, enddate, Id } = req.body;

  try {
    if (!Id && !startdate && !enddate) {
      return res.status(400).send({ success: false, message: 'Please provide an employee Id or both start and end dates' })
    }

    let sql = `SELECT * FROM hrleave WHERE 1=1`; // Base query to make dynamic conditions easier
    const values = [];

    // Check if startdate and enddate are provided
    if (startdate && enddate) {
      sql += ` AND startdate BETWEEN ? AND ?`;
      values.push(startdate, enddate);
    }

    // Check if name (Id) is provided
    if (Id) {
      sql += ` AND EId = ?`;
      values.push(Id);
    }

    // Execute query with parameters
    const result = await controllerFun(sql, values);

    if (result && result.length > 0) {
      res.status(200).send({
        success: true,
        message: 'Access Successfully',
        result
      });
    } else {
      res.status(404).send({ success: false, message: 'No Leave Found' })
    }
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: 'Error in fetching employee List'
    });
  }
};

export const getallEmpId = async (req, res) => {
  try {
    const { intro } = req.params;

    if (!intro) {
      return res.status(400).send({ error: 'Intro is required' });
    }
    const sql = `SELECT DISTINCT * FROM hremployee WHERE EId  LIKE '%${intro}%'`

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
}

export const addSalary = async (req, res) => {
  try {
    const { salmonth, EId, name, hra, da, cca, ta, medical, advancepay, professionaltax, loan, providentfund
    } = req.body;
  
    // Check for required fields
    const fields = { EId, salmonth, name, hra, da, cca, ta, medical, advancepay, professionaltax, loan, providentfund };
  
    for (const [key, value] of Object.entries(fields)) {
      if (!value) {
        return res.status(400).send({ error: `${key} is required` }); // Return to prevent further execution
      }
    }
    const insertSql = `INSERT INTO hraddsalary (EId,name,salarymonth, hra, da, cca, ta, medical, advancepay, professionaltax, loan, providentfund) 
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)`;
    const insertValues = [EId, name, salmonth, hra, da, cca, ta, medical, advancepay, professionaltax, loan, providentfund];
  
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
        message: "Salary Added successfully",
        result: inResult,
      });
    });
  
  } catch (error) {
    return res.status(500).send({ success: false, message: "Something wrong in the addSalary"})
  }
 

}

export const TerminatedEmployee = async (req, res) => {
  try {
    const sql = `SELECT * from hremployee WHERE status='0'`;

    const result = await controllerFun(sql);

    if (result) {
      res.status(200).send({
        success: true,
        message: 'Access SuccessFully',
        result
      })
    }
  }
  catch (error) {
    return res.status(500).send({
      success: false,
      message: 'Error in fetching employee List'
    });
  }
}

export const UpdateTerminatedEmployee = async (req, res) => {
  try {
    const { EId } = req.params;
    const { status } = req.body;
    // Validate input
    if (!EId) return res.status(400).send({ error: "Employee ID is required" });
    if (!status) return res.status(400).send({ error: "Status is required" });
    // SQL query to update employee status
    const sql = "UPDATE hremployee SET status = ?, dateofjoining=? WHERE EId = ?";

    db.query(sql, [status, E_Date, EId], (err, result) => {
      if (err) {
        console.error(err.message);
        return res.status(500).send({ success: false, message: "Internal server error", error: err.message, });
      }
      // Check if any rows were affected
      if (result.affectedRows === 0) {
        return res.status(404).send({
          success: false,
          message: "Employee not found",
        });
      }
      res.status(200).send({
        success: true,
        message: "Employee status updated successfully",
        result,
      });
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something went wrong in updating employee status",
      error: error.message,
    });
  }
};

export const GetAttendenceList = async (req, res) => {
  try {
    const { date } = req.body;
    const values = [date]

    if (!date) {
      return res.status(404).send({ error: 'date is required' })
    }

    const fetchSql = "SELECT attendencedate FROM hrattendence WHERE attendencedate=?";
    db.query(fetchSql, values, (fetchErr, fetchResult) => {
      if (fetchErr) {
        console.error(fetchErr.message);
        return res.status(400).send({ success: false, message: "Internal server Error", error: fetchErr.message });
      }

      if (fetchResult.length > 0) {
        return res.status(200).send({ success: true, message: 'Date already present' })
      } else {
        const sql = `
       SELECT 
        he.EId,
        he.name,
        hl.status,
        hl.startdate,
        hl.enddate
      FROM 
        hremployee he
      LEFT JOIN 
        hrleave hl ON he.EId = hl.EId
      AND 
        ? BETWEEN hl.startdate AND hl.enddate
         `;

        db.query(sql, [date], (error, result) => {
          if (error) {
            console.log(error.message);
            return res.status(400).send({ success: false, message: "Internal server error", error: error.message });
          }
          res.status(201).send({ success: false, message: "Employee fetched successfully", result });
        });
      }

    })

  }
  catch (error) {
    console.log('Something Wrong to inside the GetAttendenceList', error.message)
    res.status(502).send({
      success: false,
      message: 'Something Wrong to inside the GetAttendenceList',
      error: error.message
    })
  }
}


export const SetAttendence = async (req, res) => {

  try {
    const attendanceArray = req.body; // This should be an array of objects

    if (!Array.isArray(attendanceArray)) {
      console.log('attendanceArray is not an array');
      res.status(400).json({ message: 'Invalid attendance data: Not an array' });
      return;
    }
  
    const hasDate = attendanceArray.some(item => item.Date);
  
    if (!hasDate) {
      res.status(400).json({ message: 'Invalid attendance data: Missing Date' });
      return;
    }
  
  
    const sql = 'INSERT INTO hrattendence (attendence, EId,attendencedate) VALUES ?';
  
    // Prepare the data in the format required for the bulk insert
    const values = attendanceArray.map(record => [record.attendance, record.EId, record.Date]);
  
    // Use bulk insert for better performance
    db.query(sql, [values], (error, result) => {
      if (error) {
        console.log(error.message);
        return res.status(500).send({ success: false, message: "Invalid Request", error: error.message });
      }
      return res.status(200).send({ success: true, message: "Attendance inserted successfully", result });
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: "Something wrong in the SetAttendence"})
  } 
 
};

export const GenerateSalary = async (req, res) => {
  try {

  const { EId, advancepay, cca, ccaAmount, da, daAmount, hra, hraAmount, loan, medical,
    name, professionaltax, providentfund, salary, salmonth, ta, taAmount, totalamount } = req.body;
  const sql = `INSERT INTO hrgeneratedsalary (EId,advancepay,cca,ccaamount,da,daamount,hra,hraamount,loan,medical, 
  name,professionaltax,providentfund,basicsalary,salmonth,ta,taamount,totalamount,E_Date) 
  values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 
  ?, ?, ?, ?, ?, ?,?, ?,?)`

  const insertValue = [EId, advancepay, cca, ccaAmount, da, daAmount, hra, hraAmount, loan, medical,
    name, professionaltax, providentfund, salary, salmonth, ta, taAmount, totalamount, E_Date]
  db.query(sql, insertValue, (error, result) => {
    if (error) {
      console.log(error.message);
      return res.status(500).send({ success: false, message: "error in Generating Employee Salary", error: error.message })
    }
    return res.status(201).send({ success: true, message: "Salary Generated Successfuly", result })
  })
  } catch (error) {
    return res.status(500).send({ success: false, message: "Something wrong in the GetYearlySalary"})
  }
  
}

export const Checkvalidmonth = async (req, res) => {
  try {
    const { salmonth } = req.body;

  const sql = `SELECT salmonth FROM hrgeneratedsalary WHERE salmonth = ?`;
  const values = [salmonth];  // Correct format for using placeholders in SQL query

  db.query(sql, values, (error, result) => {
    if (error) {
      return res.status(500).send({ success: false, message: 'Error in fetching employee', error: error.message });
    }

    // Check if the salary month is already generated
    if (result.length > 0) {
      return res.status(200).send({ success: true, message: 'Salary already generated', result });
    } else {
      // Salary month is not generated yet
      return res.status(200).send({ success: false, message: 'Salary not generated for this month yet' });
    }
  });
  } catch (error) {
    return res.status(500).send({ success: false, message: "Something wrong in the GetYearlySalary"})
  }
  
};

export const ViewGenereatedSalary = async (req, res) => {
  try {
    const { salmonth } = req.body;
    console.log(req.body)
    const sql = `SELECT 
        he.EId,
        he.name,
        he.salary,
        hl.generatestatus,
        hl.totalamount
      FROM 
        hremployee he
      LEFT JOIN 
        hrgeneratedsalary hl ON he.EId = hl.EId
        AND FIND_IN_SET(?, hl.salmonth) > 0`
  
    const values = [salmonth];
  
    db.query(sql, values, (err, result) => {
      if (err) {
        return res.status(500).send({ success: false, message: 'error in Fetching Data', err: err.message })
      }
      else {
        return res.status(201).send({ success: true, message: 'Genereated salary fetched successflly', result })
      }
    })
  } catch (error) {
    return res.status(500).send({ success: false, message: "Something wrong in the ViewGeneratedSalary"})
  }
 
}

export const GeneratedSalary = async (req, res) => {
  try {
    const { month } = req.body;

    const sql = `SELECT * FROM hrgeneratedsalary WHERE salmonth=?`;
    const value = [month];

    db.query(sql, value, (err, result) => {
      if (err) {
        return res.status(500).send({ success: false, message: 'Server error. Please try again later.', err: err.message });
      }

      if (result.length === 0) {
        return res.status(404).send({ success: false, message: 'No data found for the selected month.' });
      }

      return res.status(200).send({ success: true, message: 'Generated Salary fetched successfully.', result });
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: "Something wrong in the GeneratedSalary"})
  }

};

export const PaidSalary = async (req, res) => {
  try {
    console.log(req.body);
    const { name, EId, totalamount, salmonth, paymentmode, paidamount, chequedate, chequeno, utramount, utrdate } = req.body;

    const sql = `INSERT INTO hrpaidsalary (name, EId, totalamount, salmonth, paymentmode, paidamount, chequedate, chequeno, utramount, utrdate,E_Date)
      VALUES( ?, ?, ?, ?, ?, ?, ?, ?, ?, ? ,?)`
    const insertValues = [name, EId, totalamount, salmonth, paymentmode, paidamount, chequedate, chequeno, utramount, utrdate, E_Date]

    db.query(sql, insertValues, (err, result) => {
      if (err) {
        return res.status(500).send({ success: false, message: `error in Inserting Data`, err: err.message, result })
      }
      if (result) {
        const sql = `UPDATE hrgeneratedsalary set  paidstatus=? WHERE EId=? AND salmonth=? `
        const paystatus = 1;
        const insertValue = [paystatus, EId, salmonth]
        db.query(sql, insertValue, (err, result) => {
          if (err) {
            return res.status(500).send({ success: false, message: `error in Updating salary `, err: err.message, result })
          }
          return res.status(201).send({ success: true, message: `Salary Paid Successfully` })
        })
      }
    })
  } catch (error) {
    return res.status(500).send({ success: false, message: "Something wrong in the PaidSalary" })
  }

}

export const GetMonthlySalary = async (req, res) => {
  try {
    const { month,EId } = req.body;

    let sql = ` SELECT 
     he.EId, he.name, he.department, he.salary, he.dateofjoining ,he.designation,
     hl.basicsalary, hl.salmonth, hl.hraamount, hl.daamount, hl.ccaamount, hl.taamount, hl.medical, hl.totalamount, hl.professionaltax	, hl.providentfund, hl.advancepay, hl.E_Date,
     hp.paidamount, hp.paymentmode,hp.salmonth
    FROM 
      hremployee he
    RIGHT JOIN
      hrgeneratedsalary hl ON he.EId=hl.EId

    RIGHT JOIN 
        hrpaidsalary hp ON hl.EId = hp.EId
    WHERE
       hp.salmonth=? AND hl.paidstatus=1 AND hl.salmonth=?
      `
    let values = [month,month]

    if (EId){
      sql+=`AND hl.EId =?`
      values.push(EId);

    }

    db.query(sql, values, (err, result) => {
      if (err) {
        return res.status(500).send({ success: false, message: 'error in fetching data', err: err.message })
      }
      else {
        return res.status(201).send({ success: true, message: "Data Fetched successfully", result })
      }
    })
  } catch (error) {
    return res.status(500).send({ success: false, message: "Something wrong in the GetMonthlySalary" })
  }

}

export const GetYearlySalary = async (req, res) => {
  try {
    let { year } = req.body;

    const sql = 'SELECT  EId, name, totalamount, paymentmode, salmonth, E_Date from hrpaidsalary where salmonth=? '
    const values = [year]

    db.query(sql, values, (err, result) => {
      if (err) {
        return res.status(500).send({ success: false, message: 'error in fetching data', err: err.message })
      }
      else {
        return res.status(201).send({ success: true, message: "Data Fetched successfully", result })
      }
    })
  } catch (error) {
    return res.status(500).send({ success: false, message: "Something wrong in the GetYearlySalary" })
  }

}
