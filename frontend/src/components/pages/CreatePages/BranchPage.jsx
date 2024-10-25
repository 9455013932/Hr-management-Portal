import React, { useEffect, useState } from 'react'
import AdminLayout from '../../Layout/AdminLayout'
import showToast from 'show-toast';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { RxCross2 } from "react-icons/rx";
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
const BranchPage = () => {
    const [Id, setId] = useState('')
    const [popUp, setPopUp] = useState(false)
    const [rotate, setRotate] = useState(false);
    const [changeValue, setchangeValue] = useState(false);
    const [allResult, setAllResult] = useState([])
    const uid = localStorage.getItem('uid')
    const [data, setData] = useState({
        BName: '',
        BPrefix: '',
        uid: '',
        BAddress: '',
        Bdistrict: '',
        BMNo: '',
        status: '1',
        user: uid || 'NA'
    })
    // create branch
    const handleSubmit = async (e) => {
        e.preventDefault()
        const pass = Math.floor(10000000 + Math.random() * 90000000);
        // console.log(password)
        const userType='Branch'
        try {
            const response = await axios.post('/api/v1/create-branch', { ...data, pass ,userType})
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
                    position: 'right',
                })
            }
        } catch (error) {
            showToast({
                str: 'Invalid user',
                time: 1000,
                position: 'bottom',
            })
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData({
            ...data,
            [name]: value
        })
    }
    const handleClick = () => {
        setPopUp(true)
    }
    // get all branch
    const accessData = async () => {
        try {

            const { data } = await axios.get('/api/v1/getAll-branch')
            if (data.success) {
                setAllResult(data.result)
            }

        } catch (error) {
            console.log('Error in getting all branch', error.message)
        }
    }
    useEffect(() => { accessData() }, [])

    // Edit data
    const handleEdit = (value) => {
        setchangeValue(true)
        setPopUp(prev => !prev)
        setId(value.Id)
        setData({
            BName: value.Name,
            BPrefix: value.BPrefix,
            uid: value.uid,
            BAddress: value.BAddress,
            Bdistrict: value.Bdistrict,
            BMNo: value.Mobile,
            status: value.status
        })
    }
    const handleUpdate = async (e) => {
        e.preventDefault()
        try {
            if (Id) {
                const response = await axios.put(`/api/v1/update-branch/${Id}`, data)
                if (response.data.success) {
                    showToast({
                        str: response.data.message,
                        time: 1000,
                        position: 'left',
                    })
                    setId('')
                    accessData()
                    setPopUp(prev => !prev)
                    setTimeout(() => {
                        window.location.reload()
                    }, 500)
                }
            }
            else {
                console.log("asdg")
            }
        } catch (error) {
            console.log('Error in updation')
        }
    }
    // delete data
    const handleDelete = async (value) => {
        const { Id } = value;
        try {
            const response = await axios.delete(`/api/v1/delete-branch/${Id}`);
            if (response.data.success) {
                showToast({
                    str: response.data.message,
                    time: 500,
                    position: 'bottom',
                })
                accessData()
            }
        } catch (error) {
            console.log('Error in deletion', error.message);
        }
    };


    return (
        <AdminLayout>
            <div className='w-full h-full bg-white shadow-2xl flex flex-col gap-5 branch relative'>
                <div className='h-14 flex  items-center sm:mx-12 mx-5 justify-between shadow  md:px-3 px-1'>
                    <p className='md:text-xl text-gray-400 font-semibold'>Create Branch</p>
                    <Link onClick={handleClick} className=' text-center text-sm  create px-2 py-1 shadow-md bg-blue-600 text-white hover:bg-blue-800 hover:border-2 cursor-pointer rounded-full' >Create New Branch</Link>
                </div>
                <div className='overflow-scroll w-full lg:h-[76.8vh] h-[73.4vh] ' style={{ boxShadow: '0 0 5px 2px #ddd' }}>
                    <table className='w-full userTable p-1'>
                        <thead>
                            <tr className=' px-1 sticky' style={{ background: '#3e3e3e', color: 'aliceblue' }}>
                                <th>Sr.</th>
                                <th>Branch Name</th>
                                <th>Branch Prefix</th>
                                <th>Branch Code</th>
                                <th>Branch Address</th>
                                <th>Branch District</th>
                                <th>Mobile No</th>
                                <th>Status</th>
                                <th>Created_at</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                allResult.map((item, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item.Name}</td>
                                        <td>{item.BPrefix}</td>
                                        <td>{item.uid}</td>
                                        <td>{item.BAddress}</td>
                                        <td>{item.Bdistrict}</td>
                                        <td>{item.Mobile}</td>
                                        <td>{item.status == '1' ? 'Unblock' : 'block'}</td>
                                        <td>{item.created_at.split('T')[0]}</td>
                                        <td className='flex gap-2'>
                                            <button className='p-2 shadow-md rounded-full  text-lg hover:bg-green-700  hover:border hover:shadow-md hover:shadow-green-600 text-white bg-green-800 ' onClick={() => handleEdit(item)}><MdEdit /></button>
                                            <button className='p-2 shadow-md rounded-full text-lg hover:bg-red-700 hover:border hover:shadow-md hover:shadow-red-600 text-white bg-red-800' onClick={() => handleDelete(item)}><MdDelete /></button>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
                {popUp && (
                    <form action="" onSubmit={changeValue ? handleUpdate : handleSubmit} style={{ zIndex: '100' }} className='absolute w-full top-14'>
                        <div className=' bg-white py-5 cust rounded flex flex-col relative sm:mx-24 mx-6 overflow-y-scroll h-[75vh] shadow-current shadow-sm  font-serif sm:px-16 px-5  gap-2 md:gap-8'>
                            <p className={`absolute top-4 right-4 text-xl transition-transform duration-300 ${rotate ? 'rotate-180' : ''
                                }`} onClick={() => {
                                    setTimeout(() => {
                                        setPopUp(false), setData({
                                            BName: '',
                                            BPrefix: '',
                                            uid: '',
                                            BAddress: '',
                                            Bdistrict: '',
                                            BMNo: '',
                                        })
                                    }, 200); setRotate(!rotate);
                                }}><RxCross2 />
                            </p>

                            <div className='flex flex-col md:flex-row gap-1 md:gap-3  border-b-2'>
                                <label htmlFor="name" className='whitespace-nowrap '>Branch Name  :</label>
                                <input type="text" name="BName" id="name" required value={data.BName} onChange={handleChange}
                                    className=' w-full outline-none px-2 py-1'  />
                            </div>

                            <div className='flex flex-col md:flex-row gap-1 md:gap-3  border-b-2'>
                                <label htmlFor="BPrefix" className='whitespace-nowrap'>Prefix :</label>
                                <input type="text" name="BPrefix" required value={data.BPrefix} id="BPrefix" onChange={handleChange}
                                    className='w-full outline-none px-2 py-1' />
                            </div>

                            <div className='flex flex-col md:flex-row gap-1 md:gap-3  border-b-2'>
                                <label htmlFor="uid" className='whitespace-nowrap'>Branch Code :</label>
                                <input type="text" name="uid" required id="uid" onChange={handleChange} value={data.uid}
                                    className='w-full outline-none px-2 py-1'  />
                            </div>

                            <div className='flex flex-col md:flex-row gap-1 md:gap-3  border-b-2'>
                                <label htmlFor="address" className='whitespace-nowrap'>Address :</label>
                                <input type='textarea' name="BAddress" requiredid="address" onChange={handleChange} value={data.BAddress}
                                    className='w-full outline-none px-2 py-1' />
                            </div>

                            <div className='flex flex-col md:flex-row gap-1 md:gap-3  border-b-2'>
                                <label htmlFor="district" className='whitespace-nowrap'>District :</label>
                                <input type="text" name="Bdistrict" required id="district" onChange={handleChange} value={data.Bdistrict}
                                    className='w-full outline-none px-2 py-1' />
                            </div>

                            <div className='flex flex-col md:flex-row gap-1 md:gap-3  border-b-2'>
                                <label htmlFor="BMNo" className='whitespace-nowrap'>Mobile No :</label>
                                <input type="text" name="BMNo" id="BMNo" maxLength={10} onChange={handleChange} value={data.BMNo}
                                    onKeyPress={(event) => {
                                        if (!/[0-9.]/.test(event.key)) {
                                            event.preventDefault();
                                        }
                                    }} className='  w-full  outline-none px-2 py-1'  />
                            </div>
                            {
                                changeValue && (<div className='flex flex-col md:flex-row gap-1 md:gap-3  border-b-2'>
                                    <label htmlFor="status" className='whitespace-nowrap'>Status :</label>
                                    <select name="status" id="" value={data.status} onChange={handleChange}>
                                        <option value="0">Block</option>
                                        <option value="1">Unblock</option>
                                    </select>
                                </div>)
                            }


                            <button type='submit' className='bg-blue-700 py-1 px-2 rounded text-white font-semibold'>{changeValue ? 'Save' : 'Submit'}</button>
                        </div>
                    </form>
                )}
            </div>
        </AdminLayout>
    )
}

export default BranchPage
