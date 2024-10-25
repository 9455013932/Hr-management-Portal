import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import showToast from 'show-toast';
import axios from 'axios';
import { RxCross2 } from "react-icons/rx";
import { MdDelete, MdEdit } from "react-icons/md";
import AdminLayout from '../../Layout/AdminLayout.jsx'
import moment from 'moment'

const ExpencePage = () => {
    const [Id, setId] = useState('');
    const [popUp, setPopUp] = useState(false);
    const [changeValue, setchangeValue] = useState(false);
    const [rotate, setRotate] = useState(false);
    const [allResult, setAllResult] = useState([]);
    const user = localStorage.getItem('uid');
    const [data, setvalues] = useState('')

    const handleChange = (e) => {
        const { name, value } = e.target
        setvalues({
            ...data,
            [name]: value
        })
    }
    // console.log(data)

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (data && user) {
                const formData = new FormData()
                formData.append('search', data.search)
                formData.append('user', user)
                const response = await axios.post('/api/v1/admin-create-expense', formData, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                if (response.data.success) {
                    showToast({
                        str: response.data.message
                    })
                    setPopUp(false);
                    setvalues()
                    setTimeout(() => {
                        window.location.reload()
                    }, 500);
                }
            }
        } catch (error) {
            console.log('Something Wrong', error.message)
        }
    };

    const handleClick = async () => { setPopUp(true) }

    // Update Rank Function
    const handleEdit = async (value) => {
        setPopUp(true);
        setchangeValue(true);
        setId(value.Id);
        setvalues({
            search: value.expense_name
        })
    }

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            if (Id) {
                const response = await axios.put(`/api/v1/admin-update-expense/${Id}`, data)
                if (response.data.success) {
                    showToast({
                        str: response.data.message,
                        time: 500
                    })
                    setPopUp(false);
                    setvalues()
                    accessData()
                }
            }

        } catch (error) {
            console.error('Something went wrong during the update:', error);
            showToast({ str: 'An error occurred while updating the Member' });
        }
    };

    // handle delete
    const handleDelete = async (value) => {
        const { Id } = value;
        try {
            const response = await axios.delete(`/api/v1/admin-expense-delete/${Id}`);
            if (response.data.success) {
                showToast({
                    str: response.data.message,
                    time: 500,
                    position: 'top',
                });
            }
            setId('')
            accessData();
        } catch (error) {
            console.error('Problem occurred during deletion', error);
        }
    };

    // get all data

    const accessData = async () => {
        try {
            const { data } = await axios.get('/api/v1/admin-get-expense')
            if (data.success) {
                setAllResult(data.result)
            }
        } catch (error) {
            console.log(error.message)
        }
    }
    useEffect(() => {
        accessData()
    }, [])
    // console.log(allResult)
    return (
        <AdminLayout>
            <div className='w-full h-full bg-white shadow-2xl flex flex-col gap-5 Project relative'>
                <div className='h-14 flex items-center sm:mx-12 mx-5 justify-between shadow md:px-3 px-1'>
                    <p className='md:text-xl text-gray-400 font-semibold '>Create Expense</p>
                    <Link onClick={handleClick} className='text-center text-sm create px-2 py-1 shadow-md bg-blue-600 text-white hover:bg-blue-800 hover:border-2 cursor-pointer rounded-full'>
                        Create New Expense
                    </Link>
                </div>
                <div className='overflow-scroll w-full lg:h-[76.8vh] h-[73.4vh]' style={{ boxShadow: '0 0 5px 2px #ddd' }}>
                    <table className='w-full userTable px-1'>
                        <thead>
                            <tr className='px-1 sticky' style={{ background: '#3e3e3e', color: 'aliceblue' }}>
                                <th>Sr No.</th>
                                <th>Expense_Name</th>
                                <th>Apply_Date</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                allResult && allResult.map((items, index) => (
                                    <tr key={items + index}>
                                        <td >{index + 1}</td>
                                        <td >{items.expense_name ?? 'Null'}</td>
                                        <td >{moment(items.E_Date).format('LL') ?? 'Null'}</td>
                                        <td className='flex gap-2 items-center justify-center my-1'>
                                            <button className='p-2 shadow-md rounded-full text-lg hover:bg-green-700 hover:border hover:shadow-md hover:shadow-green-600 text-white bg-green-600' onClick={() => handleEdit(items)}><MdEdit /></button>
                                            <button className='p-2 shadow-md rounded-full text-lg hover:bg-red-700 hover:border hover:shadow-md hover:shadow-red-600 text-white bg-red-600' onClick={() => handleDelete(items)}><MdDelete /></button>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
                {popUp && (
                    <form target='_blank' onSubmit={changeValue ? handleUpdate : handleSubmit} style={{ zIndex: '100' }} className='absolute w-full top-14'>

                        <div className='bg-white py-4   SADF rounded flex flex-col  relative sm:mx-24 mx-3 h-[15vh] shadow-current shadow-sm font-serif sm:px-4  gap-2 md:gap-6'>
                            <p className={`absolute top-4 right-4 text-xl transition-transform duration-300 ${rotate ? 'rotate-180' : ''}`} onClick={() => { setTimeout(() => { setPopUp(false) }, 200);  setRotate(!rotate); }}>
                                <RxCross2 />
                            </p>

                            <div className='flex mx-auto  gap-1 w-[46vw]  mt-5  items-center rounded-md  border-2'>
                                <label htmlFor="search" className='whitespace-nowrap bg-[#ddd]  md:px-3 w-[250px] md:w-[265px] py-1 shadow-md  md:font-bold text-gray-600 '>Expense Name</label>
                                <input type="text" name="search" id='search' value={data.search} onChange={handleChange}
                                    className='md:w-full w-[18vw] outline-none px-2  ' />
                                <button type='submit' className='bg-blue-700 py-1 px-1 md:px-3 rounded-md font-semibold  text-white'>{changeValue ? 'Save' : 'Submit'}</button>
                            </div>



                        </div>
                    </form>
                )}

            </div>
        </AdminLayout>
    )
}

export default ExpencePage