import React, { useEffect, useState } from 'react'
import AdminLayout from '../../Layout/AdminLayout.jsx'
import showToast from 'show-toast';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { RxCross2 } from "react-icons/rx";
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";

const AdvanceComm = () => {
    const [Id, setId] = useState('')
    const [popUp, setPopUp] = useState(false)
    const [changeValue, setchangeValue] = useState(false);
    const [rotate, setRotate] = useState(false);
    const [allResult, setAllResult] = useState([])
    // const [date, setDate] = useState('')
    const [UTRDate, setUTRDate] = useState('')
    const [UTRNo, setUTRNo] = useState('')
    const user = localStorage.getItem('uid')
    const [data, setData] = useState({
        Excode: '',
        AdAmount: '',
        Paydate: '',
        PMode: '',
        user: user || 'NA'
    })
    const handleChange = async (e) => {
        const { name, value } = e.target
        setData({
            ...data,
            [name]: value
        })
    }
    const handleClick = async () => { setPopUp(true) }
    // Create AdCom function
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post('/api/v1/create-advance', { ...data, UTRDate: UTRDate || 'NA', UTRNo: UTRNo || 'NA' })
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

    // access data
    const accessData = async () => {
        try {
            const { data } = await axios.get('/api/v1/get-advance')
            if (data.success) {
                setAllResult(data.result)
            }
        } catch (error) {
            console.log('Error in getting all branch', error.message)
        }
    }
    useEffect(() => { accessData() }, [])

    // Update AdCom Function
    const handleEdit = (value) => {
        setchangeValue(true);
        setPopUp(true);
        setId(value.Id);
        setData({
            Excode: value.Excode,
            AdAmount: value.AdAmount,
            Paydate: value.Paydate,
            PMode: value.PMode,
            user: user || 'NA'
        });
        setUTRDate(value.UTRDate)
        setUTRNo(value.UTRNo)
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`/api/v1/update-advance/${Id}`, { ...data, UTRDate: UTRDate || 'NA', UTRNo: UTRNo || 'NA' });
            if (response.data.success) {
                showToast({
                    str: response.data.message,
                    time: 1000,
                    position: 'top',
                });
                setId('');
                accessData();
                setPopUp(prev => !prev);
                setTimeout(() => {
                    window.location.reload();
                }, 500);
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

    const handleDelete = async (value) => {
        const { Id } = value
        try {
            const { data } = await axios.delete(`/api/v1/delete-advance/${Id}`)
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
            <div className='w-full h-full bg-white shadow-2xl flex flex-col gap-5 AdCom relative'>
                <div className='h-14 flex  items-center sm:mx-12 mx-5 justify-between shadow  md:px-3 px-1'>
                    <p className='md:text-xl text-gray-400 font-semibold'>Create New Commission</p>
                    <Link onClick={handleClick} className=' text-center text-sm  create px-2 py-1 shadow-md bg-blue-600 text-white hover:bg-blue-800 hover:border-2 cursor-pointer rounded-full' >Create New Commission</Link>
                </div>
                <div className='overflow-scroll w-full lg:h-[76.8vh] h-[73.4vh] ' style={{ boxShadow: '0 0 5px 2px #ddd' }}>
                    <table className='w-full userTable p-1'>
                        <thead>
                            <tr className=' px-1 sticky' style={{ background: '#3e3e3e', color: 'aliceblue' }}>
                                <th>Sr.</th>
                                <th>Executive Code</th>
                                <th>Advance Amount</th>
                                <th>Payment Date</th>
                                <th>Payment Mode</th>
                                <th>UTR No</th>
                                <th>UTR Date</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                allResult.map((item, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item.Excode || 'NA'}</td>
                                        <td>{item.AdAmount || 'NA'}</td>
                                        <td>{item.Paydate || 'NA'}</td>
                                        <td>{item.PMode || 'NA'}</td>
                                        <td>{item.UTRNo || 'NA'}</td>
                                        <td>{item.UTRDate || 'NA'}</td>
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
                        <div className=' bg-white py-5 rounded flex flex-col relative sm:mx-24 mx-6 overflow-y-scroll h-[75vh] shadow-current shadow-sm  font-serif sm:px-16 px-5  gap-2 md:gap-8'>

                            <p className={`absolute top-4 right-4 text-xl transition-transform duration-300 ${rotate ? 'rotate-180' : ''
                                }`} onClick={() => {
                                    setTimeout(() => { setPopUp(false) }, 200); setData({
                                        Excode: '',
                                        AdAmount: '',
                                        Paydate: '',
                                        PMode: '',
                                        UTRDate: '',
                                        UTRNo: '',
                                    }); setRotate(!rotate);
                                }}><RxCross2 />
                            </p>

                            <div className='flex flex-col md:flex-row gap-1 md:gap-3  border-b-2'>
                                <label htmlFor="name" className='whitespace-nowrap'>Executive code :</label>
                                <input type="text" name="Excode" id="name" required value={data.Excode} onChange={handleChange}
                                    className='w-full outline-none px-2 py-1' placeholder='Enter Executive Code... ' />
                            </div>

                            <div className='flex flex-col md:flex-row gap-1 md:gap-3  border-b-2'>
                                <label htmlFor="BPrefix" className='whitespace-nowrap'>Advance Amount</label>
                                <input type="text" name="AdAmount" required value={data.AdAmount} id="BPrefix" onChange={handleChange}
                                    className='w-full outline-none px-2 py-1' placeholder='Enter Advance Amount... ' />
                            </div>

                            <div className='flex flex-col md:flex-row gap-1 md:gap-3  border-b-2'>
                                <label htmlFor="Bcode" className='whitespace-nowrap'>Payment Date:</label>
                                <input type="date" name="Paydate" required id="Bcode" onChange={handleChange} value={data.Paydate}
                                    className='w-full outline-none px-2 py-1 ' />
                            </div>

                            <div className='flex flex-col md:flex-row gap-1 md:gap-3  border-b-2'>
                                <label htmlFor="address" className='whitespace-nowrap'>Payment Mode :</label>
                                <select name="PMode" id="" className='w-full outline-none px-2 py-1' value={data.PMode} onChange={handleChange}>
                                    <option value="">-- Select Mode --</option>
                                    <option value="Cash">Cash</option>
                                    <option value="Online">Online</option>
                                </select>
                            </div>
                            {
                                data.PMode == 'Online' ? (
                                    <div className='flex flex-col  gap-1 md:gap-8 border-b-2'>
                                        <div className='flex flex-col md:flex-row gap-1 md:gap-3  border-b-2'>
                                            <label htmlFor="BMNo" className='whitespace-nowrap'>UTR No :</label>
                                            <input type="text" name="UTRNo" id="BMNo" onChange={(e) => setUTRNo(e.target.value)} value={UTRNo}
                                                className='  w-full  outline-none px-2 py-1' placeholder='Enter UTR number... ' />
                                        </div>

                                        <div className='flex flex-col md:flex-row gap-1 md:gap-3  border-b-2'>
                                            <label htmlFor="district" className='whitespace-nowrap'>UTR Date :</label>
                                            <input type="date" name="UTRDate" required id="district" onChange={(e) => setUTRDate(e.target.value)} value={UTRDate}
                                                className='w-full outline-none px-2 py-1' />
                                        </div>
                                    </div>
                                ) : ''
                            }
                            <button type='submit' className='bg-blue-700 py-1 px-2 rounded text-white font-semibold'>{changeValue ? 'Save' : 'Submit'}</button>
                        </div>
                    </form>
                )}
            </div>
        </AdminLayout>

    )
}

export default AdvanceComm