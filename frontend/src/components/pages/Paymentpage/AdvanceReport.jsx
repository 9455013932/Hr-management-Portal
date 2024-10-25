import React, { useState } from 'react'
import AdminLayout from '../../Layout/AdminLayout.jsx'
import showToast from 'show-toast';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { RxCross2 } from "react-icons/rx";


const AdvanceReport = () => {
    const [popUp, setPopUp] = useState(false)
    const [rotate, setRotate] = useState(false);
    const [allResult, setAllResult] = useState(null)
    const [data, setData] = useState({
        SDate: '',
        EDate: '',
    })

    const handleChange = async (e) => {
        const { name, value } = e.target
        setData({
            ...data,
            [name]: value
        })
    }

    const handleClick = async () => { setPopUp(true) }

    // Create Associate function
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post('/api/v1/payment-report-datewise', data)
            if (response.data.success) {
                showToast({
                    str: response.data.message,
                    position: 'top',
                })
                setAllResult(response.data.result)
            }
            setPopUp(false)
            setData('')
        } catch (error) {
            showToast({
                str: 'Invalid user',
                time: 1000,
                position: 'top',
            })
        }

    }
    return (
        <AdminLayout>
            <div className='w-full h-full bg-white shadow-2xl flex flex-col gap-5 Associate relative'>
                <div className='h-14 flex  items-center sm:mx-12 mx-5 justify-between shadow  md:px-3 px-1'>
                    <p className='md:text-xl text-gray-400 font-semibold'>Payment Report</p>
                    <Link onClick={handleClick} className=' text-center text-sm  create px-2 py-1 shadow-md bg-blue-600 text-white hover:bg-blue-800 hover:border-2 cursor-pointer rounded-full font-semibold' >Check Report</Link>
                </div>
                <div className='overflow-scroll w-full lg:h-[76.8vh] h-[73.4vh] relative ' style={{ boxShadow: '0 0 5px 2px #ddd' }}>
                    {
                        allResult != null && allResult && (
                            <div className='overflow-scroll w-full mt-5 lg:h-[62.8vh] h-[60.4vh]' style={{ boxShadow: '0 0 5px 2px #ddd' }}>
                                <table className='w-full userTable p-1'>
                                    <thead>
                                        <tr className=' px-1 sticky' style={{ background: '#3e3e3e', color: 'aliceblue' }}>
                                            <th>Sr.</th>
                                            <th>Name</th>
                                            <th>AssociateId</th>
                                            <th>Payment_Mode</th>
                                            <th>{allResult[0].TransactionId && 'TransactionId' || allResult[0].ChequeNo && 'ChequeNo' || allResult[0].DraftNo && 'DraftNo'}</th>

                                            <th>Payment_Date</th>

                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            allResult.map((el, index) => (
                                                <tr key={index + 1}>
                                                    <td>{index + 1}</td>
                                                    <td>{el.Name}</td>
                                                    <td>{el.AssociateId}</td>
                                                    <td>{el.PaymentMode}</td>
                                                    <td>{el.TransactionId  || el.ChequeNo || el.DraftNo}</td>

                                                    <td>{el.PaymentDate}</td>

                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                        )


                    }
                </div>

                {popUp && (
                    <form action="" onSubmit={handleSubmit} style={{ zIndex: '100' }} className='absolute w-full top-14'>
                        <div className=' cust bg-white py-6 rounded flex flex-col relative sm:mx-24 mx-4 overflow-y-scroll h-[34vh] shadow-current shadow-sm  font-serif  md:px-16 px-5  gap-2 md:gap-6'>

                            <p className={`absolute top-4 right-4 text-xl transition-transform duration-300 ${rotate ? 'rotate-180' : ''
                                }`} onClick={() => {
                                    setTimeout(() => { setPopUp(false) }, 200); setRotate(!rotate); setData('')
                                }}><RxCross2 />
                            </p>

                            <div className='flex flex-col md:flex-row gap-1 md:gap-3   border-2 rounded-md'>
                                <label htmlFor="SDate" className='whitespace-nowrap '>Start Date :</label>
                                <input type="date" name="SDate" id="SDate" required value={data.SDate} onChange={handleChange}
                                    className='w-full outline-none px-2 py-1 ' />
                            </div>

                            <div className='flex flex-col md:flex-row gap-1 md:gap-3   border-2 rounded-md'>
                                <label htmlFor="EDate" className='whitespace-nowrap'>End Date :</label>
                                <input type="date" name="EDate" id="EDate" required value={data.EDate} onChange={handleChange}
                                    className='w-full outline-none px-2 py-1 ' />
                            </div>



                            <button type='submit' className='bg-blue-700 py-1 px-2 rounded text-white font-semibold'>Submit</button>
                        </div>
                    </form>
                )}
            </div>
        </AdminLayout>
    )
}

export default AdvanceReport