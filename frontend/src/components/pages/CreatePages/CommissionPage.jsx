import React, { useEffect, useState } from 'react';
import AdminLayout from '../../Layout/AdminLayout.jsx';
import showToast from 'show-toast';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { RxCross2 } from "react-icons/rx";
import { MdDelete, MdSave, MdEdit } from "react-icons/md";

const CommissionPage = () => {
  // const [Id, setId] = useState('');
  const [popUp, setPopUp] = useState(false);
  const [rotate, setRotate] = useState(false);
  const [allResult, setAllResult] = useState([]);
  const [allCommission, setAllCommission] = useState([]);
  const [data, setData] = useState({
    project: '',
  });

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };

  const handleClick = async () => {
    setPopUp(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/v1/access-commission', data);
      if (response.data.success) {
        setAllCommission(response.data.result);
        showToast({
          str: response.data.message,
          time: 500,
          position: 'top',
        });
        setPopUp(false);
      } else {
        showToast({
          str: response.data.error,
          time: 1000,
          position: 'top',
        });
      }
    } catch (error) {
      showToast({
        str: 'Invalid user',
        time: 1000,
        position: 'top',
      });
    }
  };

  const accessData = async () => {
    try {
      const { data } = await axios.get('/api/v1/get-commission');
      if (data.success) {
        setAllResult(data.result);
      }
    } catch (error) {
      console.log('Error in getting all branch', error.message);
    }
  };

  useEffect(() => {
    accessData();
  }, []);

  const handleEdit = (index) => {
    setAllCommission((prevState) =>
      prevState.map((item, i) =>
        i === index ? { ...item, isEditing: !item.isEditing } : item
      )
    );
  };

  const handleCommissionChange = (index, newValue) => {
    setAllCommission((prevState) =>
      prevState.map((item, i) =>
        i === index ? { ...item, commission: newValue } : item
      )
    );
  };

  const handleSave = async (index) => {
    const item = allCommission[index];
    console.log(item)
    try {
      const response = await axios.put(`/api/v1/update-commission/${item.Id}`, {
        commission: item.commission
      });
      if (response.data.success) {
        showToast({
          str: response.data.message,
          time: 500,
          position: 'top',
        });
        setAllCommission((prevState) =>
          prevState.map((itm, i) =>
            i === index ? { ...itm, isEditing: false } : itm
          )
        );
      } else {
        showToast({
          str: response.data.error,
          time: 1000,
          position: 'top',
        });
      }
    } catch (error) {
      showToast({
        str: 'Failed to update commission',
        time: 1000,
        position: 'top',
      });
    }
  };

  // handle delete
  const handleDelete = async (value) => {
    const {Id} = value;
    try {
      const response = await axios.delete(`/api/v1/delete-commission/${Id}`);
      if (response.data.success) {
        showToast({
          str: response.data.message,
          time: 500,
          position: 'top'
        });
      }
      handleSubmit()
      // accessData();
    } catch (error) {
      console.error('Error deleting project', error);
    }
  };

  return (
    <AdminLayout>
      <div className='w-full h-full bg-white shadow-2xl flex flex-col gap-5 Bank relative'>
        <div className='h-14 flex items-center sm:mx-12 mx-5 justify-between shadow md:px-3 px-1'>
          <p className='md:text-xl text-gray-400 font-semibold'>Select Project And Search</p>
          <Link
            onClick={handleClick}
            className='text-center text-sm create px-2 py-1 shadow-md bg-blue-600 text-white hover:bg-blue-800 hover:border-2 cursor-pointer rounded-full'
          >
            Check Commission
          </Link>
        </div>
        <div className='overflow-scroll w-full lg:h-[76.8vh] h-[73.4vh]' style={{ boxShadow: '0 0 5px 2px #ddd' }}>
          <table className='w-full userTable p-1'>
            <thead>
              <tr className='px-1 sticky' style={{ background: '#3e3e3e', color: 'aliceblue' }}>
                <th>Sr.</th>
                <th>Cader Name</th>
                <th>Commission %</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {allCommission.map((item, index) => (
                <tr key={index} className='hover:bg-slate-50'>
                  <td>{index + 1}</td>
                  <td>{item.cader || 'NA'}</td>
                  <td>
                    {item.isEditing ? (
                      <input
                        type='text'
                        className='w-full text-center border'
                        value={item.commission}
                        onChange={(e) => handleCommissionChange(index, e.target.value)}
                      />
                    ) : (
                      item.commission
                    )}
                  </td>
                  <td className='flex gap-2 items-center justify-center'>
                    {item.isEditing ? (
                      <button
                        className='p-2 shadow-md rounded-full text-lg hover:bg-green-700 hover:border hover:shadow-md hover:shadow-green-600 text-white bg-green-400'
                        onClick={() => handleSave(index)}
                      > <MdSave />
                      </button>
                    ) : (
                      <button
                        className='p-2 shadow-md rounded-full text-lg hover:bg-green-700 hover:border hover:shadow-md hover:shadow-green-600 text-white bg-green-400'
                        onClick={() => handleEdit(index)}
                      ><MdEdit />
                      </button>
                    )}
                    <button className='p-2 shadow-md rounded-full text-lg hover:bg-red-700 hover:border hover:shadow-md hover:shadow-red-600 text-white bg-red-600' onClick={() => handleDelete(item)}><MdDelete /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {popUp && (
          <form
            action=''
            onSubmit={handleSubmit}
            style={{ zIndex: '100' }}
            className='absolute w-full top-14'
          >
            <div className='bg-white py-8 rounded flex justify-between relative sm:mx-24 mx-6 h-[15vh] shadow-current shadow-sm pt-8 font-serif sm:px-16 px-5 gap-2 md:gap-8'>
              <p
                className={`absolute top-4 right-4 text-xl transition-transform duration-300 ${rotate ? 'rotate-180' : ''
                  }`}
                onClick={() => {
                  setTimeout(() => {
                    setPopUp(false);
                  }, 200);
                  setRotate(!rotate);
                }}
              >
                <RxCross2 />
              </p>
              <div className='flex flex-col md:flex-row gap-1 md:gap-3 border-b-2'>
                <select
                  name='project'
                  id='ACType'
                  className='w-[35vw] px-2'
                  value={data.project}
                  onChange={handleChange}
                >
                  <option value=''>Select Project</option>
                  {allResult &&
                    allResult.map((item, index) => (
                      <option key={index} value={item.P_Id}>
                        {item.projsite}
                      </option>
                    ))}
                </select>
              </div>
              <button type='submit' className='bg-blue-700 px-2 rounded text-white font-semibold'>
                Search
              </button>
            </div>
          </form>
        )}
      </div>
    </AdminLayout>
  );
};

export default CommissionPage;
