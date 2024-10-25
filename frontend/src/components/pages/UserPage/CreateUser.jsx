import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../Layout/AdminLayout.jsx';
import showToast from 'show-toast';
import axios from 'axios';
import { RxCross2 } from "react-icons/rx";
import { MdDelete, MdEdit } from "react-icons/md";
import moment from 'moment'
import searchGif from '../../../assets/createmenu/gif/target.gif'
const CreateUser = () => {
    const [id, setId] = useState('');
    const [popUp, setPopUp] = useState(false);
    const [changeValue, setChangeValue] = useState(false);
    const [rotate, setRotate] = useState(false);
    const [allResult, setAllResult] = useState([])
    const [search, setSearch] = useState('')
    const [openSearch, setOpenSearch] = useState(false);
    const user = localStorage.getItem('uid');
    const [data, setData] = useState({
        Password: '',
        mobile: '',
        email: '',
        Name: '',
        BCode: '',
        UserType: '',
        user: user || 'NA'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    // handle sumit data
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/v1/create-users_foruser', data);
            if (response.data.success) {
                showToast({ str: response.data.message });
            }
            setPopUp(false);
            accessData();
            setData('')
        } catch (error) {
            console.error('Invalid User', error);
        }
    };

    const handleClick = () => setPopUp(true);
    const accessData = async () => {
        try {
            const response = await axios.get('/api/v1/getuser-data');
            if (response.data.success) {
                setAllResult(response.data.result);
            }
        } catch (error) {
            console.error('Error accessing Users', error);
        }
    };

    useEffect(() => {
        accessData();
    }, []);

    const handleEdit = (value) => {
        setPopUp(true);
        setChangeValue(true);
        setId(value.Id);
        setData({
            Password: value.password,
            mobile: value.Mobile,
            email: value.email,
            Name: value.name,
            BCode: value.branchCode,
            UserType: value.userType,
            user: user || 'NA'
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`/api/v1/updateuser-data/${id}`, data);
            if (response.data.success) {
                showToast({ str: response.data.message });
            }
            setId('');
            setPopUp(false);
            accessData();
        } catch (error) {
            console.error('Error updating User', error);
        }
    };

    const handleDelete = async (value) => {
        const Id = value.Id;
        try {
            const response = await axios.delete(`/api/v1/delete_user_data/${Id}`);
            if (response.data.success) {
                showToast({
                    str: response.data.message,
                    time: 500,
                    position: 'top'
                });
            }
            accessData();
        } catch (error) {
            console.error('Error deleting User', error);
        }
    };

    // find data
    const findData = async (e) => {
        const value = e.target.value
        setSearch(value)
        try {
            const { data } = await axios.post(`/api/v1/find_data/${value}`)
            if (data.success) {
                setAllResult(data.result)
            }
        } catch (error) {
            console.log(error.message)
        }
    }

    return (
        <AdminLayout>
            <div className='w-full h-full bg-white shadow-2xl flex flex-col gap-5 User relative'>
                <div className='h-14 flex items-center sm:mx-12 mx-5 justify-between shadow md:px-3 px-1'>
                    <p className='md:text-xl text-gray-400 font-semibold'>Create User</p>
                    <Link onClick={handleClick} className='text-center text-sm create px-2 py-1 shadow-md bg-blue-600 text-white hover:bg-blue-800 hover:border-2 cursor-pointer rounded-full'>
                        Create New User
                    </Link>
                </div>
                <div className='overflow-scroll w-full lg:h-[76.8vh] h-[73.4vh]' style={{ boxShadow: '0 0 5px 2px #ddd' }}>
                    <table className='w-full userTable p-1'>
                        <thead>
                            <tr className='px-1 sticky' style={{ background: '#3e3e3e', color: 'aliceblue' }}>
                                <th>Sr.</th>
                                <th>User Id</th>
                                <th>Branch_Code</th>
                                <th>User Name</th>
                                <th>Email</th>
                                <th>Password</th>
                                <th>Mobile</th>
                                <th>User_Type</th>
                                <th>Status</th>
                                <th>User_Entry</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allResult.map((item, index) => (
                                <tr key={index}>
                                    <td>{index + 1 || 'NA'}</td>
                                    <td>{item.U_Id || 'NA'}</td>
                                    <td>{item.branchCode || 'NA'}</td>
                                    <td>{item.name || 'NA'}</td>
                                    <td>{item.email || 'NA'}</td>
                                    <td>{item.password}</td>
                                    <td>{item.Mobile || 'NA'}</td>
                                    <td>{item.userType || 'NA'}</td>
                                    <td>{item.status}</td>
                                    <td>{moment(item.E_Date.split('T')[0]).format('LL') || 'NA'}</td>
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
                        <div className='bg-white py-12 cust rounded flex flex-col relative sm:mx-24 mx-6 overflow-y-scroll h-[75vh] shadow-current shadow-sm font-serif sm:px-16 px-5 gap-2 md:gap-6'>
                            <p className={`absolute top-4 right-4 text-xl transition-transform duration-300 ${rotate ? 'rotate-180' : ''}`} onClick={() => { setTimeout(() => { setPopUp(false) }, 200); setRotate(!rotate); setData('') }}>
                                <RxCross2 />
                            </p>

                            <div className='flex flex-col md:flex-row gap-1 md:gap-3 border-b-2'>
                                <label htmlFor="Name" className='whitespace-nowrap'>Name :</label>
                                <input type="text" name="Name" required value={data.Name} id="Name" onChange={handleChange} className='w-full outline-none px-2 py-1' />
                            </div>

                            <div className='flex flex-col md:flex-row gap-1 md:gap-3 border-b-2'>
                                <label htmlFor="BCode" className='whitespace-nowrap'>Branch Code :</label>
                                <input type="text" name="BCode" required value={data.BCode} id="BCode" onChange={handleChange} className='w-full outline-none px-2 py-1' />
                            </div>

                            <div className='flex flex-col md:flex-row gap-1 md:gap-3 border-b-2'>
                                <label htmlFor="Password" className='whitespace-nowrap'>Password :</label>
                                <input type="text" name="Password" id="Password" required value={data.Password} onChange={handleChange} className='w-full outline-none px-2 py-1' />
                            </div>

                            <div className='flex flex-col md:flex-row gap-1 md:gap-3 border-b-2'>
                                <label htmlFor="mobile" className='whitespace-nowrap'>Mobile No :</label>
                                <input type="text" name="mobile" required value={data.mobile} id="mobile" onChange={handleChange} className='w-full outline-none px-2 py-1' />
                            </div>

                            <div className='flex flex-col md:flex-row gap-1 md:gap-3 border-b-2'>
                                <label htmlFor="email" className='whitespace-nowrap'>Email :</label>
                                <input type="text" name="email" required value={data.email} id="email" onChange={handleChange} className='w-full outline-none px-2 py-1' />
                            </div>

                            <div className='flex flex-col md:flex-row gap-1 md:gap-3 border-b-2'>
                                <label htmlFor="UserType" className='whitespace-nowrap'>User Type :</label>
                                <select name="UserType" id="UserType" value={data.UserType} className='w-full outline-none px-2 py-1' onChange={handleChange}>
                                    <option value="Branch Admin">Branch Admin</option>
                                    <option value="Operator">Operator</option>
                                    <option value="customer">customer</option>
                                    <option value="Associate">Associate</option>
                                </select>
                            </div>
                            <button type='submit' className='bg-blue-700 py-1 px-2 rounded text-white font-semibold'>{changeValue ? 'Save' : 'Submit'}</button>
                        </div>
                    </form>
                )}


                <div className='absolute -left-2 top-14 md:w-[23vw]'>
                    <div className={`w-10 h-10  rounded-full drop-shadow-lg ${openSearch ? 'hidden' : 'block'}`} onClick={() => setOpenSearch(true)}>
                        <img src={searchGif} className='rounded-full ' alt="" />
                    </div>
                    {openSearch && (
                        <div className='rounded-full border-2 flex items-center gap-2 py-1 px-2 bg-[#ddd] shadow-md'>
                            <input
                                name='content'
                                type="search"
                                className='rounded-full px-3 w-full  outline-none'
                                placeholder='Enter User Id...'
                                value={search.content}
                                onChange={findData}
                            />
                            <p onClick={() => setOpenSearch(false)} className='text-xl  text-black' ><RxCross2 className="font-bold" /></p>
                        </div>

                    )}
                </div>
            </div>
        </AdminLayout>
    )
}

export default CreateUser