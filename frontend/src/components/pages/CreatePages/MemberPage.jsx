import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import showToast from 'show-toast';
import axios from 'axios';
import { RxCross2 } from "react-icons/rx";
import { MdDelete, MdEdit } from "react-icons/md";
import { supName, category } from '../../common/index.jsx'
import searchGif from '../../../assets/createmenu/gif/target.gif'
import AdminLayout from '../../Layout/AdminLayout.jsx'

const MemberPage = () => {
    const [Id, setId] = useState('');
    const [popUp, setPopUp] = useState(false);
    const [changeValue, setchangeValue] = useState(false);
    const [rotate, setRotate] = useState(false);
    const [allResult, setAllResult] = useState([]);
    const user = localStorage.getItem('uid');
    const [nationality, setImage] = useState('Indian')
    const [stateResult, setStateResult] = useState([])
    const [selectedState, setSelectedState] = useState('');
    const branch = sessionStorage.getItem('uid')
    const [search, setSearch] = useState('')
    const [openSearch, setOpenSearch] = useState(false);
    const [data, setData] = useState({
        FormFee: '',
        user: user || 'NA',
        MemberName: '',
        SupName: '',
        SO: '',
        MName: '',
        Mobile: '',
        gender: '',
        Category: '',
        JoinDate: '',
        DOB: '',
        PAN: '',
        branch: '',
        AccountNo: '',
        IFSC: '',
        Address: '',
        district: '' || null,
        PinCode: '',
        NName: '',
        NAge: '',
        relation: '',
        NomAddr: '',
        branchCode: branch || 'NA',

    });

    const handleChange = async (e) => {
        const { name, value } = e.target
        setData({
            ...data,
            [name]: value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (nationality && selectedState && user) {
                const formData = new FormData();
                for (const [key, value] of Object.entries(data)) {
                    formData.append(key, value);
                }
                formData.append('nationality', nationality);
                formData.append('state', selectedState);
                const response = await axios.post('/api/v1/create-branch_member', formData, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (response.data.success) {
                    showToast({
                        str: response.data.message,
                        duration: 1000
                    });
                    setData({});
                    setPopUp(false);
                    accessData();
                    setSelectedState()
                    setTimeout(() => { window.location.reload() }, 500)
                }
            } else {
                console.log('Nationality is required.');
            }
        } catch (error) {
            console.log('Invalid Member:', error);
        }
    };


    const handleClick = async () => { setPopUp(true) }

    // Update Rank Function
    const handleEdit = async (value) => {
        setPopUp(true);
        setchangeValue(true);
        setId(value.Id);
        // console.log(value)
        setData({
            FormFee: value.FormFee,
            branchCode: value.BranchCode,
            user: user || 'NA',
            MemberName: value.MemberName,
            Mobile: value.Mobile,
            SO: value.So,
            SupName: value.SupName,
            MName: value.MName,
            gender: value.gender,
            Category: value.Category,
            JoinDate: value.JoinDate,
            DOB: value.DOB,
            PAN: value.PAN,
            AccountNo: value.AccountNo,
            district: value.district,
            PinCode: value.PinCode,
            IFSC: value.IFSC,
            branch: value.branch,
            Address: value.Address,
            NAge: value.NAge,
            NName: value.NName,
            relation: value.relation,
            NomAddr: value.NomAddr,
        });
        setSelectedState(value.state)
        setImage(value.nationality)
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            if (Id && nationality && selectedState) {
                const formData = new FormData();
                for (const [key, value] of Object.entries(data)) {
                    formData.append(key, value);
                }
                formData.append('nationality', nationality);
                formData.append('state', selectedState);
                // formData.append('BranchCode', branch);

                const response = await axios.put(`/api/v1/update_member_data/${Id}`, formData, {
                    headers: {
                        "Content-Type": 'application/json'
                    }
                });

                if (response.data.success) {
                    showToast({ str: response.data.message });
                    setId('');
                    setPopUp(false);
                    accessData();
                }
            } else {
                showToast({ str: 'Please provide an ID' });
            }
        } catch (error) {
            console.error('Something went wrong during the update:', error);
            showToast({ str: 'An error occurred while updating the Member' });
        }
    };


    const accessDistict = async (e) => {
        const newState = e.target.value
        setSelectedState(newState);
        try {
            if (newState) {
                const { data } = await axios.post(`/api/v1/getall-district`, { state: newState });
                if (data.success) {
                    setStateResult(data.result);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };
    // handle delete
    const handleDelete = async (value) => {
        const { Id } = value;
        try {
            const response = await axios.delete(`/api/v1/delete_member_data//${Id}`);
            if (response.data.success) {
                showToast({
                    str: response.data.message,
                    time: 500,
                    position: 'top',
                });
            }
            setId('')
            accessData();
        } catch (error) {
            console.error('Problem occurred during deletion', error);
        }
    };

    // access Member data
    const accessData = async () => {
        try {
            const { data } = await axios.get('/api/v1/getall-member_data')
            if (data.success) {
                setAllResult(data.result)
            }
        } catch (error) {
            console.log(error.message)
        }
    }
    useEffect(() => {
        accessData()
    }, []);

    // finddata 
    const findData = async (e) => {
        const value = e.target.value
        setSearch(value)
        try {
            const { data } = await axios.post(`/api/v1/find_member_data/${value}`)
            if (data.success) {
                setAllResult(data.result)
            }
        } catch (error) {
            console.log(error.message)
        }
    }
    return (
        <AdminLayout>
            <div className='w-full h-full bg-white shadow-2xl flex flex-col gap-5 Project relative'>
                <div className='h-14 flex items-center sm:mx-12 mx-5 justify-between shadow md:px-3 px-1'>
                    <p className='md:text-xl text-gray-400 font-semibold '>Create Member</p>
                    <Link onClick={handleClick} className='text-center text-sm create px-2 py-1 shadow-md bg-blue-600 text-white hover:bg-blue-800 hover:border-2 cursor-pointer rounded-full'>
                        Create New Member
                    </Link>
                </div>
                <div className='overflow-scroll w-full lg:h-[76.8vh] h-[73.4vh]' style={{ boxShadow: '0 0 5px 2px #ddd' }}>
                    <table className='w-full userTable px-1'>
                        <thead>
                            <tr className='px-1 sticky' style={{ background: '#3e3e3e', color: 'aliceblue' }}>
                                <th>Sr No</th>
                                <th>Branch Code</th>
                                <th>Member_Id</th>
                                <th>Member_Name</th>
                                {/* <th>S/D/W_O</th> */}
                                <th>Mobile</th>
                                {/* <th>Category</th> */}
                                <th>District</th>
                                <th>Pincode</th>
                                <th>Date of Birth</th>
                                <th>Date of Joining</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                allResult && allResult.map((items, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{items.BranchCode}</td>
                                        <td>{items.M_Id}</td>
                                        <td>{items.MemberName}</td>
                                        {/* <td>{items.So}</td> */}
                                        <td>{items.Mobile}</td>
                                        {/* <td>{items.Category}</td> */}
                                        <td>{items.district}</td>
                                        <td>{items.PinCode}</td>
                                        <td>{items.DOB}</td>
                                        <td>{items.JoinDate}</td>
                                        <td className='flex gap-2 items-center justify-center my-1'>
                                            <button className='p-2 shadow-md rounded-full text-lg hover:bg-green-700 hover:border hover:shadow-md hover:shadow-green-600 text-white bg-green-600' onClick={() => handleEdit(items)}><MdEdit /></button>
                                            <button className='p-2 shadow-md rounded-full text-lg hover:bg-red-700 hover:border hover:shadow-md hover:shadow-red-600 text-white bg-red-600'  onClick={() => handleDelete(items)}><MdDelete /></button>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
                {popUp && (
                    <form target='_blank' onSubmit={changeValue ? handleUpdate : handleSubmit} style={{ zIndex: '100' }} className='absolute w-full top-14'>

                        <div className='bg-white py-6   SADF rounded flex flex-col  relative sm:mx-24 mx-3 overflow-y-scroll h-[75vh] shadow-current shadow-sm font-serif sm:px-4  gap-2 md:gap-6'>
                            <p className={`absolute top-4 right-4 text-xl transition-transform duration-300 ${rotate ? 'rotate-180' : ''}`} onClick={() => { setTimeout(() => { setPopUp(false) }, 200); setData(''); setImage([]); setRotate(!rotate); }}>
                            </p>
                            {/* <div className='bg-white py-6 rounded flex flex-col  relative sm:mx-10 mx-3 overflow-y-scroll h-[75vh] shadow-current shadow-sm font-serif sm:px-4  gap-2 md:gap-6'> */}
                                <p className={`absolute top-4 right-4 text-xl transition-transform duration-300 ${rotate ? 'rotate-180' : ''}`} onClick={() => { setTimeout(() => { setPopUp(false) }, 200); setData(''); setImage(); setRotate(!rotate); setSelectedState() }}>

                                    <RxCross2 />
                                </p>

                                <div className='lg:flex lg:gap-4 lg:justify-between associate '>

                                    <div className='flex flex-col  gap-2'>

                                        <div className='flex flex-col gap-5 shadow-lg p-4'>
                                            <p className='font-bold text-lg'>Personal Details</p>

                                            <div className='flex flex-col md:flex-row gap-1  border-b-2 relative'>
                                                <label htmlFor="BranchCode" className='whitespace-nowrap'>Branch Code :</label>
                                                <input type="text" name="BranchCode" id="BranchCode" value={branch} readOnly className='w-full outline-none px-2 py-1' />

                                            </div>

                                            <div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                                <label htmlFor="FormFee" className='whitespace-nowrap'>Form Fee :</label>
                                                <input type="text" name="FormFee" id="FormFee"
                                                    onKeyPress={(e) => {
                                                        if (!/^[0-9.]+$/.test(e.key)) {
                                                            e.preventDefault()
                                                        }
                                                    }} value={data.FormFee} onChange={handleChange} className='w-full outline-none px-2 py-1' />
                                            </div>

                                            <div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                                <label htmlFor="MemberName" className='whitespace-nowrap'>Name:</label>
                                                <input type="text" name="MemberName" id="MemberName"
                                                    value={data.MemberName} onChange={handleChange} className='w-full outline-none px-2 py-1' />
                                            </div>

                                            <div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                                <select name="SupName" id="SupName" value={data.SupName} onChange={handleChange} className=' w-[240px] outline-none px-2 py-1'>
                                                    <option value=""> Select </option>
                                                    {
                                                        supName.map((el, index) => (
                                                            <option key={el.Id} value={el.name}>{el.name}</option>
                                                        ))
                                                    }
                                                </select>
                                                <input type="text" name="SO" id="SO" value={data.SO} onChange={handleChange} className='w-full outline-none px-2 py-1' />
                                            </div>

                                            <div className='flex flex-col md:flex-row gap-1 md:gap-3 border-b-2'>
                                                <label htmlFor="MName" className='whitespace-nowrap'>Mother Name :</label>
                                                <input type="text" name="MName" id="MName" required value={data.MName} onChange={handleChange} className='w-full outline-none px-2 py-1' />
                                            </div>

                                            <div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                                <label htmlFor="Category" className='whitespace-nowrap'>Category :</label>
                                                <select name="Category" id="Category" value={data.Category} onChange={handleChange} className='w-full outline-none px-2 py-1'>
                                                    <option value="">-- Select Category --</option>
                                                    {
                                                        category.map(el => (
                                                            <option key={el.Id} value={el.name}>{el.name}</option>
                                                        ))
                                                    }
                                                </select>
                                            </div>

                                            <div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                                <label htmlFor="Mobile" className='whitespace-nowrap'>Mobile No :</label>
                                                <input type="text" name="Mobile" id="Mobile" maxLength={10} value={data.Mobile} onChange={handleChange}
                                                    onKeyPress={(e) => {
                                                        if (!/^[0-9]+$/.test(e.key)) {
                                                            e.preventDefault()
                                                        }
                                                    }}
                                                    className='w-full outline-none px-2 py-1' />
                                            </div>

                                            <div className='flex flex-col md:flex-row gap-1 md:gap-3 '>
                                                <label htmlFor="" className='whitespace-nowrap '>Select Gender :</label>
                                                <div className='w-full flex gap-3'>
                                                    <input type="radio" name="gender" id="" value='male' checked={data.gender == 'male'} onChange={handleChange} className='text-[0.9rem] outline-none' />Male
                                                    <input type="radio" name="gender" id="" value='female' checked={data.gender == 'female'} onChange={handleChange} className='text-[0.9rem] outline-none  ' />Female
                                                </div>
                                            </div>

                                            <div className='flex flex-col md:flex-row gap-1 md:gap-3 border-b-2'>
                                                <label htmlFor="JoinDate" className='whitespace-nowrap'>Date of Joining :</label>
                                                <input type="date" name="JoinDate" id="JoinDate" required value={data.JoinDate} onChange={handleChange} className='w-full outline-none px-2 py-1' />
                                            </div>

                                            <div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                                <label htmlFor="DOB" className='whitespace-nowrap'>Date of Birth :</label>
                                                <input type="date" name="DOB" id="DOB" value={data.DOB} onChange={handleChange} className='w-full outline-none px-2 py-1' />
                                            </div>

                                            <div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                                <label htmlFor="Nationality" className='whitespace-nowrap'>Nationality :</label>
                                                <input type="text" name="Nationality" id="Nationality" value={nationality} readOnly className='w-full outline-none px-2 py-1' />
                                            </div>

                                        </div>


                                        <div className='flex-col gap-5 shadow-lg p-5 flex'>
                                            <p className='font-bold text-lg'>Bank Details</p>

                                            <div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                                <label htmlFor="PAN" className='whitespace-nowrap'>PAN No :</label>
                                                <input type="text" name="PAN" id="PAN" value={data.PAN} maxLength={10} onChange={handleChange} className='w-full outline-none px-2 py-1' />
                                            </div>

                                            <div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                                <label htmlFor="branch" className='whitespace-nowrap'>Branch Name :</label>
                                                <input type="text" name="branch" id="branch" value={data.branch} onChange={handleChange} className='w-full outline-none px-2 py-1' />
                                            </div>

                                            <div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                                <label htmlFor="AccountNo" className='whitespace-nowrap'>Bank A/C No :</label>
                                                <input type="text" name="AccountNo" id="AccountNo" value={data.AccountNo}
                                                    onKeyPress={e => {
                                                        if (!/^[0-9]+$/.test(e.key)) {
                                                            e.preventDefault()
                                                        }
                                                    }}
                                                    onChange={handleChange} className='w-full outline-none px-2 py-1' />
                                            </div>

                                            <div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                                <label htmlFor="IFSC" className='whitespace-nowrap'>IFSC Code :</label>
                                                <input type="text" name="IFSC" id="IFSC" value={data.IFSC} onChange={handleChange} className='w-full outline-none px-2 py-1' />
                                            </div>

                                        </div>

                                    </div>

                                    {/* this is second section */}
                                    <div className='flex flex-col gap-2'>

                                        <div className='flex-col gap-5 shadow-lg p-5 flex'>
                                            <p className='font-bold text-lg'>Address Details</p>


                                            <div className='flex flex-col md:flex-row gap-1 md:gap-3 border-b-2'>
                                                <label htmlFor="Address" className='whitespace-nowrap'>Address :</label>
                                                <input type="text" name="Address" id="Address" required value={data.Address} onChange={handleChange} className='w-full outline-none px-2 py-1' />
                                            </div>

                                            <div className='flex flex-col md:flex-row gap-1 md:gap-3 border-b-2'>
                                                <label htmlFor="State" className='whitespace-nowrap'>State :</label>
                                                <input type="text" name="state" id="State" required value={selectedState} onChange={accessDistict} className='w-full outline-none px-2 py-1' />
                                            </div>

                                            <div className='flex flex-col md:flex-row gap-1 md:gap-3 border-b-2'>
                                                <label htmlFor="State" className='whitespace-nowrap'>District :</label>
                                                {
                                                    stateResult && (
                                                        <select name="district" required value={data.district} onChange={handleChange} id="" className='w-full outline-none px-2 py-1'>
                                                            <option value="">-- Select District --</option>
                                                            {
                                                                stateResult.map((item, index) => (
                                                                    <option key={index} value={item.name}>{item.name}</option>
                                                                ))
                                                            }
                                                        </select>
                                                    )
                                                }
                                            </div>

                                            <div className='flex flex-col md:flex-row gap-1 md:gap-3 border-b-2'>
                                                <label htmlFor="PinCode" className='whitespace-nowrap'>Pin Code :</label>
                                                <input type="text" name="PinCode" id="PinCode" required maxLength={6} value={data.PinCode} onChange={handleChange} className='w-full outline-none px-2 py-1' />
                                            </div>


                                        </div>

                                        <div className='flex-col gap-5 shadow-lg p-5 flex'>
                                            <p className='font-bold text-lg'>Nominee Details</p>

                                            <div className='flex flex-col md:flex-row gap-1 md:gap-3 border-b-2'>
                                                <label htmlFor="NName" className='whitespace-nowrap'>Nominee Name :</label>
                                                <input type="text" name="NName" id="NName" value={data.NName} onChange={handleChange} className='w-full outline-none px-2 py-1' />
                                            </div>

                                            <div className='flex flex-col md:flex-row gap-1 md:gap-3 border-b-2'>
                                                <label htmlFor="NAge" className='whitespace-nowrap'>Nominee Age :</label>
                                                <input type="text" name="NAge" id="NAge" value={data.NAge} onChange={handleChange} className='w-full outline-none px-2 py-1' />
                                            </div>

                                            <div className='flex flex-col md:flex-row gap-1 md:gap-3 border-b-2'>
                                                <label htmlFor="relation" className='whitespace-nowrap'>Relationship :</label>
                                                <input type="text" name="relation" id="relation" value={data.relation} onChange={handleChange} className='w-full outline-none px-2 py-1' />
                                            </div>

                                            <div className='flex flex-col md:flex-row gap-1 md:gap-3 border-b-2'>
                                                <label htmlFor="NomAddr" className='whitespace-nowrap'>Nominee Address :</label>
                                                <input type="text" name="NomAddr" id="NomAddr" value={data.NomAddr} onChange={handleChange} className='w-full outline-none px-2 py-1' />
                                            </div>

                                        </div>


                                    </div>

                                </div>

                                <button type='submit' className='bg-blue-700 py-1 px-2 rounded text-white font-semibold'>{changeValue ? 'Save' : 'Submit'}</button>
                            {/* </div> */}
                        </div>
                    </form>
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
                                placeholder='Enter Member Id...'
                                value={search.content}
                                onChange={findData}
                            />
                            <p onClick={() => setOpenSearch(false)} className='text-xl  text-black' ><RxCross2 className="font-bold" /></p>
                        </div>

                    )}
                </div>
            </div>
        </AdminLayout>
    )
}

export default MemberPage