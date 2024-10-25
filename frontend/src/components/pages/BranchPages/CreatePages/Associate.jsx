import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BranchLayout from '../../../Layout/BranchLayout.jsx'
import showToast from 'show-toast';
import axios from 'axios';
import { RxCross2 } from "react-icons/rx";
import { MdDelete, MdEdit } from "react-icons/md";
import { useSelector } from 'react-redux';
import searchGif from '../../../../assets/createmenu/gif/target.gif'
const Associate = () => {
    const [accessmemberdata, setMemberData] = useState('')
    const [suggetionofmember, setsuggetionofmember] = useState([])
    const [Id, setId] = useState('');
    const [search, setSearch] = useState('')
    const [openSearch, setOpenSearch] = useState(false);
    const [preview, setPreview] = useState(null);
    const [popUp, setPopUp] = useState(false);
    const [changeValue, setchangeValue] = useState(false);
    const [rotate, setRotate] = useState(false);
    const [allResult, setAllResult] = useState([]);
    const user = localStorage.getItem('uid');
    const ranks = useSelector(state => state?.user?.rank)
    const [selectedState, setSelectedState] = useState('');
    const [image, setImage] = useState('')
    const [stateResult, setStateResult] = useState([])
    const [OfficeC, setOfficeC] = useState('');
    const [IntrodCode, setIntrodCode] = useState({ IntrodCode: '' });
    const [introDucerCode, setintroDucerCode] = useState([]);
    const [data, setData] = useState({
        user: user || 'NA',
        performance: '',
        IntrodName: '',
        MName: '',
        designation: '',
        blood: '',
        Occupation: '',
        Qualif: '',
        Pan: '',
        passNo: '',
        DLNo: '',
        Icard: '',
        bankName: '',
        BankCode: '',
        AccountNo: '',
        IFSC: '',
        BankAddr: '',
        Landline: '',
        email: '',
        company: '',
        experience: '',
        CompanyAdd: '',
        NName: '',
        NAge: '',
        relation: '',
        NomAddr: '',
        organization: '',
        AreaOccu: '',
        TSize: '',
        FormFee: '',
        memberId: '',
        FaHuName: '',
        gender: '',
        DOB: '',
        JoinDate: '',
        Appliname: '',
        Mobile: '',
        PinCode: '',
        district: '',
        Address: ''
    });

    const handleChange = async (e) => {
        const { name, value } = e.target;
        const updatedData = {
            ...data,
            [name]: value,
        };
        setData(updatedData);
    };

    // handle intro code
    const handleIntrodCode = async (e) => {
        const intro = e.target.value;
        setIntrodCode({ IntrodCode: intro });
        try {
            const response = await axios.post(`/api/v1/introducer_code/${intro}`);
            if (response.data.success) {
                setintroDucerCode(response.data.result);
            }
        } catch (error) {
            console.log('Something went wrong:', error);
        }
    };

    // handle image
    const handleImage = async (e) => {
        const file = e.target.files[0]
        setImage(file)
    }

    const acessData = async () => {
        try {
            const response = await axios.get('/api/v1/getall-associate')
            if (response.data.success) {
                setAllResult(response.data.result)
            }
        } catch (error) {
            console.log('Something wrong during access rank')
        }
    }

    // Create Rank function
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (IntrodCode && OfficeC && image && selectedState) {
                const formData = new FormData();
                formData.append('image', image);
                formData.append('state', selectedState);
                formData.append('IntrodCode', IntrodCode.IntrodCode);
                formData.append('OfficeC', OfficeC);

                for (const [key, value] of Object.entries(data)) {
                    formData.append(key, value);
                }

                const response = await axios.post('/api/v1/create-associate', formData);

                if (response.data.success) {
                    showToast({
                        str: response.data.message,
                        time: 1000
                    });
                    setTimeout(() => { window.location.reload() }, 500)
                    setImage('');
                    setData({});
                    setSelectedState('');
                    setOfficeC('');
                    setIntrodCode({});
                    setPopUp(false);
                    acessData();
                }
            } else {
                showToast({
                    str: 'Please fill in all required fields',
                    time: 1000
                });
            }
        } catch (error) {
            console.log('Error during submission:', error);
            showToast({
                str: 'Submission failed. Please try again.',
                time: 1000
            });
        }
    };


    const handleClick = async () => { setPopUp(true) }
    //   get ranks



    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            if (IntrodCode && OfficeC && Id && image) {
                const formData = new FormData();
                formData.append('image', image);
                formData.append('state', selectedState);
                formData.append('OfficeC', OfficeC.OfficeC);
                formData.append('IntrodCode', IntrodCode.IntrodCode)
                for (const [key, value] of Object.entries(data)) {
                    formData.append(key, value);
                }

                const response = await axios.put(`/api/v1/update-associate/${Id}`, formData);
                if (response.data.success) {
                    showToast({ str: response.data.message });
                }
                setId('');
                setPopUp(false);
                acessData();
                setData({});
                setImage('')
                setSelectedState('');
                setOfficeC('');
                setIntrodCode({ IntrodCode: '' })
            }
        } catch (error) {
            alert('Something went wrong');
        }
    };



    // access district
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

    useEffect(() => {
        acessData()
    }, []);

    const handleIntro = (value) => {
        setIntrodCode({
            IntrodCode: value.C_Id,
        });
        setData({
            IntrodName: value.Appliname
        })

        const scrollView = document.getElementById('IntrodCode');
        if (scrollView) {
            scrollView.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        const filteredSuggestions = introDucerCode.filter((el) => el.IntrodCode !== value);
        setintroDucerCode();
    };

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


    // access member id and name
    const accessMember = async (e) => {
        const value = e.target.value
        setMemberData(value)
        try {
            const { data } = await axios.post(`/api/v1/access_member_id_name/${value}`)
            if (data.success) {
                setsuggetionofmember(data.result)
            }
        } catch (error) {
            console.log('Error in access mmber', error.message)
        }
    }

    // set member id on input
    const handleMemberData = async (value) => {
        setMemberData(value)

        const scrollView = document.getElementById('suggestion')
        scrollView.scrollIntoView({ behavior: 'smooth', block: 'nearest' })

        suggetionofmember.filter(el => el.M_Id !== value)
        setsuggetionofmember()
    }

    const searchData = async (e) => {
        e.preventDefault();
        try {
            if (accessmemberdata) {
                const res = await axios.post('/api/v1/load-on-member-data', { accessmemberdata }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if (res.data.success) {
                    const values = res.data.result[0]
                    setOfficeC(values.BranchCode)
                    setSelectedState(values.state)
                    setData({
                        ...data,
                        FormFee: values.FormFee,
                        memberId: values.M_Id,
                        FaHuName: values.So,
                        gender: values.gender,
                        DOB: values.DOB,
                        JoinDate: values.JoinDate,
                        Appliname: values.MemberName,
                        Mobile: values.Mobile,
                        PinCode: values.PinCode,
                        district: values.district,
                        Address: values.Address
                    });

                }
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <BranchLayout>
            <div className='w-full h-full bg-white shadow-2xl flex flex-col gap-5  relative'>
                <div className='h-14 flex items-center sm:mx-12 mx-5 justify-between shadow md:px-3 px-1'>
                    <p className='md:text-xl text-gray-400 font-semibold'>Create Associate</p>
                    <Link onClick={handleClick} className='text-center text-sm create px-2 py-1 shadow-md bg-blue-600 text-white hover:bg-blue-800 hover:border-2 cursor-pointer rounded-full'>
                        Create New Associate
                    </Link>
                </div>
                <div className='overflow-scroll w-full lg:h-[76.8vh] h-[73.4vh]' style={{ boxShadow: '0 0 5px 2px #ddd' }}>
                    <table className='w-full userTable p-1'>
                        <thead>
                            <tr className='px-1 sticky' style={{ background: '#3e3e3e', color: 'aliceblue' }}>
                                <th>Sr No</th>
                                <th>C_ID</th>
                                <th>Branch Code</th>
                                <th>Applicant Name</th>
                                <th>Introd_Code</th>
                                <th>Designation</th>
                                <th>Date of Birth</th>
                                <th>Date of Joining</th>
                                {/* <th>Action</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {
                                allResult.map((items, index) => (
                                    <tr key={index}>
                                        <td className='p-2'>{index + 1}</td>
                                        <td>{items.C_Id}</td>
                                        <td>{items.OfficeC}</td>
                                        <td>{items.Appliname}</td>
                                        <td>{items.IntrodCode}</td>
                                        <td>{items.designation}</td>
                                        <td>{items.DOB}</td>
                                        <td>{items.JoinDate}</td>
                                        {/* <td className='flex gap-2 items-center justify-center my-2'>
                                            <button className='p-2 shadow-md rounded-full text-lg hover:bg-green-700 hover:border hover:shadow-md hover:shadow-green-600 text-white bg-green-600' onClick={() => handleEdit(items)}><MdEdit /></button>
                                            <button className='p-2 shadow-md rounded-full text-lg hover:bg-red-700 hover:border hover:shadow-md hover:shadow-red-600 text-white bg-red-600' onClick={() => handleDelete(items)}><MdDelete /></button>
                                        </td> */}
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
                {popUp && (
                    <>
                        <form onSubmit={changeValue ? handleUpdate : handleSubmit} style={{ zIndex: '100' }} className='absolute w-full top-14'>
                            <div className='bg-white py-6 rounded flex flex-col  relative sm:mx-12 mx-3 overflow-y-scroll h-[75vh] shadow-current shadow-sm font-serif sm:px-4  gap-2 md:gap-6'>
                                <p className={`absolute top-4 right-4 text-xl transition-transform duration-300 ${rotate ? 'rotate-180' : ''}`} onClick={() => {
                                    setTimeout(() => { setPopUp(false) }, 200);
                                    setSelectedState('');
                                    setOfficeC(''); setData(''); setImage(''); setRotate(!rotate); setIntrodCode({ IntrodCode: '' }); setPreview(null)
                                }}>
                                    <RxCross2 />
                                </p>

                                <div className='lg:flex lg:gap-4 lg:justify-between cust '>

                                    <div className='flex flex-col  gap-2'>

                                        <div className='flex flex-col gap-5 shadow-lg p-4'>
                                            <p className='font-bold text-lg'>Personal Details</p>

                                            <div className='flex flex-col md:flex-row gap-1 border-b-2 relative'>
                                                <label htmlFor="OfficeC" className='whitespace-nowrap'>Branch Code :</label>
                                                <input
                                                    type="text"
                                                    name="OfficeC"
                                                    id="OfficeC"
                                                    readOnly
                                                    required
                                                    value={OfficeC}
                                                    className='w-full outline-none px-2 py-1'
                                                />
                                            </div>


                                            <div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                                <label htmlFor="Appliname" className='whitespace-nowrap'>Name of Applicant :</label>
                                                <input type="text" name="Appliname" id="Appliname" readOnly required value={data.Appliname} onChange={handleChange} className='w-full outline-none px-2 py-1' />
                                            </div>
                                            <div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                                <label htmlFor="memberId" className='whitespace-nowrap'>Member Id :</label>
                                                <input type="text" name="memberId" id="memberId" readOnly required value={data.memberId} onChange={handleChange} className='w-full outline-none px-2 py-1' />
                                            </div>
                                            <div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                                <label htmlFor="FormFee" className='whitespace-nowrap'>Form Fee :</label>
                                                <input type="text" name="FormFee" id="FormFee" readOnly required value={data.FormFee} onChange={handleChange} className='w-full outline-none px-2 py-1' />
                                            </div>


                                            <div className='flex flex-col md:flex-row gap-1  border-b-2 relative'>
                                                <label htmlFor="IntrodCode" className='whitespace-nowrap'>
                                                    Introducer Code :
                                                </label>
                                                <input
                                                    type="text"
                                                    name="IntrodCode"
                                                    id="IntrodCode"
                                                    required
                                                    value={IntrodCode.IntrodCode}
                                                    onKeyPress={(e) => {
                                                        if (!/^[0-9]+$/.test(e.key)) {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                    onChange={handleIntrodCode}
                                                    // onBlur={response}
                                                    className='w-full outline-none px-2 py-1'
                                                />
                                                <div className='md:w-[18vw] w-full bg-white shadow-md max-h-20 overflow-y-scroll absolute left-0 top-full md:mr-auto md:ml-[150px]'>
                                                    {introDucerCode &&
                                                        introDucerCode.map((el, index) => (
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
                                            <div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                                <label htmlFor="IntrodName" className='whitespace-nowrap'>Introducer Name :</label>
                                                <input type="text" name="IntrodName" id="IntrodName" required value={data.IntrodName} onChange={handleChange} className='w-full outline-none px-2 py-1' />
                                            </div>

                                            <div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                                <label htmlFor="FaHuName" className='whitespace-nowrap'>Father/Husband Name :</label>
                                                <input type="text" name="FaHuName" id="FaHuName" readOnly required value={data.FaHuName} onChange={handleChange} className='w-full outline-none px-2 py-1' />
                                            </div>

                                            <div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                                <label htmlFor="MName" className='whitespace-nowrap'>Mother Name :</label>
                                                <input type="text" name="MName" id="MName" required value={data.MName} onChange={handleChange} className='w-full outline-none px-2 py-1' />
                                            </div>

                                            <div className='flex flex-col md:flex-row gap-1  '>
                                                <label htmlFor="" className='whitespace-nowrap '>Select Gender :</label>
                                                <div className='w-full flex gap-3'>
                                                    <input type="radio" name="gender" id="" value='male' readOnly checked={data.gender == 'male'} onChange={handleChange} className='text-[0.9rem] outline-none' />Male
                                                    <input type="radio" name="gender" id="" value='female' readOnly checked={data.gender == 'female'} onChange={handleChange} className='text-[0.9rem] outline-none  ' />Female
                                                </div>
                                            </div>

                                            <div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                                <label htmlFor="MName" className='whitespace-nowrap'>Designation :</label>
                                                <select name="designation" id="" required value={data.designation} onChange={handleChange} className='w-full outline-none px-2 py-1'>
                                                    <option value="">-- Select Rank --</option>
                                                    {
                                                        ranks && ranks.length > 0 ?
                                                            ranks.map((rank, index) => (
                                                                <option key={index} value={rank.cader}>{rank.cader}</option>
                                                            ))
                                                            :
                                                            <option value="">No ranks available</option>
                                                    }
                                                </select>
                                            </div>

                                            <div className='flex flex-col md:flex-row gap-1  border-b-2 mt-5'>
                                                <label htmlFor="JoinDate" className='whitespace-nowrap'>Date of Joining :</label>
                                                <input type="date" name="JoinDate" id="JoinDate" readOnly required value={data.JoinDate} onChange={handleChange} className='w-full outline-none px-2 py-1' />
                                            </div>

                                            <div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                                <label htmlFor="DOB" className='whitespace-nowrap'>Date of Birth :</label>
                                                <input type="date" name="DOB" id="DOB" readOnly required value={data.DOB} onChange={handleChange} className='w-full outline-none px-2 py-1' />
                                            </div>

                                            <div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                                <label htmlFor="blood" className='whitespace-nowrap'>Blood Group :</label>
                                                <input type="text" name="blood" id="blood" maxLength={3} required value={data.blood} onChange={handleChange} className='w-full outline-none px-2 py-1' />
                                            </div>

                                            <div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                                <label htmlFor="Occupation" className='whitespace-nowrap'>Occupation :</label>
                                                <input type="text" name="Occupation" id="Occupation" required value={data.Occupation} onChange={handleChange} className='w-full outline-none px-2 py-1' />
                                            </div>

                                            <div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                                <label htmlFor="Qualif" className='whitespace-nowrap'>Qualification :</label>
                                                <input type="text" name="Qualif" id="Qualif" required value={data.Qualif} onChange={handleChange} className='w-full outline-none px-2 py-1' />
                                            </div>
                                        </div>

                                        <div className='flex flex-col gap-5 shadow-lg p-5 mt-2'>
                                            <p className='font-bold text-lg'>Bank Details</p>

                                            <div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                                <label htmlFor="Pan" className='whitespace-nowrap'>PAN No :</label>
                                                <input type="text" name="Pan" id="Pan" required maxLength={10} value={data.Pan} onChange={handleChange} className='w-full outline-none px-2 py-1' />
                                            </div>

                                            <div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                                <label htmlFor="passNo" className='whitespace-nowrap'>Passport No :</label>
                                                <input type="text" name="passNo" id="passNo" maxLength={8} required value={data.passNo} onChange={handleChange} className='w-full outline-none px-2 py-1' />
                                            </div>

                                            <div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                                <label htmlFor="DLNo" className='whitespace-nowrap'>Driving Licence No :</label>
                                                <input type="text" name="DLNo" id="DLNo" maxLength={7} required value={data.DLNo} onChange={handleChange} className='w-full outline-none px-2 py-1' />
                                            </div>

                                            <div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                                <label htmlFor="Icard" className='whitespace-nowrap'>Icard No :</label>
                                                <input type="text" name="Icard" id="Icard" required value={data.Icard} onChange={handleChange} className='w-full outline-none px-2 py-1' />
                                            </div>


                                            <div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                                <label htmlFor="bankName" className='whitespace-nowrap'>Bank Name :</label>
                                                <input type="text" name="bankName" id="bankName" required value={data.bankName} onChange={handleChange} className='w-full outline-none px-2 py-1' />
                                            </div>

                                            <div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                                <label htmlFor="BankCode" className='whitespace-nowrap'>Bank Code :</label>
                                                <input type="text" name="BankCode" id="BankCode" required value={data.BankCode} onChange={handleChange} className='w-full outline-none px-2 py-1' />
                                            </div>

                                            <div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                                <label htmlFor="AccountNo" className='whitespace-nowrap'>Bank A/C No :</label>
                                                <input type="text" name="AccountNo" id="AccountNo" required value={data.AccountNo} onChange={handleChange} className='w-full outline-none px-2 py-1' />
                                            </div>

                                            <div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                                <label htmlFor="IFSC" className='whitespace-nowrap'>IFSC Code :</label>
                                                <input type="text" name="IFSC" id="IFSC" required value={data.IFSC} onChange={handleChange} className='w-full outline-none px-2 py-1' />
                                            </div>

                                            <div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                                <label htmlFor="BankAddr" className='whitespace-nowrap'>Bank Address :</label>
                                                <input type="text" name="BankAddr" id="BankAddr" required value={data.BankAddr} onChange={handleChange} className='w-full outline-none px-2 py-1' />
                                            </div>

                                            <div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                                <label htmlFor="Mobile" className='whitespace-nowrap'>Mobile No :</label>
                                                <input type="text" name="Mobile" id="Mobile" maxLength={10}
                                                    onKeyPress={(e) => {
                                                        if (!/^[0-9]+$/.test(e.key)) {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                    required readOnly value={data.Mobile} onChange={handleChange} className='w-full outline-none px-2 py-1' />
                                            </div>

                                        </div>

                                    </div>

                                    {/* this is second section */}
                                    <div className='flex flex-col gap-2'>

                                        <div className='flex-col gap-5 shadow-lg p-5 flex'>
                                            <p className='font-bold text-lg'>Address Details</p>

                                            <div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                                <label htmlFor="Address" className='whitespace-nowrap'>Address :</label>
                                                <input type="text" name="Address" id="Address" required value={data.Address} onChange={handleChange} className='w-full outline-none px-2 py-1' />
                                            </div>

                                            <div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                                <label htmlFor="State" className='whitespace-nowrap'>State :</label>
                                                <input type="text" name="state" id="State" required value={selectedState} onChange={accessDistict} className='w-full outline-none px-2 py-1' />
                                            </div>

                                            <div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                                <label htmlFor="State" className='whitespace-nowrap'>District :</label>
                                                {
                                                    stateResult && (
                                                        <select name="district" value={data.district} readOnly required onChange={handleChange} id="" className='w-full outline-none px-2 py-1'>
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

                                            <div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                                <label htmlFor="PinCode" className='whitespace-nowrap'>Pin Code :</label>
                                                <input type="text" name="PinCode" id="PinCode" required readOnly maxLength={6} value={data.PinCode} onChange={handleChange} className='w-full outline-none px-2 py-1' />
                                            </div>

                                            <div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                                <label htmlFor="Landline" className='whitespace-nowrap'>LandLine No :</label>
                                                <input type="text" name="Landline" id="Landline" required value={data.Landline} onChange={handleChange} className='w-full outline-none px-2 py-1' />
                                            </div>

                                            <div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                                <label htmlFor="email" className='whitespace-nowrap'>Email :</label>
                                                <input type="text" name="email" id="email" required value={data.email} onChange={handleChange} className='w-full outline-none px-2 py-1' />
                                            </div>

                                        </div>

                                        <div className='flex-col gap-5 shadow-lg p-5 flex'>
                                            <p className='font-bold text-lg'>Nominee Details</p>

                                            <div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                                <label htmlFor="NName" className='whitespace-nowrap'>Nominee Name :</label>
                                                <input type="text" name="NName" id="NName" required value={data.NName} onChange={handleChange} className='w-full outline-none px-2 py-1' />
                                            </div>

                                            <div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                                <label htmlFor="NAge" className='whitespace-nowrap'>Nominee Age :</label>
                                                <input type="text" name="NAge" id="NAge" required value={data.NAge} onChange={handleChange} className='w-full outline-none px-2 py-1' />
                                            </div>

                                            <div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                                <label htmlFor="relation" className='whitespace-nowrap'>Relationship :</label>
                                                <input type="text" name="relation" id="relation" required value={data.relation} onChange={handleChange} className='w-full outline-none px-2 py-1' />
                                            </div>

                                            <div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                                <label htmlFor="NomAddr" className='whitespace-nowrap'>Nominee Address :</label>
                                                <input type="text" name="NomAddr" id="NomAddr" required value={data.NomAddr} onChange={handleChange} className='w-full outline-none px-2 py-1' />
                                            </div>

                                        </div>

                                        <div className='flex-col gap-5 shadow-lg p-5 flex'>
                                            <p className='font-bold text-lg'>Performance Details</p>

                                            <div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                            
                                                <div className='w-full flex gap-5'>
                                                 
                                                        <input type="radio" name="performance" id="" value='Fresher' checked={data.performance == 'Fresher'} onChange={handleChange} className='text-[0.9rem] outline-none' /> Fresher
                                                  
                                                   
                                                        <input type="radio" name="performance" id="" value='Experience' checked={data.performance == 'Experience'} onChange={handleChange} className='text-[0.9rem] outline-none  ' />Experience
                                                  
                                                </div>
                                            </div>
                                            {
                                                data.performance == 'Experience' && (
                                                    <>
                                                        <div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                                            <label htmlFor="company" className='whitespace-nowrap'>Company Name :</label>
                                                            <input type="text" name="company" id="company" required value={data.company} onChange={handleChange} className='w-full outline-none px-2 py-1' />
                                                        </div>

                                                        <div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                                            <label htmlFor="experience" className='whitespace-nowrap'>Total Experience :</label>
                                                            <input type="text" name="experience" id="experience" maxLength={3}
                                                                onKeyPress={e => {
                                                                    if (!/^[0-9]+$/.text(e.key)) {
                                                                        e.preventDefault()
                                                                    }
                                                                }}
                                                                required value={data.experience} onChange={handleChange} className='w-full outline-none px-2 py-1' />
                                                        </div>

                                                        <div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                                            <label htmlFor="CompanyAdd" className='whitespace-nowrap'>Company Address :</label>
                                                            <input type="text" name="CompanyAdd" id="CompanyAdd"
                                                                onKeyPress={e => {
                                                                    if (!/^[0-9]+$/.text(e.key)) {
                                                                        e.preventDefault()
                                                                    }
                                                                }}
                                                                required value={data.CompanyAdd} onChange={handleChange} className='w-full outline-none px-2 py-1' />
                                                        </div>
                                                    </>
                                                )
                                            }
                                        </div>


                                        <div className='flex-col gap-5 shadow-lg p-5 flex'>
                                            <p className='font-bold text-lg'>Experience Details</p>

                                            <div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                                <label htmlFor="organization" className='whitespace-nowrap'>Name of Organization :</label>
                                                <input type="text" name="organization" id="organization" required value={data.organization} onChange={handleChange} className='w-full outline-none px-2 py-1' />
                                            </div>

                                            <div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                                <label htmlFor="AreaOccu" className='whitespace-nowrap'>Area of Occupation :</label>
                                                <input type="text" name="AreaOccu" id="AreaOccu" required value={data.AreaOccu} onChange={handleChange} className='w-full outline-none px-2 py-1' />
                                            </div>

                                            <div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                                <label htmlFor="TSize" className='whitespace-nowrap'>Approximate No :</label>
                                                <input type="text" name="TSize" id="TSize" maxLength={3} required value={data.TSize} onChange={handleChange} className='w-full outline-none px-2 py-1' />
                                            </div>

                                            <div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                                <label htmlFor="" className='whitespace-nowrap'>Upload Image :</label>
                                                <input type="file" name="image" id="" onChange={handleImage} className='w-full outline-none px-2 py-1' />
                                            </div>
                                            {preview || image ? (
                                                <img
                                                    src={image && (image instanceof Blob || image instanceof File) ? URL.createObjectURL(image) : preview}
                                                    width={120}
                                                    height={120}
                                                    alt=""
                                                />
                                            ) : null}
                                        </div>

                                    </div>

                                </div>

                                <button type='submit' className='bg-blue-700 py-1 px-2 rounded text-white font-semibold'>{changeValue ? 'Save' : 'Submit'}</button>
                            </div>
                        </form>

                        {
                            popUp && (
                                <form action="" onSubmit={searchData} className="absolute top-8 md:left-[23vw] sm:left-[18vw] left-[13vw]" style={{ zIndex: '1000' }}>
                                    <div className="border px-3 py-1 bg-[#ddd] rounded-full flex gap-5 items-center shadow-md shadow-slate-300 relative">
                                        <input
                                            type="search"
                                            id='suggestion'
                                            placeholder="Enter Member Id..."
                                            className="rounded-full w-full md:w-[23vw] outline-none px-2"
                                            value={accessmemberdata}
                                            onChange={accessMember}
                                        />
                                        <button className="text-black font-semibold  border shadow-md px-2 py-1 rounded-full shadow-white whitespace-nowrap text-ellipsis line-clamp-2">
                                            Auto fill
                                        </button>
                                    </div>
                                    <div className="absolute w-full bg-white shadow-md rounded-lg max-h-26 top-full left-0">
                                        {suggetionofmember &&
                                            suggetionofmember.map((el, index) => (
                                                <p
                                                    key={index}
                                                    className="px-2 py-1 cursor-pointer hover:bg-[#ddd] hover:rounded-full"
                                                    onClick={() => handleMemberData(el.M_Id)}
                                                >
                                                    {accessmemberdata && /^[0-9]+$/.test(accessmemberdata) ? el.M_Id : el.MemberName}
                                                </p>
                                            ))}
                                    </div>
                                </form>

                            )
                        }
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
        </BranchLayout>
    )
}

export default Associate