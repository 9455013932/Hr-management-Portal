import React, { useState } from 'react';
import HRLayout from '../../Layout/HRLayout';
import showToast from 'show-toast';

const Attendence = () => {
  const [formData, setFormData] = useState({ date: '' });
  const [getData, setData] = useState([]); // Ensure getData is initialized as an array
  const [attendanceData, setAttendanceData] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // console.log(formData);
      const response = await fetch('/api/v1/getattendencelist', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
       if(response.status=='200'){
        alert('Data Already Exist in Database')
       }
        const data = await response.json();
        
        // Check if data.result is an array
        if (Array.isArray(data.result)) {
          setData(data.result);

          // Initialize attendance data with 'Present' and corresponding EId
          const initializedAttendance = data.result.map((emp) => ({
            attendance: 'Present',
            EId: emp.EId,
          }));
          setAttendanceData(initializedAttendance);

          showToast({str:data.message,time:1000,position:'top'})
        } else {
          console.error("Unexpected API response: data.result is not an array");
          setData([]); // Clear data if the response is not an array
        }
      }
      else{
        const data = await response.json();
        showToast({
          str: data.error,
          time: 1000,
          position: 'top',
      });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));

  };

  const handleAttendanceChange = (index, value) => {
    const updatedAttendance = [...attendanceData];
    updatedAttendance[index].attendance = value;
    setAttendanceData(updatedAttendance);
  };

  const handleAttendanceSubmit = async (e) => {
    e.preventDefault();
    
    // Create a new attendance data array that includes the selected date
    const updatedAttendanceData = attendanceData.map((record) => ({
      ...record,
      Date: formData.date, // Add the selected date to each attendance record
    }));
  
    try {
      console.log("Submitting Attendance Data:", updatedAttendanceData);
      const response = await fetch('/api/v1/setattendence', {
        method: 'POST',
        body: JSON.stringify(updatedAttendanceData),
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (response.ok) {
        const data = await response.json();
        showToast({
          str: data.message,
          time: 1500,
          position: 'top',
      });
      setData([])
      setFormData([])
      setAttendanceData()
      }
      else{
        const data=await response.json()
        showToast({
          str: data.message,
          time: 1000,
          position: 'top',
      });
        
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  return (
    <HRLayout>
      <main className='bg-gray-50'>
        <div className='container py-2 pl-4 text-black '>
          <h1 className="text-2xl font-bold my-4">Add Employee Attendance</h1>
          <form className='attendence-form' onSubmit={handleSubmit}>
            <div className='m-4'>
              <span>
                <label>Select date : </label>
                <input
                  type='date'
                  name='date'
                  value={formData.date}
                  required
                  onChange={handleChange}
                />
              </span>
              <span className='p-4'>
                <button
                  type="submit"
                  className="w-25 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-md"
                >
                  Search
                </button>
              </span>
            </div>
          </form>
          <div className='w-full lg:h-[76.8vh] h-[73.4vh]' style={{ boxShadow: '0 0 5px 2px #ddd' }}>
            <form className='mt-2' onSubmit={handleAttendanceSubmit}>
              <table className="w-full userTable p-1">
                <thead>
                  <tr className="px-1 sticky" style={{ background: '#3e3e3e', color: 'aliceblue' }}>
                    <th className="p-2">Sr.No.</th>
                    <th className="p-2">Employee Id</th>
                    <th className="p-2">Name</th>
                    <th className="p-2">Attendance</th>
                    <th className="p-2">Leave Status</th>
                  </tr>
                </thead>
                <tbody className="p-8">
                  {getData.map((emp, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-2">{index + 1}</td>
                      <td className="p-2">{emp.EId || 'NA'}</td>
                      <td className="p-2">{emp.name || 'NA'}</td>
                      <td className="p-2">
                        {["Present", "Absent", "On Leave"].map((status) => (
                          <label key={status} className="inline-flex items-center p-1">
                            <input
                              type="radio"
                              value={status}
                              checked={attendanceData[index]?.attendance === status}
                              onChange={(e) => handleAttendanceChange(index, e.target.value)}
                              className="mr-1"
                            />
                            {status}
                          </label>
                        ))}
                      </td>
                      <td className="p-2">{emp.status || 'NA'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <button type='submit' className="mt-4 w-25 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-md">Submit Attendance</button>
            </form>
          </div>
        </div>
      </main>
    </HRLayout>
  );
};

export default Attendence;
