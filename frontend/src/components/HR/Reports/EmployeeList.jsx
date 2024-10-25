import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HRLayout from '../../Layout/HRLayout.jsx';
import moment from 'moment'
import { mkConfig, generateCsv, download } from 'export-to-csv';


const EmployeeList = () => {
  const [allResult, setAllResult] = useState([])
  const accessData = async () => {
    try {
      const { data } = await axios.get('/api/v1/getallemployee')
      if (data.success) {
        setAllResult(data.result)
      }

    } catch (error) {
      console.log('Error in getting all Employee', error.message)
    }
  }
  useEffect(() => { accessData() }, [])

  const handlePrint = () => {
    // Get the table content
    const printContents = document.getElementById('printable-table').outerHTML;

    // Open a new window
    const printWindow = window.open('', '', 'width=800,height=600');

    // Write the table content along with styles directly in the new window
    printWindow.document.write(`
    <html>
      <head>
        <title>Print Table</title>
        <style>
          /* Include the necessary styles directly */
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #3e3e3e;
            color: aliceblue;
          }
          tr {
            page-break-inside: avoid;
          }
        </style>
      </head>
      <body onload="window.print();window.close()">
        ${printContents}
      </body>
    </html>
  `);

    // Close the document stream and focus on the new window
    printWindow.document.close();
    printWindow.focus();
  };

  const csvConfig = mkConfig({
    fieldSeparator: ',',   
    decimalSeparator: ',',  
    useKeysAsHeaders: true,
  });
  


  const handleExport = (rows, format) => {
    if (rows.length === 0) {
      showToast({ str: 'No data to export', time: 1000, position: 'top' });
      return;
    }
  
    const exportData = rows.map((row, index) => ({
      "S.No": index + 1,
      "Employee Id": row?.EId || 'NA',
      'Name': row?.name || 'NA',
      "Department": row?.department || 'NA',
      "Designation": row?.designation || 'NA',
      "Basic Salary": row?.salary || 'NA',
      "Mobile": row?.mobile || 'NA',
      "Address": row?.address || 'NA',
      "E-mail": row?.email || 'NA',
      "Date of Joining": row?.dateofjoining || 'NA',
    }));
  
    if (format === 'csv') {
      // Generate CSV data
      const csv = generateCsv(csvConfig)(exportData);
  
      // Create a Blob object
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  
      // Create a link element
      const link = document.createElement('a');
  
      // Set the href attribute to a URL representing the Blob object
      if (link.download !== undefined) { // feature detection
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'monthly_salary_report.csv'); // Set your custom filename here
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  };
  

  return (
    <HRLayout>
      <main className="w-full h-full bg-white shadow-2xl flex flex-col gap-5 HR relative">

        <div className='h-14 flex items-center sm:mx-12 mx-5 justify-between shadow md:px-3 px-1 mb-2'>
          <p className='md:text-xl text-gray-400 font-semibold'>Employee List</p>
        </div>

        <div className='px-6 flex justify-end'>
          <button className='  border-2 shadow-md px-6 py-2 hover:bg-slate-700 bg-slate-500 text-white rounded-md m-1 font-semibold' onClick={handlePrint}>Print</button>
          <button className=' border-2 shadow-md px-6 py-2 hover:bg-slate-700 bg-slate-500 text-white rounded-md m-1  font-semibold' onClick={()=>handleExport(allResult,'csv')}>CSV</button>
        </div>

        <div className='overflow-scroll w-full lg:h-[76.8vh] h-[73.4vh]' style={{ boxShadow: '0 0 5px 2px #ddd' }}>
          <table className='w-full border border-gray-300 border-collapse' id='printable-table'>
            <thead>
              <tr className='bg-gray-800 text-white border border-gray-300'>
                <th className='py-1 px-2 border border-gray-300'>Sr.No.</th>
                <th className='py-1 px-2 border border-gray-300'>Employee Id</th>
                <th className='py-1 px-2 border border-gray-300'>Name</th>
                <th className='py-1 px-2 border border-gray-300'>Department</th>
                <th className='py-1 px-2 border border-gray-300'>Designation</th>
                <th className='py-1 px-2 border border-gray-300'>Basic Salary</th>
                <th className='py-1 px-2 border border-gray-300'>Mobile</th>
                <th className='py-1 px-2 border border-gray-300'>Address</th>
                <th className='py-1 px-2 border border-gray-300'>E-mail</th>
                <th className='py-1 px-2 border border-gray-300'>Date of Joining</th>
              </tr>
            </thead>
            <tbody>
              {
                allResult.map((item, index) => (
                  <tr className='bg-white text-black border border-gray-300' key={index}>
                    <td className='py-1 px-2 border border-gray-300'>{index + 1}</td>
                    <td className='py-1 px-2 border border-gray-300'>{item.EId || 'NA'}</td>
                    <td className='py-1 px-2 border border-gray-300'>{item.name || 'NA'}</td>
                    <td className='py-1 px-2 border border-gray-300'>{item.department || 'NA'}</td>
                    <td className='py-1 px-2 border border-gray-300'>{item.designation || 'NA'}</td>
                    <td className='py-1 px-2 border border-gray-300'>{item.salary || 'NA'}</td>
                    <td className='py-1 px-2 border border-gray-300'>{item.mobile || 'NA'}</td>
                    <td className='py-1 px-2 border border-gray-300'>{item.address || 'NA'}</td>
                    <td className='py-1 px-2 border border-gray-300'>{item.email || 'NA'}</td>
                    <td className='py-1 px-2 border border-gray-300'>{moment(item.dateofjoining, 'YYYY-MM-DD').format('LL') || 'NA'}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>



      </main>
    </HRLayout>
  )
}

export default EmployeeList