import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../Layout/AdminLayout';
import showToast from 'show-toast';
import axios from 'axios';
import { RxCross2 } from "react-icons/rx";
import { MdDelete, MdEdit } from "react-icons/md";

const ProjectPage = () => {
  const [id, setId] = useState('');
  const [grade, setGrade] = useState([]);
  const [popUp, setPopUp] = useState(false);
  const [changeValue, setChangeValue] = useState(false);
  const [rotate, setRotate] = useState(false);
  const [allResult, setAllResult] = useState([]);
  const user = localStorage.getItem('uid');
  const [data, setData] = useState({
    PSName: '',
    PNPre: '',
    SPNo: '',
    EPNo: '',
    PArea: '',
    PPrice: '',
    SPG: '',
    term: '',
    user: user || 'NA'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/v1/create-Project', data);
      if (response.data.success) {
        showToast({ str: response.data.message });
      }
      setPopUp(false);
      accessData();
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      console.error('Invalid Project', error);
    }
  };

  const handleClick = () => setPopUp(true);

  const accessData = async () => {
    try {
      const response = await axios.get('/api/v1/get-Project');
      if (response.data.success) {
        setAllResult(response.data.result);
      }
    } catch (error) {
      console.error('Error accessing projects', error);
    }
  };

  const fetchGrade = async () => {
    try {
      const response = await axios.get('/api/v1/get-grade');
      if (response.data.success) {
        setGrade(response.data.result);
      }
    } catch (error) {
      console.error('Error accessing grades', error);
    }
  };

  useEffect(() => {
    accessData();
    fetchGrade();
  }, []);

  const handleEdit = (value) => {
    setPopUp(true);
    setChangeValue(true);
    setId(value.Id);
    setData({
      PSName: value.projsite,
      PNPre: value.proprefix,
      SPNo: value.startpro,
      EPNo: value.endpro,
      PArea: value.proarea,
      PPrice: value.proprice,
      SPG: value.sitegrade,
      term: value.term,
      user: user || 'NA'
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`/api/v1/update-Project/${id}`, data);
      if (response.data.success) {
        showToast({ str: response.data.message });
      }
      setId('');
      setPopUp(false);
      accessData();
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      console.error('Error updating project', error);
    }
  };

  const handleDelete = async (value) => {
    const id = value.Id;
    try {
      const response = await axios.delete(`/api/v1/delete-Project/${id}`);
      if (response.data.success) {
        showToast({
          str: response.data.message,
          time: 500,
          position: 'top'
        });
      }
      accessData();
    } catch (error) {
      console.error('Error deleting project', error);
    }
  };

  return (
    <AdminLayout>
      <div className='w-full h-full bg-white shadow-2xl flex flex-col gap-5 Project relative'>
        <div className='h-14 flex items-center sm:mx-12 mx-5 justify-between shadow md:px-3 px-1'>
          <p className='md:text-xl text-gray-400 font-semibold'>Create Project</p>
          <Link onClick={handleClick} className='text-center text-sm create px-2 py-1 shadow-md bg-blue-600 text-white hover:bg-blue-800 hover:border-2 cursor-pointer rounded-full'>
            Create New Project
          </Link>
        </div>
        <div className='overflow-scroll w-full lg:h-[76.8vh] h-[73.4vh]' style={{ boxShadow: '0 0 5px 2px #ddd' }}>
          <table className='w-full userTable p-1'>
            <thead>
              <tr className='px-1 sticky' style={{ background: '#3e3e3e', color: 'aliceblue' }}>
                <th>Sr.</th>
                <th>Project Name</th>
                <th>Project Prefix</th>
                <th>Start Project No</th>
                <th>End Project No</th>
                <th>Project Area</th>
                <th>Project Price</th>
                <th>Project Grade</th>
                <th>Term (yr)</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {allResult.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1 || 'NA'}</td>
                  <td>{item.projsite || 'NA'}</td>
                  <td>{item.proprefix || 'NA'}</td>
                  <td>{item.startpro || 'NA'}</td>
                  <td>{item.endpro || 'NA'}</td>
                  <td>{item.proarea || 'NA'}</td>
                  <td>{item.proprice || 'NA'}</td>
                  <td>{item.sitegrade || 'NA'}</td>
                  <td>{item['Term(yr)'] || 'NA'}</td>


                  <td className='flex gap-2'>
                    <button className='p-2 translate-x-1 shadow-md rounded-full text-lg hover:bg-green-700 hover:border hover:shadow-md hover:shadow-green-600 text-white bg-green-400' onClick={() => handleEdit(item)}>
                      <MdEdit />
                    </button>
                    <button className='p-2 shadow-md rounded-full text-lg hover:bg-red-700 hover:border hover:shadow-md hover:shadow-red-600 text-white bg-red-400' onClick={() => handleDelete(item)}>
                      <MdDelete />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {popUp && (
          <form onSubmit={changeValue ? handleUpdate : handleSubmit} style={{ zIndex: '100' }} className='absolute w-full top-14'>
            <div className='bg-white cust py-12 rounded flex flex-col relative sm:mx-24 mx-6 overflow-y-scroll h-[75vh] shadow-current shadow-sm font-serif sm:px-16 px-5 gap-2 md:gap-6'>
              <p className={`absolute top-4 right-4 text-xl transition-transform duration-300 ${rotate ? 'rotate-180' : ''}`} onClick={() => { setTimeout(() => { setPopUp(false) }, 200); setRotate(!rotate); }}>
                <RxCross2 />
              </p>

              <div className='flex flex-col md:flex-row gap-1 md:gap-3 border-b-2'>
                <label htmlFor="PSName" className='whitespace-nowrap'>Project Site Name :</label>
                <input type="text" name="PSName" id="PSName" required value={data.PSName} onChange={handleChange} className='w-full outline-none px-2 py-1' />
              </div>

              <div className='flex flex-col md:flex-row gap-1 md:gap-3 border-b-2'>
                <label htmlFor="PNPre" className='whitespace-nowrap'>Project No. Prefix :</label>
                <input type="text" name="PNPre" required value={data.PNPre} id="PNPre" onChange={handleChange} className='w-full outline-none px-2 py-1' />
              </div>

              <div className='flex flex-col md:flex-row gap-1 md:gap-3 border-b-2'>
                <label htmlFor="SPNo" className='whitespace-nowrap'>Start Plot No :</label>
                <input type="text" name="SPNo" required value={data.SPNo} id="SPNo" onChange={handleChange} className='w-full outline-none px-2 py-1' />
              </div>

              <div className='flex flex-col md:flex-row gap-1 md:gap-3 border-b-2'>
                <label htmlFor="EPNo" className='whitespace-nowrap'>End Plot No :</label>
                <input type="text" name="EPNo" required value={data.EPNo} id="EPNo" onChange={handleChange} className='w-full outline-none px-2 py-1' />
              </div>

              <div className='flex flex-col md:flex-row gap-1 md:gap-3 border-b-2'>
                <label htmlFor="PArea" className='whitespace-nowrap'>Plot Area (Sq. Yard) :</label>
                <input type="text" name="PArea" required value={data.PArea} id="PArea" onChange={handleChange} className='w-full outline-none px-2 py-1' />
              </div>

              <div className='flex flex-col md:flex-row gap-1 md:gap-3 border-b-2'>
                <label htmlFor="PPrice" className='whitespace-nowrap'>Plot Price (per Sq. Yard):</label>
                <input type="text" name="PPrice" required value={data.PPrice} id="PPrice" onChange={handleChange} className='w-full outline-none px-2 py-1' placeholder='Enter Project Price' />
              </div>

              <div className='flex flex-col md:flex-row gap-1 md:gap-3 border-b-2'>
                <label htmlFor="term" className='whitespace-nowrap'>Term (yr):</label>
                <input type="text" name="term" required value={data.term} id="term" onChange={handleChange} className='w-full outline-none px-2 py-1' placeholder='Enter Project Price' />
              </div>

              <div className='flex flex-col md:flex-row gap-1 md:gap-3 border-b-2'>
                <label htmlFor="SPG" className='whitespace-nowrap'>Project Grade :</label>
                <select name="SPG" id="SPG" value={data.SPG} className='w-full outline-none px-2 py-1' onChange={handleChange}>
                  <option value="">-- Select Project Grade --</option>
                  {grade.map((item, index) => (
                    <option key={index} value={item.grade}>{item.grade}</option>
                  ))}
                </select>
              </div>

              <button type='submit' className='bg-blue-700 py-1 px-2 rounded text-white font-semibold'>{changeValue ? 'Save' : 'Submit'}</button>
            </div>
          </form>
        )}
      </div>
    </AdminLayout>
  );
};

export default ProjectPage;
