import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HRLayout from '../../Layout/HRLayout';
import { Link } from 'react-router-dom';
import { RxCross2 } from 'react-icons/rx';
import showToast from 'show-toast';

const AddSalary = () => {

  const today = new Date()
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const monthNow = `${year}-${month}`

  const [getData, setData] = useState([]);
  const [getSalMonth, setSalaryMonth] = useState({ salmonth: "" })
  const [popUp, setPopUp] = useState(false);
  const [rotate, setRotate] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [formData, setFormData] = useState({
    name: '',
    salmonth: "",
    salary: '',
    EId: '',
    hra: '',
    da: '',
    cca: '',
    ta: '',
    medical: '',
    advancepay: '',
    professionaltax: '',
    loan: '',
    providentfund: '',
    totalamount: '',
  });
  const [viewData, setViewData] = useState([])
  const [leftButton, setLeftButton] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/v1/getemployee');
        if (response.data.success) {
          setData(response.data.result);
        } else {
          console.error('Failed to fetch data:', response.data.message);
        }
      } catch (err) {
        console.log(err.message);
      }
    };

    fetchData();
  }, []);

  const handleClick = async () => {
    if (getSalMonth.salmonth === '') {
      return showToast({
        str: 'Please select a salary month',
        time: 1000,
        position: 'top',
      });
    }
    if (monthNow < getSalMonth.salmonth) {
      return showToast({
        str: 'Month can not be greater than current month',
        time: 1000,
        position: 'top',
      });
    }
    else {
      try {
        const response = await fetch('/api/v1/checkvalidmonth', {
          method: 'POST',
          body: JSON.stringify(getSalMonth),
          headers: { 'Content-Type': 'application/json' },
        });

        const data = await response.json();

        if (response.ok && data.success) {
          // If salary month is already generated
          showToast({
            str: data.message,
            time: 1000,
            position: 'top',
          });
        } else {
          // If salary month is not generated, proceed with your logic
          setFormData((prevData) => ({ ...prevData, salmonth: getSalMonth.salmonth }));
          setPopUp(true);
          setRotate(false);
          

          if (getData.length > 0) {
            setFormData({
              salmonth: getSalMonth.salmonth,
              name: getData[0].name,
              EId: getData[0].EId,
              salary: getData[0].salary || '',
              hra: getData[0].hra || '',
              da: getData[0].da || '',
              cca: getData[0].cca || '',
              ta: getData[0].ta || '',
              medical: getData[0].medical || '',
              advancepay: getData[0].advancepay || '',
              professionaltax: getData[0].professionaltax || '',
              loan: getData[0].loan || '',
              providentfund: getData[0].providentfund || '',
            });
          }
        }
      } catch (error) {
        showToast({
          str: "Error in generating employee salary",
          time: 1000,
          position: 'top',
        });
      }
    }
  };

  const handleView = async () => {
    if (getSalMonth.salmonth === '') {
      return showToast({
        str: 'Please select a salary month',
        time: 1000,
        position: 'top',
      });
    }
    if (monthNow < getSalMonth.salmonth) {
      return showToast({
        str: 'Month can not be greater than current month',
        time: 1000,
        position: 'top',
      });
    }
    else {
      try {
        const response = await fetch('/api/v1/viewgenereatedsalary', {
          method: 'POST',
          body: JSON.stringify(getSalMonth),
          headers: { 'Content-Type': 'application/json' },
        });

        const data = await response.json();
        setViewData(data.result)



      } catch (error) {
        showToast({
          str: "Error in generating employee salary",
          time: 1000,
          position: 'top',
        });
      }
    }
  };
  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData(prevData => {
      const updatedData = { ...prevData, [name]: value };

      // Recalculate totalamount
      const salary = parseFloat(updatedData.salary) || 0;
      const hra = parseFloat(updatedData.hra) || 0;
      const da = parseFloat(updatedData.da) || 0;
      const cca = parseFloat(updatedData.cca) || 0;
      const ta = parseFloat(updatedData.ta) || 0;
      const medical = parseFloat(updatedData.medical) || 0;
      const providentfund = parseFloat(updatedData.providentfund) || 0;
      const professionaltax = parseFloat(updatedData.professionaltax) || 0;
      const loan = parseFloat(updatedData.loan) || 0;
      const advancepay = parseFloat(updatedData.advancepay) || 0;

      const hraAmount = (salary * hra) / 100;
      const daAmount = (salary * da) / 100;
      const ccaAmount = (salary * cca) / 100;
      const taAmount = (salary * ta) / 100;


      const totalAmount = salary + hraAmount + daAmount + ccaAmount + taAmount + medical - providentfund - professionaltax - loan - advancepay;

      return {
        ...updatedData,
        totalamount: totalAmount.toFixed(2),
        hraAmount: hraAmount.toFixed(2),
        daAmount: daAmount.toFixed(2),
        ccaAmount: ccaAmount.toFixed(2),
        taAmount: taAmount.toFixed(2),
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormData((prevData) => ({ ...prevData, salmonth: getSalMonth.salmonth }))
    console.log(formData)
    try {
      const response = await fetch('api/v1/generatesalary', {
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
        setFormData({});
        if(leftButton === true){
          setPopUp(false);
           handleView()
           setLeftButton(false)
        }
        handleView()
        loadNextEmployee();
        
      } else {
        const error = await response.json();
        console.error('Server error:', response.status, error);
        showToast({
          str: 'Server error: ' + error.message,
          time: 1000,
          position: 'top',
        });
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  const loadNextEmployee = () => {
    if (currentIndex + 1 < getData.length) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
      const nextEmployee = getData[currentIndex + 1];
      setFormData({
        salmonth: getSalMonth.salmonth,
        name: nextEmployee.name,
        EId: nextEmployee.EId,
        salary: nextEmployee.salary,
        hra: nextEmployee.hra || '',
        da: nextEmployee.da || '',
        cca: nextEmployee.cca || '',
        ta: nextEmployee.ta || '',
        medical: nextEmployee.medical || '',
        advancepay: nextEmployee.advancepay || '',
        professionaltax: nextEmployee.professionaltax || '',
        loan: nextEmployee.loan || '',
        providentfund: nextEmployee.providentfund || '',
      });
    } else {
      // All employees processed

      setPopUp(false);
      setCurrentIndex(0)
      setFormData()
      setSalaryMonth({ salmonth: '' })
      showToast({
        str: 'All employees processed.',
        time: 1000,
        position: 'top',
      });
    }
  };

  const handleleftemployeeClick = async (item) => {
    setLeftButton(true)
    try {
      // Find the matching data from getData based on EId
      const selectedData = getData.find(data => data.EId === item.EId);

      if (selectedData) {
        setFormData({
          salmonth: getSalMonth.salmonth,
          name: selectedData.name,
          EId: selectedData.EId,
          salary: selectedData.salary || '',
          hra: selectedData.hra || '',
          da: selectedData.da || '',
          cca: selectedData.cca || '',
          ta: selectedData.ta || '',
          medical: selectedData.medical || '',
          advancepay: selectedData.advancepay || '',
          professionaltax: selectedData.professionaltax || '',
          loan: selectedData.loan || '',
          providentfund: selectedData.providentfund || '',
        });
      } else {
        // Handle case where no matching data is found
        console.error("No matching data found for EId:", item.EId);
      }

      setPopUp(true);
      setRotate(false);
    } catch (error) {
      showToast({
        str: "Error in generating employee salary",
        time: 1000,
        position: 'top',
      });
    }
  };

  

  return (
    <HRLayout>
      <main className="w-full h-full shadow-2xl flex flex-col gap-5 HR relative">
        <div className="h-14 flex items-center sm:mx-8 mx-5 justify-between shadow md:px-3 px-1 mb-2">
          <div className="md:text-xl text-gray-400 font-semibold">Generate Salary</div>
        </div>
        <form className='attendence-form' onSubmit={handleSubmit}>
          <div className='mx-7'>
            <span>
              <label className='text-sm font-medium text-gray-700'>Select Date : </label>
              <input
                type='month'
                name='salmonth'
                required
                value={getSalMonth.salmonth}
                onChange={((e) => setSalaryMonth({ ...getSalMonth, salmonth: e.target.value }))}
                className="px-2 mt-1 border-gray-700 rounded-md shadow-md"
              />
            </span>
            <span>
              <Link onClick={handleClick} type="submit"
                className="w-25 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 mx-6 rounded-md"
              >Generate Salary</Link>
            </span>
            <span>
              <Link onClick={handleView} type="submit"
                className="w-25 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-6 mx-6 rounded-md"
              >View </Link>
            </span>
          </div>
        </form>

        {popUp && (
          <form style={{ zIndex: '100' }} className='absolute w-full top-14' onSubmit={handleSubmit}>
            <div className='bg-white py-5 rounded flex flex-col relative sm:mx-24 mx-6 overflow-y-scroll h-[75vh] shadow-md font-serif sm:px-16 px-5 gap-2 md:gap-4'>
              <p
                className={`absolute top-4 right-4 text-xl transition-transform duration-300 ${rotate ? 'rotate-180' : ''}`}
                onClick={() => {
                  setTimeout(() => { setPopUp(false) }, 200);
                  setFormData({
                    salmonth: '',
                    name: '',
                    EId: '',
                    salary: '',
                    hra: '',
                    da: '',
                    cca: '',
                    ta: '',
                    medical: '',
                    advancepay: '',
                    professionaltax: '',
                    loan: '',
                    providentfund: '',
                    totalamount: '',
                  });
                  setRotate(!rotate);
                }}
              >
                <RxCross2 />
              </p>
              <div className='container  text-black'>
                <h1 className="text-1xl font-semibold">Basic Details</h1>
                <hr className=''></hr>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md-5">

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Employee ID</label>
                  <input
                    type="text"
                    name="EId"
                    value={formData.EId}
                    readOnly
                    onChange={handleChange}
                    placeholder="Employee ID"
                    className="px-2 mt-1 block w-full border-gray-300 rounded-md shadow-md"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    readOnly
                    onChange={handleChange}
                    placeholder="Name"
                    className="px-2 mt-1 block w-full border-gray-300 rounded-md shadow-md"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Basic Salary</label>
                  <input
                    type="text"
                    name="salary"
                    value={formData.salary}
                    readOnly
                    onChange={handleChange}
                    placeholder="Salary"
                    className="px-2 mt-1 block w-full border-gray-300 rounded-md shadow-md"
                  />
                </div>
              </div>
              <div className='container  text-black'>
                <h1 className="text-1xl font-semibold">Salary Calculation</h1>
                <hr className=''></hr>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md-5">

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">HRA (%)</label>
                  <input
                    type="text"
                    name="hra"
                    value={formData.hra}
                    onChange={handleChange}
                    placeholder="HRA"
                    className="px-2 mt-1 block w-full border-gray-300 rounded-md shadow-md"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">DA (%)</label>
                  <input
                    type="text"
                    name="da"
                    value={formData.da}
                    onChange={handleChange}
                    placeholder="DA"
                    className="px-2 mt-1 block w-full border-gray-300 rounded-md shadow-md"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">CCA (%)</label>
                  <input
                    type="text"
                    name="cca"
                    value={formData.cca}
                    onChange={handleChange}
                    placeholder="CCA"
                    className="px-2 mt-1 block w-full border-gray-300 rounded-md shadow-md"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">TA (%)</label>
                  <input
                    type="text"
                    name="ta"
                    value={formData.ta}
                    onChange={handleChange}
                    placeholder="TA"
                    className="px-2 mt-1 block w-full border-gray-300 rounded-md shadow-md"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Medical</label>
                  <input
                    type="text"
                    name="medical"
                    value={formData.medical}
                    onChange={handleChange}
                    placeholder="Medical"
                    className="px-2 mt-1 block w-full border-gray-300 rounded-md shadow-md"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Provident Fund</label>
                  <input
                    type="text"
                    name="providentfund"
                    value={formData.providentfund}
                    onChange={handleChange}
                    placeholder="Provident Fund"
                    className="px-2 mt-1 block w-full border-gray-300 rounded-md shadow-md"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Professional Tax</label>
                  <input
                    type="text"
                    name="professionaltax"
                    value={formData.professionaltax}
                    onChange={handleChange}
                    placeholder="Professional Tax"
                    className="px-2 mt-1 block w-full border-gray-300 rounded-md shadow-md"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Advance Pay</label>
                  <input
                    type="text"
                    name="advancepay"
                    value={formData.advancepay}
                    onChange={handleChange}
                    placeholder="Advance Pay"
                    className="px-2 mt-1 block w-full border-gray-300 rounded-md shadow-md"
                  />
                </div>
              </div>

              <div className="mt-2">
                <h3 className="text-lg font-semibold">Salary Breakdown</h3>
                <hr className=''></hr>
                <div className="bg-gray-100 p-4 rounded-md shadow-md">
                  <p><strong>Basic Salary:</strong> {formData.salary}</p>
                  <p><strong>HRA:</strong> {formData.hraAmount}</p>
                  <p><strong>DA:</strong> {formData.daAmount}</p>
                  <p><strong>CCA:</strong> {formData.ccaAmount}</p>
                  <p><strong>TA:</strong> {formData.taAmount}</p>
                  <p><strong>Medical:</strong> {formData.medical}</p>
                  <p><strong>Provident Fund:</strong> {formData.providentfund}</p>
                  <p><strong>Professional Tax:</strong> {formData.professionaltax}</p>
                  <p><strong>Advance Pay:</strong> {formData.advancepay}</p>
                </div>

                <div className="mt-4">
                  <h3 className="text-lg font-semibold">Total Amount</h3>
                  <div className="bg-gray-100 p-4 rounded-md shadow-md">
                    <p><strong>Total Amount:</strong> {formData.totalamount}</p>
                  </div>
                </div>
              </div>

              <div>
                {/* Conditional rendering for buttons */}
                {leftButton === false ? (
                  <div className='flex justify-center'>
                    <button
                      type="submit"
                      className="m-4 text-center bg-blue-600 text-white py-2 px-8 rounded hover:bg-blue-800"
                    >
                      {currentIndex < getData.length - 1 ? 'Generate' : 'Finish'}
                    </button>

                    <button
                      type="button" // Changed to 'button' to prevent form submission
                      className="m-4 text-center bg-red-600 text-white py-2 px-4 rounded hover:bg-red-800"
                      onClick={loadNextEmployee}
                    >
                      Skip Employee
                    </button>
                  </div>
                ) : (
                  <div className='flex justify-center'>
                    <button
                      type="submit"
                      className="m-4 text-center bg-blue-600 text-white py-2 px-8 rounded hover:bg-blue-800"
                    >
                      Submit
                    </button>
                  </div>
                )}
              </div>
            </div>
          </form>
        )}

        <div className='overflow-scroll w-full lg:h-[76.8vh] h-[73.4vh] ' style={{ boxShadow: '0 0 5px 2px #ddd' }}>
          <table className='w-full userTable p-1'>
            <thead>
              <tr className=' px-1 sticky' style={{ background: '#3e3e3e', color: 'aliceblue' }}>
                <th>Sr.No.</th>
                <th>Employee Id</th>
                <th>Name</th>
                <th>Basic Salary</th>
                <th>Generated Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {
                viewData.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.EId || 'NA'}</td>
                    <td>{item.name || 'NA'}</td>
                    <td>{item.salary || 'NA'}</td>
                    <td>{item.totalamount || 'NA'}</td>
                    <td className='flex gap-2 items-center justify-center'>

                      {item.generatestatus === 1 && (
                        <button className='p-2 shadow-md rounded-sm px-4 m-2 text-lg hover:bg-green-700  hover:border hover:shadow-md hover:shadow-green-600 text-white bg-green-700 ' >Generated</button>

                      )}
                      {item.generatestatus === null && (
                        <button className='p-2 shadow-md rounded-sm px-4 m-2 text-lg hover:bg-blue-700  hover:border hover:shadow-md hover:shadow-blue-600 text-white bg-blue-700 ' onClick={() => handleleftemployeeClick(item)}>Generate Now</button>

                      )}

                    </td>
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

export default AddSalary;
