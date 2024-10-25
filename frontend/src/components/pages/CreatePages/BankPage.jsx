import React, { useEffect, useState } from 'react'
import AdminLayout from '../../Layout/AdminLayout.jsx'
import showToast from 'show-toast';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { RxCross2 } from "react-icons/rx";
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
const BankPage = () => {
    const [Id, setId] = useState('')
    const [popUp, setPopUp] = useState(false)
    const [changeValue, setchangeValue] = useState(false);
    const [rotate, setRotate] = useState(false);
    const [allResult, setAllResult] = useState([])
    const user = localStorage.getItem('uid')
    const [data, setData] = useState({
        BankName: '',
        BankBr: '',
        ACNo: '',
        IFSC: '',
        ACType: '',
        user: user || 'NA',
    })
    const handleChange = async (e) => {
        const { name, value } = e.target
        setData({
            ...data,
            [name]: value
        })
    }
    const handleClick = async () => { setPopUp(true) }

    // Create Bank function
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post('/api/v1/create-bank', data)
            if (response.data.success) {
                showToast({
                    str: response.data.message,
                    time: 500,
                    position: 'top',
                })
                setTimeout(() => {
                    window.location.reload()
                }, 1000)
            }
            else {
                showToast({
                    str: response.data.error,
                    time: 1000,
                    position: 'top',
                })
            }
        } catch (error) {
            showToast({
                str: 'Invalid user',
                time: 1000,
                position: 'top',
            })
        }

    }

    // accsss  data
    const accessData = async () => {
        try {
            const { data } = await axios.get('/api/v1/getall-bank')
            if (data.success) {
                setAllResult(data.result)
            }

        } catch (error) {
            console.log('Error in getting all branch', error.message)
        }
    }
    useEffect(() => { accessData() }, [])

    // Update Bank Function
    const handleEdit = (value) => {
        setchangeValue(true);
        setPopUp(true);
        setId(value.Id);
        setData({
            BankName: value.BankName,
            BankBr: value.BankBr,
            ACNo: value.ACNo,
            ACType: value.ACType,
            IFSC: value.IFSC,
            user: user || 'NA',
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`/api/v1/update-bank/${Id}`, data);
            if (response.data.success) {
                showToast({
                    str: response.data.message,
                    time: 1000,
                    position: 'top',
                });
                setId('');
                accessData();
                setPopUp(prev => !prev);
                // setTimeout(() => {
                //     window.location.reload();
                // }, 500);
            } else {
                console.log("Update failed");
            }
        } catch (error) {
            showToast({
                str: 'Invalid updation',
                time: 1000,
                position: 'left',
            });
        }
    };

    // delete data
    const handleDelete = async (value) => {
        const { Id } = value
        try {
            const { data } = await axios.delete(`/api/v1/delete-bank/${Id}`)
            showToast({
                str: data.message,
                time: 500,
                position: 'top',
            })
            accessData()
        } catch (error) {
            console.log(error.message)
        }
    }
    return (
        <AdminLayout>
            <div className='w-full h-full bg-white shadow-2xl flex flex-col gap-5 Bank relative'>
                <div className='h-14 flex  items-center sm:mx-12 mx-5 justify-between shadow  md:px-3 px-1'>
                    <p className='md:text-xl text-gray-400 font-semibold'>Create Bank</p>
                    <Link onClick={handleClick} className=' text-center text-sm  create px-2 py-1 shadow-md bg-blue-600 text-white hover:bg-blue-800 hover:border-2 cursor-pointer rounded-full' >Create New Bank</Link>
                </div>
                <div className='overflow-scroll w-full lg:h-[76.8vh] h-[73.4vh] ' style={{ boxShadow: '0 0 5px 2px #ddd' }}>
                    <table className='w-full userTable p-1'>
                        <thead>
                            <tr className=' px-1 sticky' style={{ background: '#3e3e3e', color: 'aliceblue' }}>
                                <th>Sr.</th>
                                <th>Bank Name</th>
                                <th>Bank Branch</th>
                                <th>Bank Account No</th>
                                <th>Bank IFSC Code</th>
                                <th>Account Type</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                allResult.map((item, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item.BankName || 'NA'}</td>
                                        <td>{item.BankBr || 'NA'}</td>
                                        <td>{item.ACNo || 'NA'}</td>
                                        <td>{item.IFSC || 'NA'}</td>
                                        <td>{item.ACType || 'NA'}</td>
                                        <td className='flex gap-2 items-center justify-center'>
                                            <button className='p-2 shadow-md rounded-full  text-lg hover:bg-green-700  hover:border hover:shadow-md hover:shadow-green-600 text-white bg-green-400 ' onClick={() => handleEdit(item)}><MdEdit /></button>
                                            <button className='p-2 shadow-md rounded-full text-lg hover:bg-red-700 hover:border hover:shadow-md hover:shadow-red-600 text-white bg-red-400' onClick={() => handleDelete(item)}><MdDelete /></button>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
                {popUp && (
                    <form action="" onSubmit={changeValue ? handleUpdate : handleSubmit} style={{ zIndex: '100' }} className='absolute w-full top-14'>
                        <div className=' bg-white py-5 rounded flex flex-col relative sm:mx-24 mx-6 overflow-y-scroll h-[65vh] shadow-current shadow-sm  font-serif sm:px-16 px-5  gap-2 md:gap-8'>

                            <p className={`absolute top-4 right-4 text-xl transition-transform duration-300 ${rotate ? 'rotate-180' : ''
                                }`} onClick={() => {
                                    setTimeout(() => { setPopUp(false) }, 200); setData({
                                        BankName: '',
                                        BankId: '',
                                        email: '',
                                        BankAddress: '',
                                        DoJ: '',
                                        BankMNo: '',
                                    }); setRotate(!rotate);
                                }}><RxCross2 />
                            </p>

                            <div className='flex flex-col md:flex-row gap-1 md:gap-3  border-b-2'>
                                <label htmlFor="name" className='whitespace-nowrap'>Bank Name :</label>
                                <input type="text" name="BankName" id="name" required value={data.BankName} onChange={handleChange}
                                    className='w-full outline-none px-2 py-1' placeholder='Enter Bank name... ' />
                            </div>

                            <div className='flex flex-col md:flex-row gap-1 md:gap-3  border-b-2'>
                                <label htmlFor="BPrefix" className='whitespace-nowrap'>Bank Branch :</label>
                                <input type="text" name="BankBr" required value={data.BankBr} id="BPrefix" onChange={handleChange}
                                    className='w-full outline-none px-2 py-1' placeholder='Enter Bank Branch... ' />
                            </div>

                            <div className='flex flex-col md:flex-row gap-1 md:gap-3  border-b-2'>
                                <label htmlFor="Bcode" className='whitespace-nowrap'>A/C No :</label>
                                <input type="text" name="ACNo" required id="Bcode" onChange={handleChange} value={data.ACNo} 
                                onKeyPress={(event) => {
                                    if (!/[0-9.]/.test(event.key)) {
                                        event.preventDefault();
                                    }
                                }}
                                    className='w-full outline-none px-2 py-1' placeholder='Enter Bank Account Number... ' />
                            </div>

                            <div className='flex flex-col md:flex-row gap-1 md:gap-3  border-b-2'>
                                <label htmlFor="address" className='whitespace-nowrap'>IFSC Code :</label>
                                <input type='text' name="IFSC" requiredid="address" onChange={handleChange} value={data.IFSC}
                                    className='w-full outline-none px-2 py-1' placeholder='Enter Bank IFSC Code... ' />
                            </div>

                            <div className='flex flex-col md:flex-row gap-1 md:gap-3  border-b-2'>
                                <label htmlFor="ACType" className='whitespace-nowrap'>Account Type :</label>
                                <select name="ACType" id="ACType" className='w-full outline-none px-2 py-1' value={data.ACType} onChange={handleChange}>
                                    <option value="">-- Select Account Type --</option>
                                    <option value="Saving Account">Saving Account</option>
                                    <option value="Current Account">Current Account</option>
                                </select>
                            </div>

                            {/* <div className='flex flex-col md:flex-row gap-1 md:gap-3  border-b-2'>
                                <label htmlFor="district" className='whitespace-nowrap'>Date of Joining :</label>
                                <input type="date" name="DoJ" required id="district" onChange={handleChange} value={data.DoJ}
                                    className='w-full outline-none px-2 py-1' placeholder='Enter joinging date... ' />
                            </div> */}
                            <button type='submit' className='bg-blue-700 py-1 px-2 rounded text-white font-semibold'>{changeValue ? 'Save' : 'Submit'}</button>
                        </div>
                    </form>
                )}
            </div>
        </AdminLayout>
    )
}

export default BankPage