import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HRLayout from '../../Layout/HRLayout';
import { RxCross2 } from 'react-icons/rx';  // Assuming this is the correct icon import
import showToast from 'show-toast'; // Assuming showToast is available
import moment from 'moment'
import { Link } from 'react-router-dom';
import { MdDelete, MdEdit } from "react-icons/md";

const Leave = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const [IntroCode, setIntroCode] = useState({ IntroCode: '' })
  const [introDucerCode, setintroDucerCode] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    EId: '',
    reason: '',
    ltype: '',
    startDate: '',
    endDate: '',
  });
  const [popUp, setPopUp] = useState(false);
  const [rotate, setRotate] = useState(false);
  const [searchLeave, setSearchLeave] = useState({
    startdate: '',
    enddate: '',
    EId: ''
  })
  const [allResult, setAllResult] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/v1/getallemployee');
        if (response.data.success) {
          setData(response.data.result);
        } else {
          console.error('Failed to fetch data:', response.data.message);
        }
        console.log(data)
      } catch (err) {
        console.log(err.message);
      }
    };

    // Call the async function
    fetchData();
  }, []);

  const handleChangeIntroCode = async (e) => {
    const intro = e.target.value
    setIntroCode({ IntroCode: intro })
    setSearchLeave(prevState => ({ ...prevState, EId: intro }));
    // console.log(intro)
    try {
      if (intro) {
        const { data } = await axios.post(`/api/v1/getallempid/${intro}`)
        if (data.success) {
          setintroDucerCode(data.result)
          console.log(data.result)
        }
      }
    } catch (error) {
      console.log(`something wrong ${error.message}`)
    }
  }


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));

  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/v1/employeeleave', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" }
      });
      if (response.ok) {
        const result = await response.json();
        showToast({
          str: result.message,
          time: 1000,
          position: 'top',
        });

        setPopUp(false);
        setFormData({
          Eid: '',
          name: '',
          reason: '',
          ltype: '',
          startDate: '',
          endDate: '',
        });
      } else {
        // If the response is not ok, log the status and response
        const error = await response.json();

        showToast({
          str: error.error,
          time: 1000,
          position: 'top',
        });
      }
    } catch (error) {
      // Log the network error
      console.error('Network error:', error);

      showToast({
        str: 'Network error: ' + error.message,
        time: 1000,
        position: 'top',
      });
    }
  };

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchLeave(prevState => ({ ...prevState, [name]: value }));

    // Filter the options based on the input value
    // const filtered = options.filter(option =>
    //   option.toLowerCase().includes(value.toLowerCase())
    // );
    // setFilteredOptions(filtered);
    // setShowDropdown(true); // Show dropdown when typing
  };
  const handleClick = () => {
    setPopUp(true);
    setRotate(false);
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/v1/getselectedleave', {
        method: 'POST',
        body: JSON.stringify(searchLeave),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();

        // Check if the result is an array and not empty
        if (Array.isArray(data.result) && data.result.length > 0) {
          setAllResult(data.result);
          showToast({
            str: data.message,
            time: 1000,
            position: 'top'
          });
        } else {
          // Handle case when the result is empty or not as expected
          showToast({
            str: 'No Data Found',
            time: 1000,
            position: 'top'
          });
          setAllResult([]); // Set an empty array if no data found
        }
      } else if (response.status === 404) {

        showToast({
          str: 'No Leave Found',
          time: 1000,
          position: 'top'
        });
        setAllResult([]); // Clear the result if no data found
      } else if (response.status === 400) {
        const error = await response.json();
        showToast({
          str: error.message,
          time: 1500,
          position: 'top'
        });
      }
      else {
        // Handle other types of errors
        const error = await response.json();
        console.error('Server error:', error);
        showToast({
          str: 'An error occurred while fetching data.',
          time: 1000,
          position: 'top'
        });
      }
    } catch (error) {
      console.error('Network error:', error);
      showToast({
        str: 'Network error. Please try again later.',
        time: 1000,
        position: 'top'
      });
    }
  };

  //  slect value in member id from sugggetion
  const handleIntro = async (value) => {
    if (!value) {
      // Clear both the IntroCode and EId fields
      setSearchLeave({
        ...searchLeave,
        Id: ''  // Assuming Id is meant to be EId in your state
      });
      setintroDucerCode([]); // Clear suggestions
      setIntroCode({ IntroCode: '' }); // Clear the intro code
      setPopUp(false);
    } else {
      // Set the selected value to both IntroCode and EId
      setSearchLeave({
        ...searchLeave,
        Id: value.EId  // Set the EId in the form state
      });
      setIntroCode({ IntroCode: value.EId });  // Set the IntroCode to EId
      setintroDucerCode([]); // Clear suggestions
      setPopUp(false);
    }
  };


  // Handle input changes
  const handleChangeEmpname = (e) => {

    const { name, value } = e.target;
    console.log(name, value);


    setFormData(prevState => ({ ...prevState, [name]: value }));

    if (name === 'EId') {
      const filtered = data.filter(el =>
        el.EId && el.EId.toString().toLowerCase().includes(value.toLowerCase())
      );
      setFilteredData(filtered);
      setShowDropdown(true);
    } else {
      setFilteredData([]);
      setShowDropdown(false);
    }
  };

  const handleSelectEmployee = (employee) => {
    setFormData(prevData => ({
      ...prevData,
      name: employee.name,
      EId: employee.EId
    }));
    setShowDropdown(false); // Hide dropdown
  };
  return (
    <HRLayout>
      <main className="w-full h-full bg-white shadow-2xl flex flex-col gap-5 HR relative">
        <div className='h-14 flex items-center sm:mx-12 mx-5 justify-between shadow md:px-3 px-1 mb-2'>
          <p className='md:text-xl text-gray-400 font-semibold'>Apply for Leave</p>
          <button onClick={handleClick} className='text-center text-sm create px-2 py-1 shadow-md bg-blue-600 text-white hover:bg-blue-800 hover:border-2 cursor-pointer rounded-full'>Apply Leave</button>
        </div>

        {popUp && (
          <form onSubmit={handleSubmit} style={{ zIndex: '100' }} className='absolute w-full top-14'>
            <div className='bg-white py-5 rounded flex flex-col relative sm:mx-24 mx-6 overflow-y-scroll h-[75vh] shadow-md font-serif sm:px-16 px-5 gap-2 md:gap-8'>
              <p
                className={`absolute top-4 right-4 text-xl transition-transform duration-300 ${rotate ? 'rotate-180' : ''}`}
                onClick={() => {
                  setPopUp(false);
                  setFormData({
                    name: '',
                    reason: '',
                    ltype: '',
                    startDate: '',
                    endDate: '',
                  });
                  setRotate(!rotate);
                }}
              >
                <RxCross2 />
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 md-5">
                <div className="mb-4 relative">
                  <label htmlFor="EId" className="block text-sm font-medium text-gray-700">
                    Employee Id:
                  </label>
                  <input
                    type="text"
                    name="EId"
                    id="EId"
                    placeholder="Employee Id"
                    value={formData.EId}
                    autoComplete="off"
                    onChange={handleChangeEmpname}
                    className="w-full outline-none px-2 py-1 border rounded-md"
                    onFocus={() => setShowDropdown(true)}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 150)} // Added to hide dropdown when clicking outside
                  />
                  {showDropdown && (
                    <ul className="absolute left-0 top-full mt-1 w-full bg-white shadow-md max-h-[35vh] overflow-y-auto border border-gray-300 z-50">
                      {filteredData.map((el, index) => (
                        <li
                          key={index}
                          className="px-2 py-1 cursor-pointer hover:bg-gray-200"
                          onClick={() => handleSelectEmployee(el)}
                        >
                          {el.EId} - {el.name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Leave Type</label>
                  <select
                    name="ltype"
                    value={formData.ltype}
                    onChange={handleChange}
                    className="px-2 mt-1 block w-full border-gray-300 rounded-md shadow-md"
                  >
                    <option value="">Select Leave Type</option>
                    <option value="Sick Leave">Sick Leave</option>
                    <option value="Casual Leave">Casual Leave</option>
                    <option value="Maternity Leave">Maternity Leave</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Reason</label>
                  <input
                    type="text"
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    className="px-2 mt-1 block w-full border-gray-300 rounded-md shadow-md"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="px-2 mt-1 block w-full border-gray-300 rounded-md shadow-md"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className="px-2 mt-1 block w-full border-gray-300 rounded-md shadow-md"
                  />
                </div>
              </div>

              <div className='flex w-full justify-center'>
                <button type="submit" className="w-32 text-center bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-800">Submit</button>
              </div>
            </div>
          </form>
        )}


        <div className="px-4 bg-gray-100">
          <div className='container  text-black'>
            <h1 className="text-1xl font-semibold my-4">Search Leave</h1>
          </div>

          <form onSubmit={handleSearchSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
              <div className="mb-4 relative">
                <label htmlFor="IntroCode" className="block text-sm font-medium text-gray-700">Employee Id:</label>
                <input
                  type="text"
                  name="IntroCode"
                  id="IntroCode"
                  value={IntroCode.IntroCode}
                  placeholder='Employee Id'
                  onChange={handleChangeIntroCode}
                  onBlur={() => setTimeout(() => setintroDucerCode(false), 150)}
                  onKeyPress={e => {
                    if (!/^[0-9]+$/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  className="w-full outline-none px-2 py-1 border rounded-md"
                />
                {introDucerCode && introDucerCode.length > 0 && (
                  <div className="absolute left-0 top-full mt-1 w-full bg-white shadow-md max-h-[35vh] overflow-y-auto border border-gray-300 z-50">
                    {introDucerCode.map((el, index) => (
                      <p
                        key={index}
                        className="px-2 py-1 cursor-pointer hover:bg-[#ddd]"
                        onClick={() => handleIntro(el)}
                      >
                        {el.EId} - {el.name}
                      </p>
                    ))}
                  </div>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Start Date:</label>
                <input
                  type="date"
                  name="startdate"
                  value={searchLeave.startdate}
                  onChange={handleSearchChange}
                  className="px-2 mt-1 block w-full border-gray-300 rounded-md shadow-md"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">End Date:</label>
                <input
                  type="date"
                  name="enddate"
                  value={searchLeave.enddate}
                  onChange={handleSearchChange}
                  className="px-2 mt-1 block w-full border-gray-300 rounded-md shadow-md"
                />
              </div>

              <div className="mb-4">
                <button type="submit" className="w-32 text-center bg-blue-600 text-white py-2 mt-4 rounded hover:bg-blue-800">
                  Submit
                </button>
              </div>
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
                <th>Leave Type</th>
                <th>Reason</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
                {/* <th>Action</th> */}
              </tr>
            </thead>
            <tbody>
              {
                (Array.isArray(allResult) ? allResult : []).map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.EId || 'NA'}</td>
                    <td>{item.name || 'NA'}</td>
                    <td>{item.leavetype || 'NA'}</td>
                    <td>{item.reason || 'NA'}</td>
                    <td>{moment(item.startdate, 'YYYY-MM-DD').format('LL') || 'NA'}</td>
                    <td>{moment(item.enddate, 'YYYY-MM-DD').format('LL') || 'NA'}</td>
                    <td>{item.status || 'NA'}</td>
                    {/* <td>{moment(item.E_Date, 'YYYY-MM-DD').format('LL') || 'NA'}</td>/ */}
                    {/* <td className='flex gap-2 items-center justify-center'>
                      <button className='p-2 shadow-md rounded-full  text-lg hover:bg-green-700  hover:border hover:shadow-md hover:shadow-green-600 text-white bg-green-700 ' onClick={() => handleEdit(item)}><MdEdit /></button>
                      <button className='p-2 shadow-md rounded-full text-lg hover:bg-red-700 hover:border hover:shadow-md hover:shadow-red-600 text-white bg-red-700' onClick={() => handleDelete(item)}><MdDelete /></button>
                    </td> */}
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </main>
    </HRLayout>
  );
};

export default Leave;
