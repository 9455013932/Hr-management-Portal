import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HRLayout from '../../Layout/HRLayout'
import { Link } from 'react-router-dom'
import { RxCross2 } from 'react-icons/rx';
import showToast from 'show-toast';
import { MdDelete, MdEdit } from 'react-icons/md';

const PaySalary = () => {

  const today = new Date()
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const monthNow = `${year}-${month}`

  const [formDate, setFormDate] = useState({
    month: '',

  })
  const [getEmpdata, setEmplData] = useState([]);
  const [formData, setFormData] = useState({
    name:'',
    EId:'',
    totalamount:'',
    salmonth: '',
    paymentmode: '',
    paidamount: '',
    chequedate: '',
    chequeno: '',
    utramount: '',
    utrdate: ''
  })
  const [popUp, setPopUp] = useState(false);
  const [rotate, setRotate] = useState(false);

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setFormDate(prevData => ({ ...prevData, [name]: value }))
  }

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }))
  }

  const handleDateSubmit = async (e) => {
    e.preventDefault();
  
    if (formDate.month === '') {
      return showToast({
        str: 'Please select a salary month',
        time: 1000,
        position: 'top',
      });
    }
  
    const monthNowNumber = Number(monthNow); // Ensure it's a number
    const formDateMonthNumber = Number(formDate.month); // Ensure it's a number
  
    if (monthNowNumber < formDateMonthNumber) {
      return showToast({
        str: 'Month cannot be greater than the current month',
        time: 1000,
        position: 'top',
      });
    }
  
    try {
      const response = await fetch('api/v1/generatedsalary', {
        method: 'POST',
        body: JSON.stringify(formDate),
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (response.ok) {
        const data = await response.json();
        
        if (data.result && data.result.length > 0) {
          setEmplData(data.result);
          showToast({
            str: data.message,
            time: 1000,
            position: 'top',
          });
        } else {
          setEmplData([]); // Clear the table data if no data is found
          showToast({
            str: 'No data found for the selected month.',
            time: 1000,
            position: 'top',
          });
        }
      } else {
        const error = await response.json();
        console.error('Server error:', response.status, error);
  
        showToast({
          str: error.message || 'An error occurred. Please try again later.',
          time: 1000,
          position: 'top',
        });
        setEmplData([]); // Clear the table data on server error
      }
    } catch (error) {
      console.error('Network error:', error);
  
      showToast({
        str: 'Network error. Please check your connection and try again.',
        time: 1000,
        position: 'top',
      });
      setEmplData([]); // Clear the table data on network error
    }
  };
  
  
  const handlePay = async (items) => {
    setPopUp(true);
    setRotate(false);
    setFormData({
      EId:items.EId,
      name:items.name,
      totalamount:items.totalamount,
      salmonth:items.salmonth
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('api/v1/paysalary', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" }
      }
      )
      if (response.ok) {
        const data = await response.json()
        showToast({
          str: data.message,
          time: 1000,
          position: 'top',
        });
        setPopUp(false);
        setFormData({});
        handleDateSubmit(e)
      }
      else {
        const error = await response.json();
        showToast({
          str: 'Server error: ' + error.message,
          time: 1000,
          position: 'top',
        });
      }
    } catch (error) {
      showToast({
        str: 'Pyament Submission Failed',
        time: 1000,
        position: 'top',
      });
    }
  }
  //   const value = e.target.value;
  //   setFormData(prevState => ({ ...prevState, EId: value }));
  //   if (value) {
  //     const filtered = data.filter(el =>
  //       el.EId.toString().includes(value)
  //     );
  //     setFilteredData(filtered);
  //     setShowDropdown(true);
  //   } else {
  //     setFilteredData([]);
  //     setShowDropdown(false);
  //   }
  // };
  // const handleSelectEmployee = (employee) => {
  //   setFormData(prevData => ({
  //     ...prevData,
  //     name: employee.name,
  //     EId: employee.EId
  //   }));
  //   setShowDropdown(false); // Hide dropdown
  // };

  return (
    <HRLayout>
      <main className="w-full h-full shadow-2xl flex flex-col gap-3 HR relative">
        <div className="h-14 flex items-center sm:mx-12 mx-5 justify-between shadow md:px-3 px-1 mb-2">
          <p className="md:text-xl text-gray-400 font-semibold ">Pay Salary System</p>
        </div>
        <div className='mt-2'>
          <form className='mx-12' onSubmit={handleDateSubmit}>
            <div className='mt-2'>
              <span>
                <label className='text-sm font-medium text-gray-700'>Select Month </label>
                <input
                  type='month'
                  className="px-2 mt-1 border-gray-700 rounded-md shadow-md"
                  name='month'
                  onChange={handleDateChange}
                  value={formDate.month}></input>
              </span>
              <span>
                <button type="submit"
                  className="w-25 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 mx-6 rounded-md"
                >Search</button>
              </span>
            </div>
          </form>
        </div>

        <div className='overflow-scroll w-full lg:h-[76.8vh] h-[73.4vh] ' style={{ boxShadow: '0 0 5px 2px #ddd' }}>
          <table className='w-full userTable p-1'>
            <thead>
              <tr className=' px-1 sticky' style={{ background: '#3e3e3e', color: 'aliceblue' }}>
                <th>Sr.No.</th>
                <th>Employee Id</th>
                <th>Name</th>
                <th>Basic Salary</th>
                <th>Total Amount</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {
                getEmpdata.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.EId || 'NA'}</td> 
                    <td>{item.name || 'NA'}</td>
                    <td>{item.basicsalary || 'NA'}</td>
                    <td>{item.totalamount || 'NA'}</td>
                    <td className='flex gap-2 items-center justify-center'>
                      
                      {item.paidstatus===0   &&(
                          <button className='p-2 shadow-md rounded-sm px-4 m-2 text-lg hover:bg-blue-700  hover:border hover:shadow-md hover:shadow-blue-600 text-white bg-blue-700 ' onClick={() => handlePay(item)}>Pay Salary</button>
                      )}

                      {item.paidstatus===1 &&(
                          <button className='p-2 shadow-md rounded-sm px-10 m-2 text-lg hover:bg-green-700  hover:border hover:shadow-md hover:shadow-green-600 text-white bg-green-700 ' readOnly>Paid</button>
                      )}

                      

                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>


        {popUp && (
          <form onSubmit={handleSubmit} style={{ zIndex: '100' }} className='absolute w-full top-14'>
            <div className=' bg-white py-5 rounded flex flex-col relative sm:mx-24 mx-6 overflow-y-scroll h-[75vh]  shadow-md font-serif sm:px-16 px-5 gap-2 md:gap-8'>
              <p
                className={`absolute top-4 right-4 text-xl transition-transform duration-300 ${rotate ? 'rotate-180' : ''}`}
                onClick={() => {
                  setTimeout(() => { setPopUp(false) }, 200);
                  setFormData({
                    salmonth: '',
                    EId: '',
                  });
                  setRotate(!rotate);
                }}
              >
                <RxCross2 />
              </p>

              <div className='container  text-black'>
                <h1 className="text-1xl font-semibold">Basic Details</h1>
                <hr ></hr>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md-5">

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Employee ID</label>
                  <input
                    type="text"
                    name="EId"
                    value={formData.EId}
                    readOnly
                    placeholder="Employee ID"
                    className="px-2 mt-1 block w-full border-gray-300 rounded-md shadow-md"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    readOnly
                    value={formData.name}
                    placeholder="Name"
                    className="px-2 mt-1 block w-full border-gray-300 rounded-md shadow-md"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Total Amount Generated</label>
                  <input
                    type="text"
                    name="salary"
                    readOnly
                    value={formData.totalamount}
                    placeholder="Salary"
                    className="px-2 mt-1 block w-full border-gray-300 rounded-md shadow-md"
                  />
                </div>
              </div>

              <div className='container  text-black'>
                <h1 className="text-1xl font-semibold">Payment Mode</h1>
                <hr className=''></hr>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 md-5">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Select Payment Mode</label>
                  <select
                    type="month"
                    name="paymentmode"
                    value={formData.paymentmode}
                    onChange={handleChange}
                    className="px-2 mt-1 block w-full border-gray-300 rounded-md shadow-md">
                    <option value="">Select payment Mode</option>
                    <option value="branch">Branch</option>
                    <option value="cheque">Cheque</option>
                    <option value="online">Online</option>
                  </select>

                  {formData.paymentmode && formData.paymentmode==='branch'&& (
                    <div className='flex'>
                    <div className='px-3 '>
                      <label className="mt-4 block text-sm font-medium text-gray-700" forhtml="chequeamount">Cash Amount:</label>
                      <input className="px-2 mt-1 border-gray-700 rounded-md shadow-md" type='text' value={formData.paidamount} onChange={handleChange} name='paidamount' />
                    </div>

                  </div>
                  )}                  
                  {
                    formData.paymentmode && formData.paymentmode==='online' && (
                        
                      <div className='flex'  >

                    <div className='px-3'>
                      <label className="mt-4 block text-sm font-medium text-gray-700">UTR :</label>
                      <input className="px-2 mt-1 border-gray-700 rounded-md shadow-md" type='text' value={formData.chequeno} onChange={handleChange} name='utrno' />
                    </div>
                    <div className='px-3'>
                      <label className="mt-4 block text-sm font-medium text-gray-700">UTR Date:</label>
                      <input className="px-2 mt-1 border-gray-700 rounded-md shadow-md" type='date' value={formData.utramount} onChange={handleChange} name='utrdate' />
                    </div>
                    <div className='px-3'>
                      <label className="mt-4 block text-sm font-medium text-gray-700">UTR Amount:</label>
                      <input className="px-2 mt-1 border-gray-700 rounded-md shadow-md" type='text' value={formData.paidamount} onChange={handleChange} name='paidamount' />
                    </div>
                  </div>

                    )}
                  {
                    formData.paymentmode && formData.paymentmode==="cheque" && (
                      <div className='flex'>
                      <div className='px-3'>
                        <label className="mt-4 block text-sm font-medium text-gray-700">Cheque No:</label>
                        <input className="px-2 mt-1 border-gray-700 rounded-md shadow-md" type='text' value={formData.chequeno} onChange={handleChange} name='chequeno' />
                      </div>
                      <div className='px-3'>
                        <label className="mt-4 block text-sm font-medium text-gray-700">Cheque Date:</label>
                        <input className="px-2 mt-1 border-gray-700 rounded-md shadow-md" type='date' value={formData.chequedate} onChange={handleChange} name='chequedate' />
                      </div>
                      <div className='px-3'>
                        <label className="mt-4 block text-sm font-medium text-gray-700">Cheque Amount:</label>
                        <input className="px-2 mt-1 border-gray-700 rounded-md shadow-md" type='text' value={formData.paidamount} onChange={handleChange} name='paidamount' />
                      </div>
  
                    </div>
                    )}
                </div>
              </div>
              <div className='flex w-full justify-center'>

                <button type="submit" className="w-32 text-center bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-800">Submit</button>
              </div>
            </div>
          </form>
        )}

      </main>
    </HRLayout>
  )
}

export default PaySalary


