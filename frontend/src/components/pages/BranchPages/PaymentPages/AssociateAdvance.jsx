import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { MdDelete, MdEdit } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { Link } from 'react-router-dom';
import showToast from 'show-toast';
import BranchLayout from '../../../Layout/BranchLayout.jsx';
import { useSelector } from 'react-redux';
import moment from 'moment'
const AssociateAdvance = () => {
    const [Id, setId] = useState('')

    const [popUp, setPopUp] = useState(false)
    const [changeValue, setchangeValue] = useState(false);
    const [rotate, setRotate] = useState(false);
    const [allResult, setAllResult] = useState([])
    // const [date, setDate] = useState('')
    const [UTRDate, setUTRDate] = useState('')
    const [UTRNo, setUTRNo] = useState('')
    const user = localStorage.getItem('uid')
    const associateID = useSelector(state => state?.user.associate)
    const [filterData, setFilterData] = useState([])
    const [data, setData] = useState({
        Excode: '',
        AdAmount: '',
        Paydate: '',
        Remarks: '',
        user: user || 'NA'
    })
    const handleChange = async (e) => {
        const { name, value } = e.target
        const values = ({
            ...data,
            [name]: value
        })
        setData(values)

        if (values.Excode) {
            let filtered = associateID.filter(items =>
                items.C_Id.includes(values.Excode)
            )
            setFilterData(filtered)
        }
    }
    const handleClick = async () => { setPopUp(true) }
    // Create AdCom function
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post('/api/v1/associate-advance-payment', data, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
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
            const { data } = await axios.get('/api/v1/get-associate-advance-payment')
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

    // handle handleIntro
    const handleIntro = async (value) => {
        setData({
            ...data,
            Excode: value.C_Id
        })
        // console.log(value)
        const scrollView = document.getElementById('Excode')
        scrollView.scrollIntoView({ behavior: 'smooth', block: 'nearest' })

        filterData.filter(el => el.C_Id !== value.C_Id)
        setFilterData()

    }

    return (
        <BranchLayout>
            <div className='w-full h-full bg-white shadow-2xl flex flex-col gap-5 AdCom relative'>

                <div className='h-14 flex  items-center sm:mx-12 mx-5 justify-between shadow  md:px-3 px-1'>
                    <p className='md:text-xl text-gray-400 font-semibold'>Associate Advance Payment</p>
                    <Link onClick={handleClick} className=' text-center text-sm  create px-2 py-1 shadow-md bg-blue-600 text-white hover:bg-blue-800 hover:border-2 cursor-pointer rounded-full' >Create  Advance Payment</Link>
                </div>

                <div className='overflow-scroll w-full lg:h-[76.8vh] h-[73.4vh] ' style={{ boxShadow: '0 0 5px 2px #ddd' }}>
                    <table className='w-full userTable p-1'>
                        <thead>
                            <tr className=' px-1 sticky' style={{ background: '#3e3e3e', color: 'aliceblue' }}>
                               <th>Sr No.</th>
                               <th>Associate_Id</th>
                               <th>Advance_Amount</th>
                               <th>Payment_Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                allResult.map((item, index) => (
                                    <tr key={index}>
                                        <td className='py-2'>{index+1}</td>
                                        <td>{item.Associate_Id}</td>
                                        <td>{item.Advance_Amount}</td>
                                        <td>{moment(item.Payment_Date).format('LL')}</td>
                                        {/* <td className='flex gap-2 items-center justify-center'>
                                            <button className='p-2 shadow-md rounded-full  text-lg hover:bg-green-700  hover:border hover:shadow-md hover:shadow-green-600 text-white bg-green-400 ' onClick={() => handleEdit(item)}><MdEdit /></button>
                                            <button className='p-2 shadow-md rounded-full text-lg hover:bg-red-700 hover:border hover:shadow-md hover:shadow-red-600 text-white bg-red-400' onClick={() => handleDelete(item)}><MdDelete /></button>
                                        </td> */}
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>

                {popUp && (
                    <form action="" onSubmit={changeValue ? handleUpdate : handleSubmit} style={{ zIndex: '100' }} className='absolute w-full top-14'>
                        <div className=' bg-white py-12 cust rounded flex flex-col relative sm:mx-24 mx-6 overflow-y-scroll h-[63vh] scrollbar-hide shadow-current shadow-sm  font-serif sm:px-16 px-5  gap-2 md:gap-8'>

                            <p className={`absolute top-4 right-4 text-xl transition-transform duration-300 ${rotate ? 'rotate-180' : ''
                                }`} onClick={() => {
                                    setTimeout(() => { setPopUp(false) }, 200); setData({}); setRotate(!rotate);
                                }}><RxCross2 />
                            </p>

                            <div className='flex flex-col md:flex-row gap-1 md:gap-3  border-b-2 '>
                                <label htmlFor="Excode" className='whitespace-nowrap'>Associate Id :</label>
                                <div className='relative w-full'>
                                    <input type="text" name="Excode" id="Excode" required value={data.Excode} onChange={handleChange}
                                        className='w-full outline-none px-2 py-1'
                                    />

                                    <div className='w-full bg-white shadow-md max-h-[50vh] overflow-y-scroll scrollbar-hide absolute  top-full '>
                                        {filterData && filterData.map((el, index) => (
                                            <p
                                                key={index}
                                                className="px-2 py-1 cursor-pointer hover:bg-[#ddd]"
                                                onClick={() => handleIntro(el)}
                                            >
                                                {el.C_Id}
                                            </p>
                                        ))}
                                    </div>

                                </div>
                            </div>

                            <div className='flex flex-col md:flex-row gap-1 md:gap-3  border-b-2'>
                                <label htmlFor="AdAmount" className='whitespace-nowrap'>Advance Amount</label>
                                <input type="text" name="AdAmount" required value={data.AdAmount} id="BPrefix" onChange={handleChange}
                                    className='w-full outline-none px-2 py-1' />
                            </div>

                            <div className='flex flex-col md:flex-row gap-1 md:gap-3  border-b-2'>
                                <label htmlFor="Remarks" className='whitespace-nowrap'>Enter Remarks :</label>
                                <input type="text" name="Remarks" required value={data.Remarks} id="Remarks" onChange={handleChange}
                                    className='w-full outline-none px-2 py-1' />
                            </div>

                            <div className='flex flex-col md:flex-row gap-1 md:gap-3  border-b-2'>
                                <label htmlFor="Paydate" className='whitespace-nowrap'>Payment Date:</label>
                                <input type="date" name="Paydate" required id="Paydate" onChange={handleChange} value={data.Paydate}
                                    className='w-full outline-none px-2 py-1 ' />
                            </div>



                            <button type='submit' className='bg-blue-700 py-1 px-2 rounded text-white font-semibold'>{changeValue ? 'Save' : 'Submit'}</button>
                        </div>
                    </form>
                )}
            </div>
        </BranchLayout>
    )
}

export default AssociateAdvance