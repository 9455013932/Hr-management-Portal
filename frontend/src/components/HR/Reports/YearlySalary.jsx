import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HRLayout from '../../Layout/HRLayout';
import showToast from 'show-toast';


const YearlySalary = () => {
  const [getEmployee, setEmployee] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [formData, setFormData] = useState({
    year: '',
  });
  const [showDropdown, setShowDropdown] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    if (name === 'EId') {
      const filtered = getEmployee.filter((employee) =>
        employee.EId && employee.EId.toString().toLowerCase().includes(value.toLowerCase())
      );
      setFilteredEmployees(filtered);
      setShowDropdown(true);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/v1/getemployee');
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
      const response = await fetch('api/v1/getyearlysalary', {
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
        setFormData({ EId: '', month: '' });
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

  return (
    <HRLayout>
     <main className="w-full h-full shadow-2xl flex flex-col gap-3 HR relative">
        <div className="h-14 flex items-center sm:mx-12 mx-5 justify-between shadow md:px-3 px-1 mb-2">
          <p className="md:text-xl text-gray-400 font-semibold">Yearly Salary</p>
        </div>
        <div className="mt-4 bg-gray-100 py-6 px-8 relative">
          <form className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12" onSubmit={handleSubmit}>
            <div>
              <label for="year" className="text-sm font-medium text-gray-700">Select year</label>
              <input
               id="year" 
               type="number" 
               name="year" 
               min="1900" 
               max="2099" 
               step="1" 
               placeholder="YYYY" 
               required
               aria-label="Enter a year"
                className="px-2 mt-1 border border-gray-300 rounded-md shadow-md w-full"
                onChange={handleChange}
                
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
      </main>
    </HRLayout>
  )
}

export default YearlySalary