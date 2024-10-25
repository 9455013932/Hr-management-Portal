
import AdminLayout from '../../Layout/AdminLayout'
import React, { useEffect, useState } from 'react'
import showToast from 'show-toast';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { RxCross2 } from "react-icons/rx";
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";

const RankPage = () => {
    const [Id, setId] = useState('')
    const [popUp, setPopUp] = useState(false)
    const [changeValue, setchangeValue] = useState(false);
    const [rotate, setRotate] = useState(false);
    const [allResult, setAllResult] = useState([])
    const [data, setData] = useState({
        cader: '',
        target: '',
        commission: '',
        salary: '',
        // project: ''
    })
    const handleChange = async (e) => {
        const { name, value } = e.target
        setData({
            ...data,
            [name]: value
        })
    }


    const acessData = async () => {
        try {
            const response = await axios.get('/api/v1/get-rank')
            if (response.data.success) {
                setAllResult(response.data.result)
            }
        } catch (error) {
            console.log('Something wrong during access rank')
        }
    }
    useEffect(() => {
        acessData()
    }, []);


    // Create Rank function
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post('/api/v1/create-rank', data)
            if (response.data.success) {
                showToast({
                    str: response.data.message,
                    duration: 1000
                })
            }
            setPopUp(false)
            setData({
                cader: '',
                target: '',
                commission: '',
                salary: '',
            })
            acessData()
        } catch (error) {
            console.log('Invalid Rank')
        }

    }
    const handleClick = async () => { setPopUp(true) }
    //   get ranks
   
    // Update Rank Function
    const handleEdit = (value) => {
        setPopUp(true);
        setchangeValue(true)
        setId(value.Id)
        setData({
            cader: value.cader,
            target: value.target,
            commission: value.commission,
            salary: value.salary || '00',
        })

    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`/api/v1/update-rank/${Id}`, data)
            if (response.data.success) {
                showToast({
                    str: response.data.message
                })
            }
            setId('');
            setPopUp(false);
            acessData()
        } catch (error) {
            console.log('Something wrong during update rank')
        }
    }

    // handle delete
    const handleDelete = async (value) => {
        const { Id } = value
        try {
            const response = await axios.delete(`/api/v1/delete-rank/${Id}`)
            if (response.data.success) {
                showToast({
                    str: response.data.message,
                    time: 500,
                    position: 'top',
                })
            }
            acessData()

        } catch (error) {
            console.log('Problem occur during deletion')
        }
    }



    useEffect(() => {
        // accessProject()
        acessData()
    }, []);

    return (
        <>
            <AdminLayout>
                <div className='w-full h-full bg-white shadow-2xl flex flex-col gap-5 Rank relative'>
                    <div className='h-14 flex  items-center sm:mx-12 mx-5 justify-between shadow  md:px-3 px-1'>
                        <p className='md:text-xl text-gray-400 font-semibold'>Create Rank</p>
                        <Link onClick={handleClick} className=' text-center text-sm  create px-2 py-1 shadow-md bg-blue-600 text-white hover:bg-blue-800 hover:border-2 cursor-pointer rounded-full' >Create New Rank</Link>
                    </div>
                    <div className='overflow-scroll w-full lg:h-[76.8vh] h-[73.4vh] ' style={{ boxShadow: '0 0 5px 2px #ddd' }}>
                        <table className='w-full userTable p-1'>
                            <thead>
                                <tr className=' px-1 sticky' style={{ background: '#3e3e3e', color: 'aliceblue' }}>
                                    <th>Sr.</th>
                                    <th>CADER</th>
                                    <th>TARGET</th>
                                    <th>COMMISSION %</th>
                                    <th>SALARY</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    allResult.map((item, index) => (
                                        <tr className='hover:bg-gray-50' key={index}>
                                            <td>{index + 1 || 'NA'}</td>
                                            <td>{item.cader || 'NA'}</td>
                                            <td>{item.target || '00'}</td>
                                            <td>{item.commission || '00'}</td>
                                            <td>{item.salary || ' '}</td>
                                            <td className='flex gap-3 items-center justify-center'>
                                                <button className='p-2 translate-x-1 shadow-md rounded-full  text-lg hover:bg-green-700  hover:border hover:shadow-md hover:shadow-green-800 text-white bg-green-500 ' onClick={() => handleEdit(item)}><MdEdit /></button>
                                                <button className='p-2 shadow-md rounded-full text-lg hover:bg-red-700 hover:border hover:shadow-md hover:shadow-red-600 text-white bg-red-700' onClick={() => handleDelete(item)}><MdDelete /></button>
                                            </td>
                                        </tr >
                                    ))
                                }
                            </tbody >
                        </table >
                    </div >
                    {popUp && (
                        <form action="" onSubmit={changeValue ? handleUpdate : handleSubmit} style={{ zIndex: '100' }} className='absolute w-full top-14'>
                            <div className=' cust bg-white py-12 rounded flex flex-col relative sm:mx-24 mx-6 overflow-y-scroll h-[60vh] shadow-current shadow-sm  font-serif sm:px-16 px-5  gap-2 md:gap-8'>
                                <p className={`absolute top-4 right-4 text-xl transition-transform duration-300 ${rotate ? 'rotate-180' : ''
                                    }`} onClick={() => {
                                        setTimeout(() => {
                                            setPopUp(false), setData({
                                                cader: '',
                                                target: '',
                                                commission: '',
                                                salary: '',
                                            })
                                        }, 200); setRotate(!rotate);
                                    }}><RxCross2 />
                                </p>

                                {/* <div className='flex flex-col md:flex-row gap-1 md:gap-3  border-b-2'>
                                    <label htmlFor="name" className='whitespace-nowrap'>Project Name :</label>
                                    <select name="project" id="" className='w-full outline-none px-2 py-1' value={data.project} onChange={handleChange}>
                                        <option value="">-- Select Project --</option>
                                        {
                                            allProject && (
                                                allProject.map((item, index) => (
                                                    <option key={index} value={item.P_Id}>{item.projsite}</option>
                                                ))
                                            )
                                        }
                                    </select>
                                </div> */}

                                <div className='flex flex-col md:flex-row gap-1 md:gap-3  border-b-2'>
                                    <label htmlFor="name" className='whitespace-nowrap'>Cader :</label>
                                    <input type="text" name="cader" id="name" required value={data.cader} onChange={handleChange}
                                        className='w-full outline-none px-2 py-1' placeholder='Enter cader name' />
                                </div>

                                <div className='flex flex-col md:flex-row gap-1 md:gap-3  border-b-2'>
                                    <label htmlFor="BPrefix" className='whitespace-nowrap'>Target :</label>
                                    <input type="text" name="target" required value={data.target} id="BPrefix" onChange={handleChange} onKeyPress={(event) => {
                                        if (!/[0-9.]/.test(event.key)) {
                                            event.preventDefault();
                                        }
                                    }}
                                        className='w-full outline-none px-2 py-1' placeholder='Enter your target ' />
                                </div>

                                <div className='flex flex-col md:flex-row gap-1 md:gap-3  border-b-2'>
                                    <label htmlFor="R" className='whitespace-nowrap'>Commission % :</label>
                                    <input type="text" name="commission" required value={data.commission} id="R" onChange={handleChange} onKeyPress={(event) => {
                                        if (!/[0-9.]/.test(event.key)) {
                                            event.preventDefault();
                                        }
                                    }}
                                        className='w-full outline-none px-2 py-1' placeholder='***%' />
                                </div>

                                <div className='flex flex-col md:flex-row gap-1 md:gap-3  border-b-2'>
                                    <label htmlFor="TPrefix" className='whitespace-nowrap'>Salary :</label>
                                    <input type="text" name="salary" value={data.salary} id="TPrefix" onChange={handleChange}
                                        onKeyPress={(event) => {
                                            if (!/[0-9.]/.test(event.key)) {
                                                event.preventDefault();
                                            }
                                        }}
                                        className='w-full outline-none px-2 py-1' placeholder='********* ' />
                                </div>

                                <button type='submit' className='bg-blue-700 py-1 px-2 rounded text-white font-semibold'>{changeValue ? 'Save' : 'Submit'}</button>
                            </div>
                        </form>
                    )}
                </div >
            </AdminLayout >

        </>
    )
}
export default RankPage;


