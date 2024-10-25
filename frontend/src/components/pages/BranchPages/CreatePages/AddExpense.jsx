import showToast from 'show-toast';
import axios from 'axios';
import { RxCross2 } from "react-icons/rx";
import { MdDelete, MdEdit } from "react-icons/md";
// import { supName, ProRefer, category, PaymentType } from '../../../common/index.jsx'
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import searchGif from '../../../../assets/createmenu/gif/target.gif'
import Branchlayout from '../../../Layout/BranchLayout.jsx'
import moment from 'moment';
const AddExpense = () => {
    const [Id, setId] = useState('');
    const [img, setImg] = useState('');
    const [preview, setPreview] = useState(null);
    const [popUp, setPopUp] = useState(false);
    const [changeValue, setchangeValue] = useState(false);
    const [rotate, setRotate] = useState(false);
    const [allResult, setAllResult] = useState([]);
    const [allExpense, setAllExpense] = useState([]);
    const user = localStorage.getItem('uid');
    const [search, setSearch] = useState('')
    const [openSearch, setOpenSearch] = useState(false);
    const [data, setData] = useState({
        Expense: '',
        Amount: '',
        Expense_Date: '',
        Status: '',
        P_Date: '',
        remark: '',
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
        user: user || 'NA'
    });

    const handleChange = async (e) => {
        const { name, value } = e.target
        const Data = ({
            ...data,
            [name]: value
        })
        setData(Data)
    }

    // handle image
    const handleImage = (e) => {
        const file = e.target.files[0];
        setImg(file);
        setPreview(URL.createObjectURL(file));
    };
    // Create Rank function
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {

            const formData = new FormData();
            for (const [key, value] of Object.entries(data)) {
                formData.append(key, value);
            }
            formData.append('image', img)
            const response = await axios.post('/api/v1/create-branch-expense', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (response.data.success) {
                showToast({
                    str: response.data.message,
                    time: 1000
                });
                setPopUp(false);
                setData({});
                accessData();
                setPreview()
                setTimeout(() => {
                    window.location.reload()
                }, 500);
            }

        } catch (error) {
            console.log('Invalid Expense:', error);
        }
    };

    const handleClick = async () => { setPopUp(true) }
    //   get ranks

    const handleEdit = (value) => {
        setchangeValue(true);
        setPopUp(true);
        setId(value.Id);
        setData({
            Expense: value.Expense,
            Amount: value.Amount,
            Expense_Date: value.Expense_Date,
            Status: value.Status,
            P_Date: value.P_Date,
            remark: value.remark,
            P_Mode: value.P_Mode,
            PayDDN: value.PayDDN,
            PayDrawNo: value.PayDrawNo,
            ChequeBank: value.ChequeBank,
            ChequeNo: value.ChequeNo,
            ChequeHolder: value.ChequeHolder,
            ChequeBranch: value.ChequeBranch,
            ChequeIFSC: value.ChequeIFSC,
            ChequeAmount: value.ChequeAmount,
            ChequeDate: value.ChequeDate,
            TransBank: value.TransBank,
            TransId: value.TransId,
            TransDate: value.TransDate,
            TransAmount: value.TransAmount,
            TransType: value.TransType,
            TransHolderAC: value.TransHolderAC,
            user: user || 'NA',
            images: value.Check_Img
        });
        if (value.Check_Img) {
            setPreview(`/api/v1/getall-expense/${value.Check_Img}`);

        } else {
            setPreview(null);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {

            if (Id || img) {
                const formData = new FormData();
                formData.append('image', img);
                for (const [key, value] of Object.entries(data)) {
                    formData.append(key, value);
                }
                const response = await axios.put(`/api/v1/update-branch-expense/${Id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                if (response.data.success) {
                    showToast({ str: response.data.message });
                } else {
                    showToast({ str: 'Failed to update Expense' });
                }
                setId('');
                setPopUp(false);
                accessData();
            } else {
                showToast({ str: 'Please select an image and provide an ID' });
            }
        } catch (error) {
            console.error('Something went wrong during the update:', error);
            showToast({ str: 'An error occurred while updating the Expense' });
        }
    };

    // access Expense data
    const accessData = async () => {
        try {
            const { data } = await axios.get('/api/v1/getall-expense')
            if (data.success) {
                setAllResult(data.result)
            }
        } catch (error) {
            console.log(error.message)
        }
    }

    // access project
    const Expense = async () => {
        try {
            const response = await axios.get('/api/v1/getexpense-to-admin');
            if (response.data.success) {
                setAllExpense(response.data.result);
            }
        } catch (error) {
            console.error('Error accessing projects', error);
        }
    };
    useEffect(() => {
        Expense()
        accessData()
    }, []);

    // Find Data
    const findData = async (e) => {
        const value = e.target.value
        setSearch(value)
        try {
            const { data } = await axios.post(`/api/v1/find_memberdata/${value}`)
            if (data.success) {
                setAllResult(data.result)
            }
        } catch (error) {
            console.log(error.message)
        }
    }

    const handleDelete = async (value) => {
        const { Id } = value;
        try {
            if (Id) {
                const response = await axios.delete(`/api/v1/delete-expense/${Id}`);
                if (response.data.success) {
                    showToast({
                        str: response.data.message,
                        time: 500
                    });
                    accessData()
                } else {
                    showToast({
                        str: response.data.message,
                        time: 500
                    });
                }
            }
        } catch (error) {
            showToast({
                str: 'Something went wrong during deletion',
                time: 500
            });
            console.log('Error:', error.message);
        }
    };

    return (
        <Branchlayout>
            <div className='w-full h-full bg-white shadow-2xl flex flex-col gap-5 Project relative'>
                <div className='h-14 flex items-center sm:mx-12 mx-5 justify-between shadow md:px-3 px-1'>
                    <p className='md:text-xl text-gray-400 font-semibold'>Create Expense</p>
                    <Link onClick={handleClick} className='text-center text-sm create px-2 py-1 shadow-md bg-blue-600 text-white hover:bg-blue-800 hover:border-2 cursor-pointer rounded-full'>
                        Create New Expense
                    </Link>
                </div>
                <div className='overflow-scroll w-full lg:h-[76.8vh] h-[73.4vh]' style={{ boxShadow: '0 0 5px 2px #ddd' }}>
                    <table className='w-full userTable p-1'>

                        <thead>
                            <tr className='px-1 sticky' style={{ background: '#3e3e3e', color: 'aliceblue' }}>
                                <th>Sr No.</th>
                                <th>Expense</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>P_Date</th>
                                <th>Check_Image</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                allResult.map((items, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{items.Expense ?? 'NA'}</td>
                                        <td>{items.Amount ?? 'NA'}</td>
                                        <td>{items.Status}</td>
                                        <td>{moment(items.P_Date).format('LL')}</td>
                                        <td>
                                            <img src={`/api/v1/getall-expense/${items.Check_Img}`} alt="" width={50} />
                                        </td>
                                        <td className='flex gap-2 items-center justify-center my-2'>
                                            <button className='p-2 shadow-md rounded-full text-lg hover:bg-green-700 hover:border hover:shadow-md hover:shadow-green-600 text-white bg-green-600' onClick={() => handleEdit(items)}><MdEdit /></button>
                                            <button className='p-2 shadow-md rounded-full text-lg hover:bg-red-700 hover:border hover:shadow-md hover:shadow-red-600 text-white bg-red-600' onClick={() => handleDelete(items)}><MdDelete /></button>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
                {popUp && (
                    <>
                        <form target='_blank' onSubmit={changeValue ? handleUpdate : handleSubmit} style={{ zIndex: '100' }} className='absolute w-full top-14 '>
                            <div className='bg-white py-6 rounded flex flex-col  relative sm:mx-12 mx-3 overflow-y-scroll h-[75vh] shadow-current shadow-sm font-serif sm:px-4  gap-2 md:gap-6'>
                                <p className={`absolute top-4 right-4 text-xl transition-transform duration-300 ${rotate ? 'rotate-180' : ''}`} onClick={() => { setTimeout(() => { setPopUp(false) }, 200); setData(''); setImg(); setRotate(!rotate); preview() }}>
                                    <RxCross2 />
                                </p>

                                <div className='lg:flex lg:gap-4 lg:justify-between associate mx-auto'>

                                    {/* this is second section */}
                                    <div className='flex flex-col gap-2'>

                                        <div className='flex-col gap-5 shadow-lg p-5 flex'>
                                            <p className='font-bold text-lg'></p>

                                            <div className='flex flex-col md:flex-row gap-1  '>
                                                <label htmlFor="Expense" className='whitespace-nowrap '>Expense Type :</label>
                                                <select size={1} name="Expense" id="Expense" value={data.Expense} onChange={handleChange} className='w-full  outline-none px-2 py-1'>
                                                    <option value="">-- Select --</option>
                                                    {
                                                        allExpense && allExpense.map((item, index) => (
                                                            <option key={item + index} value={item.expense_name}>{item.expense_name}</option>
                                                        ))
                                                    }
                                                </select>
                                            </div>

                                            <div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                                <label htmlFor="Amount" className='whitespace-nowrap'>Amount :</label>
                                                <input type="text" name="Amount" id="Amount" value={data.Amount} onChange={handleChange} className='w-full outline-none px-2 py-1' />
                                            </div>

                                            <div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                                <label htmlFor="Expense_Date" className='whitespace-nowrap'>Expense Date :</label>
                                                <input type="date" name="Expense_Date" id="Expense_Date" value={data.Expense_Date} onChange={handleChange} className='w-full outline-none px-2 py-1' />
                                            </div>
                                        </div>

                                        <div className='flex-col gap-5 shadow-lg p-5 flex'>
                                            <p className='font-bold text-lg'></p>

                                            <div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                                <label htmlFor="Status" className='whitespace-nowrap'>Status :</label>
                                                <select name="Status" id="Status" value={data.Status} onChange={handleChange} className='w-full  outline-none px-2 py-1'>
                                                    <option value="Unpaid">Unpaid</option>
                                                    <option value="Paid">Paid</option>
                                                </select>
                                            </div>

                                            <div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                                <label htmlFor="P_Date" className='whitespace-nowrap'>Payment Date :</label>
                                                <input type='date' name="P_Date" id="P_Date" value={data.P_Date} onChange={handleChange} className='w-full outline-none px-2 py-1 ' />
                                            </div>

                                            <div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                                <label htmlFor="remark" className='whitespace-nowrap'>Remarks :</label>
                                                <input type="text" name="remark" id="remark" value={data.remark} onChange={handleChange} className='w-full outline-none px-2 py-1' />
                                            </div>

                                        </div>

                                    </div>

                                    <div className='flex flex-col gap-5'>
                                        <p className='font-bold text-lg'></p>
                                        {

                                            data.Status === 'Paid' && (
                                                <>
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
                                                                    <label htmlFor="ChequeBranch" className='whitespace-nowrap'>Brank Name :</label>
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

                                                                {(img || preview) && (
                                                                    <img
                                                                        src={preview || URL.createObjectURL(img)}
                                                                        height={80}
                                                                        width={80}
                                                                        alt={img ? img.name : 'Preview'}
                                                                        className='mt-4'
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
                                                </>
                                            )
                                        }
                                    </div>
                                </div>

                                <button type='submit' className='bg-blue-700 py-1 px-2 rounded text-white font-semibold'>{changeValue ? 'Save' : 'Submit'}</button>
                            </div>
                        </form>
                    </>

                )}
                <div className='absolute -left-2 top-14 md:w-[23vw]'>
                    <div className={`w-10 h-10  rounded-full drop-shadow-lg ${openSearch ? 'hidden' : 'block'}`} onClick={() => setOpenSearch(true)}>
                        <img src={searchGif} className='rounded-full ' alt="" />
                    </div>
                    {openSearch && (
                        <div className='rounded-full border-2 flex items-center gap-2 py-1 px-2 bg-[#ddd] shadow-md'>
                            <input
                                name='content'
                                type="search"
                                className='rounded-full px-3 w-full  outline-none'
                                placeholder='Enter User Id...'
                                value={search.content}
                                onChange={findData}
                            />
                            <p onClick={() => setOpenSearch(false)} className='text-xl  text-black' ><RxCross2 className="font-bold" /></p>
                        </div>

                    )}
                </div>
            </div>
        </Branchlayout>
    )
}

export default AddExpense