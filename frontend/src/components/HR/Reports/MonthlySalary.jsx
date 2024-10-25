import React, { useState, useEffect } from 'react';
import HRLayout from '../../Layout/HRLayout.jsx';
import showToast from 'show-toast';
import { mkConfig, generateCsv, download } from 'export-to-csv';
import { RxCross2 } from 'react-icons/rx';
import { ToWords } from 'to-words'
import logo from '../../../assets/CompanyLogo.png'

const MonthlySalary = () => {
  const [getEmployee, setEmployee] = useState([]);
  const [formData, setFormData] = useState({
    month: '',
  });
  const [popUp, setPopUp] = useState(false)
  const [rotate, setRotate] = useState(false)
  const [getEmpSlip, setEmpSlip] = useState({})
  const newAmoutInWords = new ToWords()
  // console.log(newAmoutInWords.convert(4))
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('api/v1/getmonthlysalary', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        const data = await response.json();
        showToast({
          str: data.message,
          time: 1000,
          position: 'top',
        });
        setEmployee(data.result)
      } else {
        const error = await response.json();
        showToast({
          str: `Server error: ${error.message}`,
          time: 1000,
          position: 'top',
        });
      }
    } catch (error) {
      showToast({
        str: `Payment Submission Failed: ${error.message}`,
        time: 1000,
        position: 'top',
      });
    }
  };

  const handlePrint = () => {
    // Get the table content
    const printContents = document.getElementById('printable-table1').outerHTML;

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
            .button1{
              display:none;
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
      "Payment Mode": row?.paymentmode || 'NA',
      "Generated Amount": row?.totalamount || 'NA',
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

  const handleOnclick = (value) => {
    setPopUp(true);
    setEmpSlip({
      EId: value.EId,
      advancepay: value.advancepay,
      basicsalary: value.basicsalary,
      ccaamount: value.ccaamount,
      daamount: value.daamount,
      dateofjoining: value.dateofjoining,
      department: value.department,
      designation: value.designation,
      hraamount: value.hraamount,
      medical: value.medical,
      name: value.name,
      paidamount: value.paidamount,
      totalamount: value.totalamount,
      paymentmode: value.paymentmode,
      professionaltax: value.professionaltax,
      providentfund: value.providentfund,
      salary: value.salary,
      salmonth: value.salmonth,
      taamount: value.taamount
    })
  }
  const handlePrintEmp = () => {
    // Get the table content
    const printContents = document.getElementById('printable-table2').outerHTML;

    // Open a new window
    const printWindow = window.open('', '', 'width=800,height=600');

    // Write the table content along with styles directly in the new window
    printWindow.document.write(`
      <html>
      <head>
      <title>Salary Slip</title>
      <style>
            body {
              font-family: sans-serif;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 800px;
              margin: auto;
              padding: 2rem;
            }
            .text-center {
              text-align: center;
            }
            .mb-6 {
              margin-bottom: 1.5rem;
            }
            .mx-auto {
              margin-left: auto;
              margin-right: auto;
            }
            .grid {
              display: grid;
            }
            .grid-cols-1 {
              grid-template-columns: 1fr;
            }
            .md\\:grid-cols-2 {
              grid-template-columns: repeat(2, minmax(0, 1fr));
            }
            .gap-1 {
              gap: 0.25rem;
            }
            .rounded-md {
              border-radius: 0.375rem;
            }
            .shadow-md {
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            }
            .border-stone-950 {
              border-color: #1C1917; /* Replace with appropriate stone-950 color */
            }
            .p-2 {
              padding: 0.5rem;
            }
            .p-1 {
              padding: 0.25rem;
            }
            .bg-gray-100 {
              background-color: #f3f4f6;
            }
            .font-semibold {
              font-weight: 600;
            }
            .w-full {
              width: 100%;
            }
            .m-1 {
              margin: 0.25rem;
            }
            .text-lg {
              font-size: 1.125rem;
            }
            .text-sm {
              font-size: 0.875rem;
            }
            .flex {
              display: flex;
            }
            .justify-center {
              justify-content: center;
            }
            .mt-4 {
              margin-top: 1rem;
            }
            .w-32 {
              width: 8rem;
            }
            .bg-blue-600 {
              background-color: #2563eb;
            }
            .text-white {
              color: white;
            }
            .py-2 {
              padding-top: 0.5rem;
              padding-bottom: 0.5rem;
            }
            .px-4 {
              padding-left: 1rem;
              padding-right: 1rem;
            }
            .rounded {
              border-radius: 0.375rem;
            }
            .hover\\:bg-blue-800:hover {
              background-color: #1e40af;
            }
            table {
            border: 1px solid;
            border-collapse:collapse;
             margin:5px 0;
              width: 100%;
            }
           thead tr td {
              border: 1px solid ;
              font-size:bold;
              text-align: left;
            }
            tbody tr td {
              border-right: 1px solid; 
            }
            #total{
              border: 1px solid; 
            }
            #buttn{
              display:none;
              }
            tfoot {
            border:1px solid ;
            }
          </style>
        </head>
        <body>
          ${printContents}
        </body>
      </html>
    `);

    // Close the document stream and focus on the new window
    printWindow.document.close();
    printWindow.focus();

    // Print the content
    printWindow.print();
  };



  return (
    <HRLayout>

      <main className="w-full h-full shadow-2xl flex flex-col gap-3 HR relative">
        <div className="h-14 flex items-center sm:mx-12 mx-5 justify-between shadow md:px-3 px-1 mb-2">
          <p className="md:text-xl text-gray-400 font-semibold">Monthly Salary</p>
        </div>
        <div className="mt-4 bg-gray-100 py-6 px-8 relative">
          <form className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12" onSubmit={handleSubmit}>
            <div>
              <label className="text-sm font-medium text-gray-700">Select Month</label>
              <input
                type="month"
                className="px-2 mt-1 border border-gray-300 rounded-md shadow-md w-full"
                name="month"
                onChange={handleChange}
                value={formData.month}
                required
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-2/3 bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 tracking-wider rounded-md"
              >
                View
              </button>
            </div>
          </form>
        </div>

        <div className='px-6 flex justify-end'>
          <button className='  border-2 shadow-md px-6 py-2 hover:bg-slate-700 bg-slate-500 text-white rounded-md m-1 font-semibold' onClick={handlePrint}>Print</button>
          <button className=' border-2 shadow-md px-6 py-2 hover:bg-slate-700 bg-slate-500 text-white rounded-md m-1  font-semibold' onClick={() => handleExport(getEmployee, 'csv')}>CSV</button>
        </div>

        <div className='overflow-scroll w-full lg:h-[76.8vh] h-[73.4vh] ' style={{ boxShadow: '0 0 5px 2px #ddd' }}>
          <table id="printable-table1" className='w-full userTable p-1'>
            <thead>
              <tr className=' px-1 sticky' style={{ background: '#3e3e3e', color: 'aliceblue' }}>
                <th>Sr.No.</th>
                <th>Employee Id</th>
                <th>Name</th>
                <th>Pament Mode</th>
                <th>Payment Amount</th>
                <th className='button1'> Salary Slip</th>
              </tr>
            </thead>
            <tbody>
              {
                getEmployee.map((item, index) => (
                  <tr className='p-2 shadow-md rounded-sm px-4 m-2 text-lg' key={index}>
                    <td className='py-2'>{index + 1}</td>
                    <td>{item.EId || 'NA'}</td>
                    <td>{item.name || 'NA'}</td>
                    <td>{item.paymentmode || 'NA'}</td>
                    <td>{item.paidamount || 'NA'}</td>
                    <td className='flex gap-2 items-center justify-center'>
                      <button className='button1 px-4 py-1 shadow-md rounded-md  text-lg hover:bg-green-700  hover:border hover:shadow-md hover:shadow-green-600 text-white bg-green-700 ' onClick={() => handleOnclick(item)} >Print</button>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>



        {popUp && (
          <form style={{ zIndex: '100' }} className='absolute w-full top-14' >
            <div className='bg-white py-5 rounded flex flex-col relative sm:mx-24 mx-6 overflow-y-auto h-[75vh] shadow-md font-serif sm:px-16 px-5 gap-2 md:gap-4'>
              <p
                className={`absolute top-4 right-4 text-xl transition-transform duration-300 ${rotate ? 'rotate-180' : ''}`}
                onClick={() => {
                  setTimeout(() => { setPopUp(false) }, 200);
                  setFormData({});
                  setRotate(!rotate);
                }}
                aria-label="Close form"
              >
                <RxCross2 />
              </p>

              <div id="printable-table2" >

                <div className="container mx-auto p-2">
                  {/* Header Section */}
                  <div className="text-center mb-6">
                    {/* <h2 className="text-2xl font-semibold">PURODHA INFRABUILD LLP.</h2> */}
                    <img src={logo} alt="" height={90} width={400} className='mx-auto' />
                    <p className="text-sm"> 118/90, near talk off the town, Gumti No.5,BR Kaushalpuri, Darshan Purwa,<br />  Kanpur, Uttar Pradesh 208012</p>
                    <p className="text-lg m-1">Salary Slip for the Month : {getEmpSlip.salmonth}</p>
                  </div>

                  {/* Employee Information Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-1">

                    <p ><span className=" font-semibold ">Employee Name: </span>{getEmpSlip.name || 'N/A'}</p>

                    <p ><span className="font-semibold">Employee ID: </span>{getEmpSlip.EId || 'N/A'}</p>

                    <p><span className="font-semibold">Designation: </span>{getEmpSlip.designation || 'N/A'}</p>

                    <p><span className="font-semibold">Date of Joining: </span>{getEmpSlip.dateofjoining || 'N/A'}</p>

                  </div>
                </div>

                <div className=" rounded-md shadow-md">
                  <table className='border border-stone-950 w-full p-2 bg-gray-100 '>
                    <thead>
                      <tr className='m-4 border-r-5 border-stone-950'>
                        <td className='font-semibold  border border-stone-950 p-2'>Earnings</td>
                        <td className='font-semibold  border border-stone-950 p-1'>Amount</td>
                        <td className='font-semibold  border border-stone-950 p-1'>Deduction</td>
                        <td className='font-semibold border border-stone-950  p-1'>Amount</td>
                      </tr>
                    </thead>
                    <tbody className='border border-stone-950 '>

                      <tr >
                        <td className='border-x border-stone-950 p-1'>Basic Salary</td>
                        <td className='border-x border-stone-950 p-1'> {getEmpSlip.salary}</td>
                        <td className='border-x border-stone-950 p-1'>Provident Fund</td>
                        <td className='p-1'>{getEmpSlip.providentfund}</td>
                      </tr>

                      <tr>
                        <td className='border-x border-stone-950 p-1'>HRA</td><td className='p-1'>{getEmpSlip.hraamount}</td>
                        <td className='border-x border-stone-950 p-1'>Professional Tax</td><td className='p-1'>{getEmpSlip.professionaltax}</td>
                      </tr>

                      <tr><td className='border-x border-stone-950 p-1'>CCA</td><td className='border-x border-stone-950 p-1'>{getEmpSlip.ccaamount}</td ><td className='border-x border-stone-950 p-1'>Advance Pay</td><td>{getEmpSlip.advancepay}</td></tr>
                      <tr><td className='border-x border-stone-950 p-1'>TA</td><td className='border-x border-stone-950 p-1'> {getEmpSlip.taamount}</td><td className='border-x border-stone-950'></td><td className=''></td></tr>
                      <tr><td className='border-x border-stone-950 p-1'> Medical </td><td className='border-x border-stone-950 p-1'>  {getEmpSlip.medical}</td><td className='border-x border-stone-950'></td><td className=''></td></tr>
                      <tr><td className='border-x border-stone-950 p-1'> DA</td><td className='border-x border-stone-950 p-1'>  {getEmpSlip.daamount}</td><td className='border-x border-stone-950'></td><td className=''></td></tr>
                      <tr id='total'><td className='border border-stone-950 p-1'> <strong>Total</strong></td> < td className='border border-stone-950 p-1'><strong>{parseInt(getEmpSlip.ccaamount) + parseInt(getEmpSlip.taamount) + parseInt(getEmpSlip.medical) + parseInt(getEmpSlip.daamount) + parseInt(getEmpSlip.hraamount) + parseInt(getEmpSlip.basicsalary)}</strong></td> <td className='border border-stone-950'><strong>Total</strong></td><td className='border border-stone-950'><strong>{parseInt(getEmpSlip.professionaltax) + parseInt(getEmpSlip.providentfund) + parseInt(getEmpSlip.advancepay)}</strong></td></tr>

                    </tbody>

                    <tfoot>
                      <tr><td className=' p-1'> <strong>Net Pay</strong></td><td className='p-1'>  <strong>{getEmpSlip.totalamount} </strong></td><td ></td><td ></td></tr>
                      <tr><td className=' p-1'> <strong>In Words</strong></td><td className='p-1'>{newAmoutInWords.convert(getEmpSlip.totalamount)} Only </td><td className=''></td><td className=''></td></tr>
                      <tr><td ></td><td ></td><td></td><td><strong>Signature</strong></td></tr>
                    </tfoot>
                  </table>
                </div>

                <div className='text-center m-1'>THIS IS COMPUTER GENERATED PAY SLIP, HENCE NO NEED OF SIGNATURE</div>

                <div className='flex w-full justify-center mt-4'>
                  <button id="buttn" type="submit" className="w-32 text-center bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-800" onClick={handlePrintEmp}>Submit</button>
                </div>

              </div>

            </div>


          </form>
        )}
      </main>
    </HRLayout>
  )
}

export default MonthlySalary