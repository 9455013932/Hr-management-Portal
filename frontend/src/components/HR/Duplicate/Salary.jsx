import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HRLayout from '../../Layout/HRLayout';
import showToast from 'show-toast';
import { RxCross2 } from 'react-icons/rx';
import { ToWords } from 'to-words'
import logo from '../../../assets/CompanyLogo.png'

const Salary = () => {
  const [getEmployee, setEmployee] = useState([]); //for useeffct to fet EId
  const [getParEmp, setParEmp] = useState([])  //set to list
  const [getEmpSlip, setEmpSlip] = useState({})   //set to popup
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [formData, setFormData] = useState({
    EId: '',
    month: '',
  });

  const [popUp, setPopUp] = useState(false)
  const [rotate, setRotate] = useState(false)

  const newAmoutInWords = new ToWords()

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    if (name === 'EId') {
      const filtered = getEmployee.filter((employee) =>
        employee.EId && employee.EId.toString().toLowerCase().includes(value.toLowerCase())
      );
      setFilteredEmployees(filtered);
      setShowDropdown(true);
    }else {
      setFilteredEmployees([]);
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/v1/getallemployee');
        if (response.data.success) {
          setEmployee(response.data.result);
        } else {
          console.error('Failed to fetch data:', response.data.message);
        }
      } catch (err) {
        console.log(err.message);
      }
    };

    fetchData();
  }, []);

  const handleSelect = (EId) => {
    setFormData((prevData) => ({ ...prevData, EId }));
    setShowDropdown(false); // Hide dropdown after selection
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
        
        // Assuming `data.result` is where the fetched data is stored
        const data = await response.json();
        if (data.success) {
          const result = data.result;

          if(result.length>0){

            const empData = Array.isArray(result) ? result : [result];
            showToast({ str: data.message, time: 1000, position: 'top'});
            setParEmp(empData);
          }else{
            showToast({ str: "no data found", time: 1000, position: 'top'});
            setParEmp([]);
          }
        }
      } else {
        const error = await response.json();
        showToast({
          str: 'Server error: ' + error.message,
          time: 1000,
          position: 'top',
        });
      }
    } catch (error) {
      showToast({
        str: 'Payment Submission Failed',
        time: 1000,
        position: 'top',
      });
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
          <p className="md:text-xl text-gray-400 font-semibold">Duplicate Pay Salary System</p>
        </div>
        <div className="mt-4 bg-gray-100 py-6 px-8 relative">
          <form className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12" onSubmit={handleSubmit}>
            <div>
              <label className="text-sm font-medium text-gray-700">Select Month And Year</label>
              <input
                type="month"
                required
                className="px-2 mt-1 border border-gray-300 rounded-md shadow-md w-full"
                name="month"
                onChange={handleChange}
                value={formData.month}
              />
            </div>
            <div className="relative">
              <label className="text-sm font-medium text-gray-700">Employee Id</label>
              <input
                type="text"
                className="px-2 mt-1 border border-gray-300 rounded-md shadow-md w-full"
                name="EId"
                required
                placeholder='Employee Id'
                onChange={handleChange}
                value={formData.EId}
                autoComplete="off"
              />
              {/* Dropdown for Employee Suggestions */}
              {showDropdown && filteredEmployees.length > 0 && (
                <ul className="absolute top-full left-0 border border-gray-300 mt-1 max-h-40 overflow-auto rounded-md shadow-md w-full bg-white z-10">
                  {filteredEmployees.map((employee) => (
                    <li
                      key={employee.EId}
                      className="p-2 cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSelect(employee.EId)}
                    >
                      {employee.EId} - {employee.name}
                    </li>
                  ))}
                </ul>
              )}
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


        <div className='overflow-scroll w-full lg:h-[76.8vh] h-[73.4vh] ' style={{ boxShadow: '0 0 5px 2px #ddd' }}>
          <table id="printable-table1" className='w-full userTable p-1'>
            <thead>
              <tr className=' px-1 sticky' style={{ background: '#3e3e3e', color: 'aliceblue' }}>
                <th>Sr.No.</th>
                <th>Employee Id</th>
                <th>Name</th>
                <th>Pament Mode</th>
                <th>Payment Amount</th>
                <th>Salary Slip</th>
              </tr>
            </thead>
            <tbody>
              {
                getParEmp.map((item, index) => (
                  <tr className='p-2 shadow-md rounded-sm px-4 m-2 text-lg' key={index}>
                    <td className='py-2'>{index + 1}</td>
                    <td>{item.EId || 'NA'}</td>
                    <td>{item.name || 'NA'}</td>
                    <td>{item.paymentmode || 'NA'}</td>
                    <td>{item.paidamount || 'NA'}</td>
                    <td className='flex gap-2 items-center justify-center'>
                      <button className='px-4 py-1 shadow-md rounded-md  text-lg hover:bg-green-700  hover:border hover:shadow-md hover:shadow-green-600 text-white bg-green-700 ' onClick={() => handleOnclick(item)} >Print</button>
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
                    <p className="text-lg m-1">Duplicate Salary Slip for the Month : {getEmpSlip.salmonth}</p>
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

                <div className='text-center'>THIS IS COMPUTER GENERATED PAY SLIP, HENCE NO NEED OF SIGNATURE</div>

                <div className='flex w-full justify-center mt-4'>
                  <button id="buttn" type="submit" className="w-32 text-center bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-800" onClick={handlePrintEmp}>Print</button>
                </div>

              </div>

            </div>


          </form>
        )}

      </main>
    </HRLayout>
  );
};

export default Salary;
