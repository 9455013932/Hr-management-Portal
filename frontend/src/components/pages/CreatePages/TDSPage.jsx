import React, { useEffect, useState } from 'react'
import AdminLayout from '../../Layout/AdminLayout.jsx'
import showToast from 'show-toast';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { RxCross2 } from "react-icons/rx";
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";

const TDSPage = () => {
    const [Id, setId] = useState('')
    const [popUp, setPopUp] = useState(false)
    const [changeValue, setchangeValue] = useState(false);
    const [rotate, setRotate] = useState(false);
    const [allResult, setAllResult] = useState([])
    const user = localStorage.getItem('uid')
    const [data, setData] = useState({
        TDSWPan: '',
        TDSWIPan: '',
        LFine: '',
        ProFee: '',
        MemFe: '',
        SAFFee: '',
        SCFFee: '',
        SACCFFee: '',
        AOAmount: '',
        SRevival: '',
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

    // Create TDS function
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post('/api/v1/create-tds', data)
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
            const { data } = await axios.get('/api/v1/get-tds')
            if (data.success) {
                setAllResult(data.result)
            }

        } catch (error) {
            console.log('Error in getting all branch', error.message)
        }
    }
    useEffect(() => { accessData() }, [])

    // Update TDS Function
    const handleEdit = (value) => {
        setchangeValue(true);
        setPopUp(true);
        setId(value.Id);
        setData({
            TDSWPan: value.tdswpan,
            TDSWIPan: value.tdswopan,
            LFine: value.latefine,
            ProFee: value.procefee,
            MemFe: value.memberfee,
            SAFFee: value.accopenfee,
            SCFFee: value.assofee,
            SACCFFee: value.cusfee,
            AOAmount: value.accformfee,
            SRevival: value.revival,
            user: user || 'NA',
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`/api/v1/update-tds/${Id}`, data);
            if (response.data.success) {
                showToast({
                    str: response.data.message,
                    time: 1000,
                    position: 'top',
                });
                setId('');
                accessData();
                setPopUp(prev => !prev);
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
            const { data } = await axios.delete(`/api/v1/delete-tds/${Id}`)
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
            <div className='w-full h-full bg-white shadow-2xl flex flex-col gap-5 TDS relative'>
                <div className='h-14 flex  items-center sm:mx-12 mx-5 justify-between shadow  md:px-3 px-1'>
                    <p className='md:text-xl text-gray-400 font-semibold'>Create New Fine & TDS</p>
                    <Link onClick={handleClick} className=' text-center text-sm  create px-2 py-1 shadow-md bg-blue-600 text-white hover:bg-blue-800 hover:border-2 cursor-pointer rounded-full' >Create New TDS</Link>
                </div>
                <div className='overflow-scroll w-full lg:h-[76.8vh] h-[73.4vh] ' style={{ boxShadow: '0 0 5px 2px #ddd' }}>
                    <table className='w-full userTable p-1'>
                        <thead>
                            <tr className=' px-1 sticky' style={{ background: '#3e3e3e', color: 'aliceblue' }}>
                                <th>Sr.</th>
                                <th>TDS With Pan</th>
                                <th>TDS Without pan</th>
                                <th>Late Fine</th>
                                <th>Proc_Fee</th>
                                <th>Mem_Fee</th>
                                <th>Asso_Form Fee</th>
                                <th>Cust_Form Fee</th>
                                <th>Acc_Form Fee</th>
                                <th>Acc_open Amount</th>
                                <th>Revival Fee</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                allResult.map((item, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item.tdswpan || 'NA'}</td>
                                        <td>{item.tdswopan || 'NA'}</td>
                                        <td>{item.latefine || 'NA'}</td>
                                        <td>{item.procefee || 'NA'}</td>
                                        <td>{item.memberfee || 'NA'}</td>
                                        <td>{item.accopenfee || 'NA'}</td>
                                        <td>{item.assofee || 'NA'}</td>
                                        <td>{item.cusfee || 'NA'}</td>
                                        <td>{item.accformfee || 'NA'}</td>
                                        <td>{item.revival || 'NA'}</td>
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
                        <div className=' bg-white py-3 rounded flex  cust scrollbar-hide  flex-col relative sm:mx-24 mx-6 overflow-y-scroll h-[75vh] shadow-current shadow-sm  font-serif sm:px-16 px-5  gap-2 md:gap-4'>

                            <p className={`absolute top-4 right-4 text-xl transition-transform duration-300 ${rotate ? 'rotate-180' : ''
                                }`} onClick={() => {
                                    setTimeout(() => { setPopUp(false) }, 200); setData({
                                        TDSWPan: '',
                                        TDSWIPan: '',
                                        LFine: '',
                                        ProFee: '',
                                        MemFe: '',
                                        SAFFee: '',
                                        SCFFee: '',
                                        SACCFFee: '',
                                        AOAmount: '',
                                        SRevival: '',
                                    }); setRotate(!rotate);
                                }}><RxCross2 />
                            </p>

                            <div className='flex flex-col md:flex-row gap-1 md:gap-3  border-b-2'>
                                <label htmlFor="name" className='whitespace-nowrap'>TDS(%) With PAN :</label>
                                <input type="text" name="TDSWPan" id="name" required value={data.TDSWPan} onChange={handleChange}
                                    className='w-full outline-none px-2 py-1' />
                            </div>

                            <div className='flex flex-col md:flex-row gap-1 md:gap-3  border-b-2'>
                                <label htmlFor="BPrefix" className='whitespace-nowrap'>TDS(%) Without PAN :</label>
                                <input type="text" name="TDSWIPan" required value={data.TDSWIPan} id="BPrefix" onChange={handleChange}
                                    className='w-full outline-none px-2 py-1' />
                            </div>

                            <div className='flex flex-col md:flex-row gap-1 md:gap-3  border-b-2'>
                                <label htmlFor="Bcode" className='whitespace-nowrap'>Late Fine(%) :</label>
                                <input type="text" name="LFine" required id="Bcode" onChange={handleChange} value={data.LFine}
                                    className='w-full outline-none px-2 py-1' />
                            </div>

                            <div className='flex flex-col md:flex-row gap-1 md:gap-3  border-b-2'>
                                <label htmlFor="address" className='whitespace-nowrap'>Processing Fee(%) :</label>
                                <input type='text' name="ProFee" requiredid="address" onChange={handleChange} value={data.ProFee}
                                    className='w-full outline-none px-2 py-1' />
                            </div>

                            <div className='flex flex-col md:flex-row gap-1 md:gap-3  border-b-2'>
                                <label htmlFor="district" className='whitespace-nowrap'>Member Fee :</label>
                                <input type="text" name="MemFe" required id="district" onChange={handleChange} value={data.MemFe}
                                    className='w-full outline-none px-2 py-1' />
                            </div>

                            <div className='flex flex-col md:flex-row gap-1 md:gap-3  border-b-2'>
                                <label htmlFor="SAFFee" className='whitespace-nowrap'>Set Associative Form Fee :</label>
                                <input type="text   " name="SAFFee" required id="SAFFee" onChange={handleChange} value={data.SAFFee}
                                    className='w-full outline-none px-2 py-1' />
                            </div>

                            <div className='flex flex-col md:flex-row gap-1 md:gap-3  border-b-2'>
                                <label htmlFor="SCFFee" className='whitespace-nowrap'>Set Customer Form Fee :</label>
                                <input type="text   " name="SCFFee" required id="SCFFee" onChange={handleChange} value={data.SCFFee}
                                    className='w-full outline-none px-2 py-1' />
                            </div>

                            <div className='flex flex-col md:flex-row gap-1 md:gap-3  border-b-2'>
                                <label htmlFor="SACCFFee" className='whitespace-nowrap'>Set A/C Form Fee :</label>
                                <input type="text   " name="SACCFFee" required id="SACCFFee" onChange={handleChange} value={data.SACCFFee}
                                    className='w-full outline-none px-2 py-1' />
                            </div>

                            <div className='flex flex-col md:flex-row gap-1 md:gap-3  border-b-2'>
                                <label htmlFor="AOAmount" className='whitespace-nowrap'>Set A/C Opening Amount :</label>
                                <input type="text   " name="AOAmount" required id="AOAmount" onChange={handleChange} value={data.AOAmount}
                                    className='w-full outline-none px-2 py-1' />
                            </div>

                            <div className='flex flex-col md:flex-row gap-1 md:gap-3  border-b-2'>
                                <label htmlFor="SRevival" className='whitespace-nowrap'>Set Revival Fee :</label>
                                <input type="text   " name="SRevival" required id="SRevival" onChange={handleChange} value={data.SRevival}
                                    className='w-full outline-none px-2 py-1' />
                            </div>

                            <button type='submit' className='bg-blue-700 py-1 px-2 rounded text-white font-semibold'>{changeValue ? 'Save' : 'Submit'}</button>
                        </div>
                    </form>
                )}
            </div>
        </AdminLayout>
    )
}

export default TDSPage;