import AdminLayout from '../../Layout/AdminLayout.jsx';
import React, { useEffect, useState } from 'react'
import showToast from 'show-toast';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { RxCross2 } from "react-icons/rx";
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";

const GradePage = () => {
    const [Id, setId] = useState('')
    const [popUp, setPopUp] = useState(false)
    const [changeValue, setchangeValue] = useState(false);
    const [rotate, setRotate] = useState(false);
    const [allResult, setAllResult] = useState([])
    const user = localStorage.getItem('user')
    // const [date, setDate] = useState('')
    const [data, setData] = useState({
        Grade: '',
        GPer: '',
        user: user || 'NA'
    })
    const handleChange = async (e) => {
        const { name, value } = e.target
        setData({
            ...data,
            [name]: value
        })
    }
    // Create Grade function
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post('/api/v1/create-grade', data)
            if (response.data.success) {
                showToast({
                    str: response.data.message
                })
            }
            setPopUp(false)
            acessData()
            setData({
                Grade: '',
                GPer: '',
                user: user || 'NA'
            })
        } catch (error) {
            console.log('Invalid Grade')
        }

    }
    const handleClick = async () => { setPopUp(true) }
    //   get Grades
    const acessData = async () => {
        try {
            const response = await axios.get('/api/v1/get-grade')
            if (response.data.success) {
                setAllResult(response.data.result)
            }
        } catch (error) {
            console.log('Something wrong during access Grade')
        }
    }
    useEffect(() => {
        acessData()
    }, []);
    // Update Grade Function
    const handleEdit = (value) => {
        setPopUp(true);
        setchangeValue(true)
        setId(value.Id)
        setData({
            Grade: value.grade,
            GPer: value.grade_per,
            user: user || 'NA'
        })
    };

    // handleUpdate function
    const handleUpdate = async (e) => {
        e.preventDefault();
        const date = new Date().toISOString();
        try {
            const response = await axios.put(`/api/v1/update-grade/${Id}`, { ...data, date });
            if (response.data.success) {
                showToast({
                    str: response.data.message
                });
            }
            setId('');
            setPopUp(false);
            acessData();
            setData({
                Grade: '',
                GPer: '',
                user: user || 'NA'
            })
        } catch (error) {
            console.error('Something went wrong during update Grade:', error);
        }
    };

    return (
        <AdminLayout>
            <div className='w-full h-full bg-white shadow-2xl flex flex-col gap-5 Grade relative'>
                <div className='h-14 flex  items-center sm:mx-12 mx-5 justify-between shadow  md:px-3 px-1'>
                    <p className='md:text-xl text-gray-400 font-semibold'>Create Grade</p>
                    <Link onClick={handleClick} className=' text-center text-sm  create px-2 py-1 shadow-md bg-blue-600 text-white hover:bg-blue-800 hover:border-2 cursor-pointer rounded-full' >Create Grade</Link>
                </div>
                <div className='overflow-scroll w-full lg:h-[76.8vh] h-[73.4vh] ' style={{ boxShadow: '0 0 5px 2px #ddd' }}>
                    <table className='w-full userTable p-1'>
                        <thead>
                            <tr className=' px-1 sticky' style={{ background: '#3e3e3e', color: 'aliceblue' }}>
                                <th>Sr.</th>
                                <th>Grade </th>
                                <th>Grade_Per %</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                allResult.map((item, index) => (
                                    <tr key={index}>
                                        <td>{index + 1 || 'NA'}</td>
                                        <td>{item.grade || 'NA'}</td>
                                        <td>{item.grade_per || 'NA'}</td>
                                        <td className='flex gap-2 items-center justify-center'>
                                            <button className='p-2 translate-x-1 shadow-md rounded-full  text-lg hover:bg-green-700  hover:border hover:shadow-md hover:shadow-green-600 text-white bg-green-400 ' onClick={() => handleEdit(item)}><MdEdit /></button>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
                {popUp && (
                    <form action="" onSubmit={changeValue ? handleUpdate : handleSubmit} style={{ zIndex: '100' }} className='absolute w-full top-14'>
                        <div className=' bg-white py-12 rounded flex flex-col relative sm:mx-24 mx-6 overflow-y-scroll h-[45vh] shadow-current shadow-sm  font-serif sm:px-16 px-5  gap-2 md:gap-8'>
                            <p className={`absolute top-4 right-4 text-xl transition-transform duration-300 ${rotate ? 'rotate-180' : ''
                                }`} onClick={() => {
                                    setTimeout(() => { setPopUp(false) }, 200); setData({
                                        Grade: '',
                                        GPer: '',
                                        user: user || 'NA'
                                    }); setRotate(!rotate);
                                }}><RxCross2 /></p>

                            <div className='flex flex-col md:flex-row gap-1 md:gap-3  border-b-2'>
                                <label htmlFor="name" className='whitespace-nowrap'>Grade :</label>
                                <input type="text" name="Grade" id="name" required value={data.Grade} onChange={handleChange}
                                    className='w-full outline-none px-2 py-1' placeholder='Enter Grade ... ' />
                            </div>
                            <div className='flex flex-col md:flex-row gap-1 md:gap-3 border-b-2'>
                                <label htmlFor="BPrefix" className='whitespace-nowrap'>Percentage :</label>
                                <input
                                    type="text"
                                    name="GPer"
                                    required
                                    value={data.GPer}
                                    id="BPrefix"
                                    onChange={handleChange}
                                    onKeyPress={(event) => {
                                        if (!/[0-9.]/.test(event.key)) {
                                            event.preventDefault();
                                        }
                                    }}
                                    className='w-full outline-none px-2 py-1'
                                    placeholder='Enter percentage... '
                                />
                            </div>
                            <button type='submit' className='bg-blue-700 py-1 px-2 rounded text-white font-semibold'>{changeValue ? 'Save' : 'Submit'}</button>
                        </div>
                    </form>
                )}
            </div>
        </AdminLayout>
    )
}

export default GradePage