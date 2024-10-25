import React, { useEffect, useState } from 'react'
import BranchLayout from '../../../Layout/BranchLayout.jsx'
import showToast from 'show-toast';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { RxCross2 } from "react-icons/rx";
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { TbCreditCardPay } from "react-icons/tb";
import { ToWords } from 'to-words';
import moment from 'moment';

const PartPayment = () => {
    const toWords = new ToWords();
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [Id, setId] = useState('')
    const [toInstall, setToInstall] = useState([])
    const [popUp, setPopUp] = useState(false)
    const [changeValue, setchangeValue] = useState(false);
    const [rotate, setRotate] = useState(false);
    const [allResult, setAllResult] = useState(null)
    const [suggestion, setSuggestion] = useState(null)
    const [showSuggestion, setShowSuggestion] = useState(false)
    const [img, setImg] = useState('');
    const [preview, setPreview] = useState(null);
    const user = localStorage.getItem('uid')
    const [values, setValues] = useState({
        search: '',
    });
    const [data, setData] = useState({
        CustomerId: '',
        CustomerName: '',
        AssociateName: '',
        ProjectName: '',
        term: '',
        PayMode: '',
        OverAllCost: '',
        DueAmount: '',
        LateFine: '',
        ToInstall: '',
        PaidAmount: '',
        P_Mode: '',
        PayDDN: '',
        PayDrawNo: '',
        ChequeBank: '',
        ChequeNo: '',
        ChequeHolder: '',
        ChequeBranch: '',
        ChequeIFSC: '',
        ChequeAmount: '',
        ChequeDate: '',
        TransBank: '',
        TransId: '',
        TransDate: '',
        TransAmount: '',
        TransType: '',
        TransHolderAC: '',
        P_Date: '',
        PayAmount: '',
        PartPayment: '',
        AmountWord: '',
        user: user || 'NA'
    })
    // handle Image
    const handleImage = async (e) => {
        const file = e.target.files[0]
        setImg(file)
    }
    // select value according to name
    const handleChange = async (e) => {
        const { name, value } = e.target
        setData({
            ...data,
            [name]: value
        })

    }


    useEffect(() => {
        if (allResult && data.PartPayment && data.LateFine) {
            const value = allResult[0]

            let partPayment = parseInt(data.PartPayment)
            let lateFine = parseInt(data.LateFine)

            let payAmount = partPayment + lateFine
            let amountWord = toWords.convert(payAmount)

            // console.log("PartPayment", partPayment, "LateFine", lateFine, "PayAmount", payAmount)
            // console.log(amountWord)
            setData({
                ...data,
                PayAmount: payAmount,
                AmountWord: amountWord + ' ' + 'Only'
            })
        }
    }, [data.LateFine])


    const AccessData = async (e) => {
        e.preventDefault();
        try {
            if (values) {
                const response = await axios.post('/api/v1/shink-value-customer', values);
                const { data } = response;
                if (data.success) {
                    setAllResult(data.result);

                    // setValues({})
                } else {
                    alert('Failed to retrieve data.');
                }
            }
        } catch (error) {
            console.error('Error:', error);
            showToast({
                str: error.message,
                time: 1000,
                position: 'top'
            })
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
            if (value) {
                const { data } = await axios.post(`/api/v1/get-part-customerid/${value}`)
                if (data.success) {
                    setShowSuggestion(true)
                    setSuggestion(data.result)
                }
            }
        } catch (error) {
            console.log(error.message)
        }
    }

    const handleClick = async (e) => {
        e.preventDefault();
        setPopUp(true)
        await AccessData(e)
        if (allResult) {
            const value = allResult[0]
            const PayableAmount = parseInt(value.PayableAmount)
            const BookAmount = parseInt(value.BookAmount)
            let PartAmount = value.PartAmount || 1
            let paidAmount = parseInt(PartAmount)
            // console.log(paidAmount)

            const ToInstall = parseInt(value.ToInstall) + 1
            const DueAmount = PayableAmount - BookAmount - paidAmount + 1

            setTimeout(() => {
                setData({
                    ...data,
                    CustomerId: value.C_Id,
                    CustomerName: value.ApplicantName,
                    AssociateName: value.IntrodName,
                    ProjectName: value.ProjectName,
                    term: value.term,
                    PayMode: value.PayMode,
                    P_Date: value.PayDate,
                    ToInstall: ToInstall,
                    OverAllCost: value.PayableAmount,
                    PaidAmount: value.BookAmount,
                    DueAmount: DueAmount
                })

            }, 500);
        }
    }

    // handle Term function
    const handleTerm = (e) => {
        const value = e.target.value

    }
    // Create Payment function
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const formData = new FormData()
            formData.append('image', img)
            for (const [key, value] of Object.entries(data)) {
                formData.append(key, value)
            }
            const response = await axios.post('/api/v1/create-branch-partpayment', formData, {
                headers: {
                    "Content-Type": 'multipart/form-data'
                }
            })
            if (response.data.success) {
                showToast({
                    str: response.data.message,
                    time: 500,
                    position: 'top',
                })
                setPopUp(false)
                setData({})
                setImg()
            }
            else {
                alert('Check All fields')
            }

        } catch (error) {
            showToast({
                str: error.message,
                time: 1000,
                position: 'top',
            })
        }

    }


    // Update Payment Function
    const handleEdit = (value) => {
        setPopUp(true);
        setchangeValue(true);
        setId(value.Pay_Id);
        setData({
            PaymentId: value.PaymentId,
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
                    str: data.message
                })
                AccessData()
            }
        } catch (error) {
            alert('Something Wrong')
        }
    }


    const handleSelect = (PaymentId) => {
        setValues({ ...values, search: PaymentId });
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
                handleSelect(suggestion[highlightedIndex].C_Id);
            }
        }
    };
    return (
        <BranchLayout>
            <div className='w-full h-full bg-white shadow-2xl flex flex-col gap-5  relative'>

                <div className='h-14 flex  items-center sm:mx-12 mx-5 justify-between shadow  md:px-3 px-1'>
                    <p className='md:text-xl text-gray-400 font-semibold'>Part Payment</p>
                    <Link className=' text-center text-sm  create px-4 py-1 shadow-md border-2 cursor-pointer rounded-full font-semibold shine-effect' >{moment(new Date()).format('LL')}</Link>
                </div>

                <div className='overflow-scroll w-full lg:h-[76.8vh] h-[73.4vh] relative ' style={{ boxShadow: '0 0 5px 2px #ddd' }}>

                    <form action="" className='flex flex-col' onSubmit={AccessData} >
                        <div className='flex mx-auto  gap-1 w-[46vw]  mt-5  items-center rounded-md  border-2'>

                            <label htmlFor="search" className='whitespace-nowrap bg-[#ddd]  md:px-3 w-[250px] md:w-[265px] py-1 shadow-md  md:font-bold text-gray-600 '>Customer Id and Name</label>
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
                                            onClick={() => handleSelect(el.C_Id)}
                                        >
                                            {
                                                (/^[A-Za-z]+$/.test(values.search)) ? el.ApplicantName : el.C_Id
                                            }
                                        </p>
                                    ))}
                                </div>
                            )
                        }
                    </form>
                    {
                        allResult && (
                            <div className='overflow-scroll .scrollbar-hide w-full mt-5 lg:h-[62.8vh] h-[60.4vh]' style={{ boxShadow: '0 0 5px 2px #ddd' }}>
                                <table className='w-full userTable p-1'>
                                    <thead>
                                        <tr className=' px-1 sticky' style={{ background: '#3e3e3e', color: 'aliceblue' }}>
                                            <th>Sr.</th>
                                            <th>Name</th>
                                            <th>Customer_Id</th>
                                            <th>Associate_Id</th>
                                            <th>Last Installment</th>
                                            <th>Mobile_No</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            allResult.map((el, index) => (
                                                <tr key={index + 1}>
                                                    <td>{index + 1}</td>
                                                    <td>{el.ApplicantName}</td>
                                                    <td>{el.C_Id}</td>
                                                    <td>{el.assoId}</td>
                                                    <td>{el.ToInstall}</td>
                                                    <td>{el.Mobile}</td>

                                                    <td className='flex gap-2 items-center justify-center '>
                                                        <div className="relative flex items-center justify-center">
                                                            <button onClick={handleClick} className='relative flex items-center justify-center p-2 gap-2 shadow-md rounded-full text-lg hover:bg-green-700 hover:border hover:shadow-md hover:shadow-green-700 text-white bg-green-700 group'>
                                                                <TbCreditCardPay className='text-2xl' />

                                                                {/* Hover text */}
                                                                <p className='absolute -top-2 shadow-md bg-green-950 bg-opacity-70 text-white text-sm px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                                                                    Proceed To Pay
                                                                </p>
                                                            </button>

                                                        </div>


                                                        {/* <button className='p-2 shadow-md rounded-full text-lg hover:bg-green-700 hover:border hover:shadow-md hover:shadow-green-700 text-white bg-green-700' onClick={() => handleEdit(el)}><MdEdit /></button>
                                                <button className='p-2 shadow-md rounded-full text-lg hover:bg-red-700 hover:border hover:shadow-md hover:shadow-red-700 text-white bg-red-700' onClick={() => handleDelete(el)}><MdDelete /></button> */}
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
                    <>
                        <form target='_blank' onSubmit={changeValue ? handleUpdate : handleSubmit} style={{ zIndex: '100' }} className='absolute w-full top-14 '>
                            <div className='bg-white py-6 rounded flex flex-col  relative sm:mx-16 mx-3 overflow-y-scroll h-[75vh] scrollbar-hide shadow-current shadow-sm font-serif sm:px-4 px-2 gap-2 md:gap-6'>
                                <p className={`absolute top-4 right-4 text-xl transition-transform duration-300 ${rotate ? 'rotate-180' : ''}`} onClick={() => { setTimeout(() => { setPopUp(false) }, 200); setData(''); setImg(); setRotate(!rotate); }}>
                                    <RxCross2 />
                                </p>

                                <div className='lg:flex lg:gap-4 lg:justify-between associate mx-auto'>

                                    {/* this is second section */}
                                    <div className='flex flex-col gap-2'>

                                        <div className='flex-col gap-5 shadow-lg p-5 flex'>
                                            <p className='font-bold text-lg'></p>

                                            <div className='flex flex-col md:flex-row gap-1  border-b-2 '>
                                                <label htmlFor="CustomerId" className='whitespace-nowrap'>Customer Id :</label>
                                                <input type="text" name="CustomerId" id="CustomerId" value={data.CustomerId}
                                                    onKeyPress={(e) => {
                                                        if (!/^[0-9.]+$/.test(e.key)) {
                                                            e.preventDefault()
                                                        }
                                                    }}
                                                    readOnly
                                                    onChange={handleChange} className='w-full outline-none px-2 py-1' />

                                            </div>

                                            <div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                                <label htmlFor="CustomerName" className='whitespace-nowrap'>Customer Name:</label>
                                                <input type="text" name="CustomerName" id="CustomerName"
                                                    onKeyPress={(e) => {
                                                        if (!/^[a-z A-Z]+$/.test(e.key)) {
                                                            e.preventDefault()
                                                        }
                                                    }}
                                                    value={data.CustomerName} readOnly onChange={handleChange} className='w-full outline-none px-2 py-1' />
                                            </div>

                                            <div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                                <label htmlFor="AssociateName" className='whitespace-nowrap'>Associate Name:</label>
                                                <input type="text" name="AssociateName" id="AssociateName"
                                                    onKeyPress={(e) => {
                                                        if (!/^[a-z A-Z]+$/.test(e.key)) {
                                                            e.preventDefault()
                                                        }
                                                    }}
                                                    value={data.AssociateName} readOnly onChange={handleChange} className='w-full outline-none px-2 py-1' />
                                            </div>

                                            <div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                                <label htmlFor="ProjectName" className='whitespace-nowrap'>Project Name:</label>
                                                <input type="text" name="ProjectName" id="ProjectName"
                                                    value={data.ProjectName} readOnly onChange={handleChange} className='w-full outline-none px-2 py-1' />
                                            </div>

                                            <div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                                <label htmlFor="term" className='whitespace-nowrap'>Term (yr) :</label>
                                                <input type="text" name="term" id="term"
                                                    value={data.term} readOnly onChange={handleChange} className='w-full outline-none px-2 py-1' />
                                            </div>
                                        </div>


                                        <div className='flex-col gap-5 shadow-lg p-5 flex'>
                                            <div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                                <label htmlFor="PayMode" className='whitespace-nowrap'>Payment Mode :</label>
                                                <input type="text" name="PayMode" id="PayMode"
                                                    value={data.PayMode} readOnly onChange={handleChange} className='w-full outline-none px-2 py-1' />
                                            </div>

                                            <div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                                <label htmlFor="ToInstall" className='whitespace-nowrap'>Installment No :</label>
                                                <input type="text" name="ToInstall" id="ToInstall"
                                                    value={data.ToInstall} readOnly onChange={handleChange} className='w-full outline-none px-2 py-1' />
                                            </div>

                                            <div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                                <label htmlFor="OverAllCost" className='whitespace-nowrap'>Total Plot Cost :</label>
                                                <input type="text" name="OverAllCost" id="OverAllCost"
                                                    value={data.OverAllCost} readOnly onChange={handleChange} className='w-full outline-none px-2 py-1' />
                                            </div>

                                            <div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                                <label htmlFor="PaidAmount" className='whitespace-nowrap'>Paid Amount :</label>
                                                <input type="text" name="PaidAmount" id="PaidAmount"
                                                    value={data.PaidAmount} readOnly onChange={handleChange} className='w-full outline-none px-2 py-1' />
                                            </div>

                                            <div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                                <label htmlFor="DueAmount" className='whitespace-nowrap'>Due Amount :</label>
                                                <input type="text" name="DueAmount" id="DueAmount"
                                                    value={data.DueAmount} readOnly onChange={handleChange} className='w-full outline-none px-2 py-1' />
                                            </div>

                                        </div>
                                    </div>

                                    <div className='flex flex-col gap-5'>
                                        <p className='font-bold text-lg'></p>
                                        <div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                            <label htmlFor="P_Date" className='whitespace-nowrap'>Payment Mode :</label>
                                            <div className='w-full flex gap-1'>
                                                {
                                                    ['Cash', 'DD', 'Cheque', 'Bank Transaction'].map((mode, index) => (
                                                        <React.Fragment key={mode + index}>
                                                            <input type="radio" name="P_Mode" id="P_Mode" onChange={handleChange} checked={data.P_Mode === mode} value={mode} className='text-[0.7rem] outline-none ' />
                                                            <span className='text-[0.7rem]'>{mode}</span>
                                                        </React.Fragment>
                                                    ))
                                                }
                                            </div>
                                        </div>

                                        {data.P_Mode === 'DD' && (
                                            <>
                                                <div className='flex flex-col md:flex-row gap-1 border-b-2'>
                                                    <label htmlFor="PayDDN" className='whitespace-nowrap'>DD No :</label>
                                                    <input type="text" name="PayDDN" id="PayDDN" value={data.PayDDN} onChange={handleChange} className='w-full outline-none px-2 py-1' />
                                                </div>

                                                <div className='flex flex-col md:flex-row gap-1 border-b-2'>
                                                    <label htmlFor="PayDrawNo" className='whitespace-nowrap'>Draw No :</label>
                                                    <input type="text" name="PayDrawNo" id="PayDrawNo" value={data.PayDrawNo} onChange={handleChange} className='w-full outline-none px-2 py-1' />
                                                </div>
                                            </>
                                        )}

                                        {
                                            data.P_Mode === 'Cheque' && (
                                                <>
                                                    <div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                                        <label htmlFor="ChequeBank" className='whitespace-nowrap'>Bank Name :</label>
                                                        <input type="text" name="ChequeBank" id="ChequeBank" value={data.ChequeBank ?? 'NA'} onChange={handleChange} className='w-full outline-none px-2 py-1' />
                                                    </div>

                                                    <div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                                        <label htmlFor="ChequeAcc" className='whitespace-nowrap'>A/C No :</label>
                                                        <input type="text" name="ChequeAcc" id="ChequeAcc"
                                                            onKeyPress={e => {
                                                                if (!/^[0-9]+$/.test(e.key)) {
                                                                    e.preventDefault()
                                                                }
                                                            }}
                                                            value={data.ChequeAcc ?? 'NA'} onChange={handleChange} className='w-full outline-none px-2 py-1' />
                                                    </div>

                                                    <div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                                        <label htmlFor="ChequeNo" className='whitespace-nowrap'>Cheque No :</label>
                                                        <input type="text" name="ChequeNo" id="ChequeNo" value={data.ChequeNo ?? 'NA'} required onChange={handleChange} className='w-full outline-none px-2 py-1' />
                                                    </div>

                                                    <div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                                        <label htmlFor="ChequeHolder" className='whitespace-nowrap'>A/C Holder Name :</label>
                                                        <input type="text" name="ChequeHolder" id="ChequeHolder" value={data.ChequeHolder ?? 'NA'} onChange={handleChange} className='w-full outline-none px-2 py-1' />
                                                    </div>

                                                    <div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                                        <label htmlFor="ChequeBranch" className='whitespace-nowrap'>Branch Name :</label>
                                                        <input type="text" name="ChequeBranch" id="ChequeBranch" value={data.ChequeBranch ?? 'NA'} onChange={handleChange} className='w-full outline-none px-2 py-1' />
                                                    </div>

                                                    <div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                                        <label htmlFor="ChequeIFSC" className='whitespace-nowrap'>IFSC :</label>
                                                        <input type="text" name="ChequeIFSC" id="ChequeIFSC" value={data.ChequeIFSC ?? 'NA'} onChange={handleChange} className='w-full outline-none px-2 py-1' />
                                                    </div>

                                                    <div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                                        <label htmlFor="ChequeAmount" className='whitespace-nowrap'>Amount :</label>
                                                        <input type="text" name="ChequeAmount" id="ChequeAmount" value={data.ChequeAmount ?? 'NA'} onChange={handleChange} className='w-full outline-none px-2 py-1' />
                                                    </div>

                                                    <div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                                        <label htmlFor="ChequeDate" className='whitespace-nowrap'>Cheque Date:</label>
                                                        <input type="date" name="ChequeDate" id="ChequeDate" value={data.ChequeDate ?? 'NA'} onChange={handleChange} className='w-full outline-none px-2 py-1' />
                                                    </div>

                                                    <div className='flex flex-col md:flex-row gap-1 md:gap-3 border-b-2'>
                                                        <label htmlFor="file" className='whitespace-nowrap'>Cheque Image :</label>
                                                        <input type="file" name="image" id="file" onChange={handleImage} className='w-full outline-none px-2 py-1' />
                                                    </div>

                                                    {img && (
                                                        <img
                                                            src={URL.createObjectURL(img)}
                                                            height={120}
                                                            width={120}
                                                            alt={img.name}
                                                            className='mt-1'
                                                        />
                                                    )}


                                                </>
                                            )
                                        }

                                        {data.P_Mode === 'Bank Transaction' && (
                                            <>
                                                <div className='flex flex-col md:flex-row gap-1 border-b-2'>
                                                    <label htmlFor="TransBank" className='whitespace-nowrap'>Bank Name :</label>
                                                    <select name="TransBank" id="TransBank" value={data.TransBank} onChange={handleChange} className='w-full outline-none px-2 py-1'>
                                                        <option value="">-- Select Bank --</option>
                                                        <option value="STATE BANK OF INDIA">STATE BANK OF INDIA</option>
                                                        <option value="UCO BANK">UCO BANK</option>
                                                        <option value="BANK OF ARYAVART">BANK OF ARYAVART</option>
                                                    </select>
                                                </div>

                                                <div className='flex flex-col md:flex-row gap-1 border-b-2'>
                                                    <label htmlFor="TransId" className='whitespace-nowrap'>Transaction Id :</label>
                                                    <input type="text" name="TransId" id="TransId" value={data.TransId} onChange={handleChange} className='w-full outline-none px-2 py-1' />
                                                </div>

                                                <div className='flex flex-col md:flex-row gap-1 border-b-2'>
                                                    <label htmlFor="TransDate" className='whitespace-nowrap'>Transaction Date :</label>
                                                    <input type="date" name="TransDate" id="TransDate" value={data.TransDate} onChange={handleChange} className='w-full outline-none px-2 py-1' />
                                                </div>

                                                <div className='flex flex-col md:flex-row gap-1 border-b-2'>
                                                    <label htmlFor="TransAmount" className='whitespace-nowrap'>Amount :</label>
                                                    <input type="text" name="TransAmount" id="TransAmount" value={data.TransAmount} onChange={handleChange} className='w-full outline-none px-2 py-1' />
                                                </div>

                                                <div className='flex flex-col md:flex-row gap-1 border-b-2'>
                                                    <label className='whitespace-nowrap'>Transaction Type :</label>
                                                    <div className='w-full flex gap-[0.1rem]'>
                                                        {['NEFT', 'IMPS', 'RTGS', 'UPI', 'NACH'].map((mode) => (
                                                            <React.Fragment key={mode}>
                                                                <input
                                                                    type="radio"
                                                                    name="TransType"
                                                                    value={mode}
                                                                    checked={data.TransType === mode}
                                                                    onChange={handleChange}
                                                                    className='text-[0.6rem] outline-none'
                                                                />
                                                                <span className='text-[0.6rem]'>{mode}</span>
                                                            </React.Fragment>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className='flex flex-col md:flex-row gap-1 border-b-2'>
                                                    <label htmlFor="TransHolderAC" className='whitespace-nowrap'>A/C Holder's A/C No :</label>
                                                    <input type="text" name="TransHolderAC" id="TransHolderAC" value={data.TransHolderAC} onChange={handleChange} className='w-full outline-none px-2 py-1' />
                                                </div>
                                            </>
                                        )}

                                        <div className='flex flex-col gap-5'>
                                            <p className='font-bold text-lg'></p>

                                            <div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                                <label htmlFor="P_Date" className='whitespace-nowrap'>Payment Date :</label>
                                                <input type='text' name="P_Date" id="P_Date" value={data.P_Date} readOnly onChange={handleChange} className='w-full outline-none px-2 py-1 ' />
                                            </div>

                                            <div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                                <label htmlFor="LateFine" className='whitespace-nowrap'>Late Fine(Rs.) :</label>
                                                <input type="text" name="LateFine" id="LateFine"
                                                    value={data.LateFine} onChange={handleChange} required className='w-full outline-none px-2 py-1' />
                                            </div>

                                            <div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                                <label htmlFor="PartPayment" className='whitespace-nowrap'>Part Payment(Rs.) :</label>
                                                <input type="text" name="PartPayment" id="PartPayment" value={data.PartPayment} onChange={handleChange} className='w-full outline-none px-2 py-1' />
                                            </div>

                                            <div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                                <label htmlFor="PayAmount" className='whitespace-nowrap'>Pay Amount(Rs.) :</label>
                                                <input type="text" name="PayAmount" id="PayAmount" value={data.PayAmount} readOnly onChange={handleChange} className='w-full outline-none px-2 py-1' />
                                            </div>

                                            <div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                                <label htmlFor="AmountWord" className='whitespace-nowrap'>Amount In Word :</label>
                                                <input type="text" name="AmountWord" id="AmountWord" value={data.AmountWord} readOnly onChange={handleChange} className='w-full outline-none px-2 py-1' />
                                            </div>
                                        </div>


                                    </div>
                                </div>

                                <button type='submit' className='bg-blue-700 py-1 px-2 rounded text-white font-semibold'>{changeValue ? 'Save' : 'Submit'}</button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </BranchLayout>
    )
}

export default PartPayment