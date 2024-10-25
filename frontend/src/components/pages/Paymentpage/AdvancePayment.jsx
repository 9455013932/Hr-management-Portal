import React, { useEffect, useState } from 'react'
import AdminLayout from '../../Layout/AdminLayout.jsx'
import showToast from 'show-toast';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { RxCross2 } from "react-icons/rx";
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";

const AdvancePayment = () => {
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [Id, setId] = useState('')
    const [popUp, setPopUp] = useState(false)
    const [changeValue, setchangeValue] = useState(false);
    const [rotate, setRotate] = useState(false);
    const [allResult, setAllResult] = useState(null)
    const [suggestion, setSuggestion] = useState(null)
    const [showSuggestion, setShowSuggestion] = useState(false)
    const [values, setValues] = useState({
        search: '',
    });
    const user = localStorage.getItem('uid')
    const [data, setData] = useState({
        AssociateId: '',
        Name: '',
        Amount: '',
        PaymentDate: '',
        PaymentMode: '',
        user: user || 'NA',
        TransactionId: '',
        ChequeNo: '',
        DraftNo: ''

    })
    const handleChange = async (e) => {
        const { name, value } = e.target
        setData({
            ...data,
            [name]: value
        })
    }
    const AccessData = async (e) => {
        e.preventDefault();
        try {
            if (values) {
                const response = await axios.post('/api/v1/getadvance_payment', values);
                const { data } = response;
                if (data.success) {
                    setAllResult(data.result);
                } else {
                    alert('Failed to retrieve data.');
                }
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Invalid User.');
        }
    };
    // for suggestion
    const handleValues = async (e) => {
        const { name, value } = e.target
        setValues({
            ...values,
            [name]: value
        })
        try {
            const { data } = await axios.post(`/api/v1/access-suggesion/${value}`)
            if (data.success) {
                setShowSuggestion(true)
                setSuggestion(data.result)
            }
        } catch (error) {
            console.log(error.message)
        }
    }

    const handleClick = async () => { setPopUp(true) }

    // Create Associate function
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post('/api/v1/advance-payment', data)
            if (response.data.success) {
                showToast({
                    str: response.data.message,
                    time: 500,
                    position: 'top',
                })
            }
            setPopUp(false)
            setData({
                AssociateId: '',
                Name: '',
                Amount: '',
                PaymentDate: '',
                PaymentMode: '',
                user: user || 'NA',
                TransactionId: '',
                ChequeNo: '',
                DraftNo: ''
            })
        } catch (error) {
            showToast({
                str: 'Invalid user',
                time: 1000,
                position: 'top',
            })
        }

    }


    // Update Associate Function
    const handleEdit = (value) => {
        setPopUp(true);
        setchangeValue(true);
        setId(value.Pay_Id);
        setData({
            AssociateId: value.AssociateId,
            Name: value.Name,
            Amount: value.Amount,
            PaymentDate: value.PaymentDate,
            PaymentMode: value.PaymentMode,
            user: user || 'NA',
            TransactionId: value.TransactionId,
            ChequeNo: value.ChequeNo,
            DraftNo: value.DraftNo
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const { data: response } = await axios.put(`/api/v1/advance_update_payment/${Id}`, data);
            if (response.success) {
                showToast({
                    str: response.message,
                    time: 1000,
                    position: 'top',
                });
                AccessData()
                setPopUp(false);
                setData('');
                setchangeValue(false);
                setId('');
            }
        } catch (error) {
            showToast({
                str: 'Update failed',
                time: 1000,
                position: 'top',
            });
        }
    };

    // handle delete
    const handleDelete = async (value) => {
        const { Pay_Id } = value
        try {
            const { data } = await axios.delete(`/api/v1/advance_payment_delete/${Pay_Id}`)
            if (data.success) {
                showToast({
                    str:data.message
                })
                AccessData()
            }
        } catch (error) {
            alert('Something Wrong')
        }
    }

  
    const handleSelect = (AssociateId) => {
        setValues({ ...values, search: AssociateId });
        setShowSuggestion(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            setHighlightedIndex((prevIndex) =>
                prevIndex < suggestion.length - 1 ? prevIndex + 1 : 0
            );
        } else if (e.key === 'ArrowUp') {
            setHighlightedIndex((prevIndex) =>
                prevIndex > 0 ? prevIndex - 1 : suggestion.length - 1
            );
        } else if (e.key === 'Enter') {
            if (highlightedIndex >= 0 && highlightedIndex < suggestion.length) {
                handleSelect(suggestion[highlightedIndex].AssociateId);
            }
        }
    };

    return (
        <>
            <AdminLayout>
                <div className='w-full h-full bg-white shadow-2xl flex flex-col gap-5 Associate relative'>
                    <div className='h-14 flex  items-center sm:mx-12 mx-5 justify-between shadow  md:px-3 px-1'>
                        <p className='md:text-xl text-gray-400 font-semibold'>Advance Payment</p>
                        <Link onClick={handleClick} className=' text-center text-sm  create px-2 py-1 shadow-md bg-blue-600 text-white hover:bg-blue-800 hover:border-2 cursor-pointer rounded-full' >New Advance Payment</Link>
                    </div>
                    <div className='overflow-scroll w-full lg:h-[76.8vh] h-[73.4vh] relative ' style={{ boxShadow: '0 0 5px 2px #ddd' }}>

                        <form action="" className='flex flex-col' onSubmit={AccessData} >
                            <div className='flex mx-auto  gap-1 w-[46vw]  mt-5  items-center rounded-md  border-2'>

                                <label htmlFor="search" className='whitespace-nowrap bg-[#ddd]  md:px-3 w-[250px] md:w-[265px] py-1 shadow-md  md:font-bold text-gray-600 '>Associate Id</label>
                                <input type="text" name="search" id='search' value={values.search} onKeyDown={handleKeyDown} onChange={handleValues}
                                    className='md:w-full w-[18vw] outline-none px-2  ' />
                                <button className='bg-blue-700 py-1 px-1 md:px-3 rounded-md font-semibold  text-white'>Search</button>
                            </div>
                            {
                                showSuggestion && suggestion && values.search && (
                                    <div className='border w-[29vw] absolute top-12 left-[26vw]  mt-1 z-50  bg-white rounded-md shadow-lg'>
                                        {suggestion.map((el, index) => (
                                            <p
                                                className={`hover:bg-gray-200 px-3 py-1 cursor-pointer ${index === highlightedIndex ? 'bg-gray-200' : ''}`}
                                                key={index}
                                                onMouseEnter={() => setHighlightedIndex(index)}
                                                onClick={() => handleSelect(el.AssociateId)}
                                            >
                                                {
                                                    (/^[A-Za-z]+$/.test(values.search)) ? el.Name : el.AssociateId
                                                }
                                            </p>
                                        ))}
                                    </div>
                                )
                            }
                        </form>
                        {
                            allResult && (
                                <div className='overflow-scroll w-full mt-5 lg:h-[62.8vh] h-[60.4vh]' style={{ boxShadow: '0 0 5px 2px #ddd' }}>
                                    <table className='w-full userTable p-1'>
                                        <thead>
                                            <tr className=' px-1 sticky' style={{ background: '#3e3e3e', color: 'aliceblue' }}>
                                                <th>Sr.</th>
                                                <th>Name</th>
                                                <th>AssociateId</th>
                                                <th>Payment_Mode</th>
                                                <th>Payment_Date</th>
                                                <th>{allResult[0].TransactionId && 'TransactionId' || allResult[0].ChequeNo && 'ChequeNo' || allResult[0].DraftNo && 'DraftNo'}</th>
                                                <th>Action</th>
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
                                                        <td>{el.PaymentDate}</td>
                                                        <td>{el.TransactionId || el.ChequeNo || el.DraftNo}</td>
                                                        <td className='flex gap-2 items-center justify-center my-2'>
                                                            <button className='p-2 shadow-md rounded-full text-lg hover:bg-green-700 hover:border hover:shadow-md hover:shadow-green-700 text-white bg-green-700' onClick={() => handleEdit(el)}><MdEdit /></button>
                                                            <button className='p-2 shadow-md rounded-full text-lg hover:bg-red-700 hover:border hover:shadow-md hover:shadow-red-700 text-white bg-red-700' onClick={() => handleDelete(el)}><MdDelete /></button>
                                                        </td>
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
                        <form action="" onSubmit={changeValue ? handleUpdate : handleSubmit} style={{ zIndex: '100' }} className='absolute w-full top-14'>
                            <div className=' cust bg-white py-8 rounded flex flex-col relative sm:mx-24 mx-4 overflow-y-scroll h-[65vh] shadow-current shadow-sm  font-serif  md:px-16 px-5  gap-2 md:gap-6'>

                                <p className={`absolute top-4 right-4 text-xl transition-transform duration-300 ${rotate ? 'rotate-180' : ''
                                    }`} onClick={() => {
                                        setTimeout(() => { setPopUp(false) }, 200); setRotate(!rotate);
                                    }}><RxCross2 />
                                </p>

                                <div className='flex flex-col md:flex-row gap-1 md:gap-3   border-b-2'>
                                    <label htmlFor="name" className='whitespace-nowrap'>Associate Id :</label>
                                    <input type="text" name="AssociateId" id="name" required value={data.AssociateId} onChange={handleChange}
                                        className='w-full outline-none px-2 py-1 ' placeholder='Enter Associate id...' />
                                </div>

                                <div className='flex flex-col md:flex-row gap-1 md:gap-3  border-b-2'>
                                    <label htmlFor="BPrefix" className='whitespace-nowrap'>Associate Name:</label>
                                    <input type="text" name="Name" required value={data.Name} id="BPrefix" onChange={handleChange}
                                        className='w-full outline-none px-2 py-1 ' placeholder='Enter Associate Name...' />
                                </div>

                                <div className='flex flex-col md:flex-row gap-1 md:gap-3  border-b-2'>
                                    <label htmlFor="Bcode" className='whitespace-nowrap'>Amount (Rs) :</label>
                                    <input type="text" name="Amount" required id="Bcode" onChange={handleChange} value={data.Amount}
                                        className='w-full outline-none px-2 py-1' placeholder='Enter Total Amount...' />
                                </div>

                                <div className='flex flex-col md:flex-row gap-1 md:gap-3  border-b-2'>
                                    <label htmlFor="address" className='whitespace-nowrap'>Payment Date:</label>
                                    <input type='date' name="PaymentDate" requiredid="address" onChange={handleChange} value={data.PaymentDate}
                                        className='w-full outline-none px-2 py-1' />
                                </div>

                                <div className='flex flex-col md:flex-row gap-1 md:gap-3  border-b-2'>
                                    <label htmlFor="PaymentMode" className='whitespace-nowrap'>Payment Mode :</label>
                                    <select name="PaymentMode" id="PaymentMode" className='w-full outline-none px-2 py-1' value={data.PaymentMode} onChange={handleChange}>
                                        <option value="">-- Payment Mode --</option>
                                        <option value="Cash">Cash</option>
                                        <option value="Demand Draft">Demand Draft</option>
                                        <option value="Cheque">Cheque</option>
                                        <option value="Bank Transation">Bank Transaction</option>
                                    </select>
                                </div>
                                {
                                    data.PaymentMode === 'Bank Transation' && (
                                        <div className='flex flex-col md:flex-row gap-1 md:gap-3  border-b-2'>
                                            <label htmlFor="TransactionId" className='whitespace-nowrap'>Transaction Id:</label>
                                            <input type='text' name="TransactionId" id="TransactionId" onChange={handleChange} value={data.TransactionId}
                                                className='w-full outline-none px-2 py-1' />
                                        </div>
                                    )

                                }
                                {
                                    data.PaymentMode === 'Cheque' && (
                                        <div className='flex flex-col md:flex-row gap-1 md:gap-3  border-b-2'>
                                            <label htmlFor="ChequeNo" className='whitespace-nowrap'>Cheque No :</label>
                                            <input type='text' name="ChequeNo" id="ChequeNo" onChange={handleChange} value={data.ChequeNo}
                                                className='w-full outline-none px-2 py-1' />
                                        </div>
                                    )

                                }
                                {
                                    data.PaymentMode === 'Demand Draft' && (
                                        <>
                                            <div className='flex flex-col md:flex-row gap-1 md:gap-3  border-b-2'>
                                                <label htmlFor="DraftNo" className='whitespace-nowrap'>Demand Draft No :</label>
                                                <input type='text' name="DraftNo" id="DraftNo" onChange={handleChange} value={data.DraftNo}
                                                    className='w-full outline-none px-2 py-1' />
                                            </div>
                                        </>
                                    )

                                }

                                <button type='submit' className='bg-blue-700 py-1 px-2 rounded text-white font-semibold'>{changeValue ? 'Save' : 'Submit'}</button>
                            </div>
                        </form>
                    )}
                </div>
            </AdminLayout>
        </>
    )
}

export default AdvancePayment
