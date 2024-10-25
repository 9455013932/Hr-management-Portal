import showToast from 'show-toast';
import axios from 'axios';
import { RxCross2 } from "react-icons/rx";
// import { MdDelete, MdEdit } from "react-icons/md";
import { supName, ProRefer, category, PaymentType } from '../../../common/index.jsx'
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import searchGif from '../../../../assets/createmenu/gif/target.gif'
import BranchLayout from '../../../Layout/BranchLayout.jsx'
import { ToWords } from 'to-words';
const Customer = () => {
    const [Id, setId] = useState('');
    const [preview, setPreview] = useState(null);
    const [Cpreview, setCPreview] = useState(null);
    const [popUp, setPopUp] = useState(false);
    const [changeValue, setchangeValue] = useState(false);
    const [rotate, setRotate] = useState(false);
    const [allResult, setAllResult] = useState([]);
    const [allProject, setAllProject] = useState([]);
    const user = localStorage.getItem('uid');
    const [image, setImage] = useState([])
    const [accessmemberdata, setMemberData] = useState('')
    const [IntroCode, setIntroCode] = useState({ IntroCode: '' })
    const [introDucerCode, setintroDucerCode] = useState([]);
    const [suggetionofmember, setsuggetionofmember] = useState([])
    const [search, setSearch] = useState('')
    const [openSearch, setOpenSearch] = useState(false);
    const toWords = new ToWords();
    const [data, setData] = useState({
        FormFee: '',
        image: '',
        BranchCode: '',
        user: user || 'NA',
        MemberId: '',
        Mobile: '',
        ApplicantName: '',
        IncomeGroup: '',
        SO: '',
        PropertyType: '',
        // IntroCode: '',
        IntroName: '',
        gender: '',
        Category: '',
        AgreeDate: '',
        DOB: '',
        EMI: '',
        Nationality: '',
        ProjectSize: '',
        PayDate: '',
        PAN: '',
        PayDMode: '',
        SupName: '',
        GaurdName: '',
        GaurdAge: '',
        PayMode: '',
        GuardAddr: '',
        PayableAt: '',
        AmountWord: '',
        bankName: '',
        branch: '',
        AccountNo: '',
        IFSC: '',
        Address: '',
        PayType: '',
        PayableAmount: '0',
        BookAmount: '0',
        Discount: 0,
        ProReference: '',
        PLCCost: '0',
        DeveCharge: '',
        ProCost: '0',
        ProjectName: '',
        AreaOccu: '',
        TSize: '',
        PayDDN: '',
        PayDrawNo: '',
        ChequeBank: '',
        ChequeAcc: '',
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
        TransHolderAC: '',
        TransType: '',
        relation: '',
        term: ''
    });

    const handleChange = async (e) => {
        const { name, value } = e.target
        const Data = ({
            ...data,
            [name]: value
        })
        setData(Data)
    }
    const handleChangeIntroCode = async (e) => {
        const intro = e.target.value;
        setIntroCode({ IntroCode: intro });

        try {
            const { data } = await axios.post(`/api/v1/introducer-customer/${intro}`);
            if (data.success) {
                setintroDucerCode(data.result);
            }
        } catch (error) {
            console.log(`Something went wrong: ${error.message}`);
        }
    };

    // handle image
    const handleImage = (e, index) => {
        const file = e.target.files[0];
        setImage((prev) => {
            const updatedImages = [...prev];
            updatedImages[index] = file;
            return updatedImages;
        });
    };
    // Create Rank function
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (image) {
                const formData = new FormData();
                image.forEach(el => formData.append('image', el));
                formData.append('IntroCode', IntroCode.IntroCode)
                for (const [key, value] of Object.entries(data)) {
                    formData.append(key, value);
                }
                const response = await axios.post('/api/v1/create-customer', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                if (response.data.success) {
                    showToast({
                        str: response.data.message,
                        duration: 1000
                    });
                    setPopUp(false);
                    setData({});
                    accessData();
                    setImage([])
                    setTimeout(() => {
                        window.location.reload()
                    }, 500);
                }
            }
        } catch (error) {
            console.log('Invalid Customer:', error);
        }
    };

    const handleClick = async () => { setPopUp(true) }
    //   get ranks

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {

            if (Id && image && image.length > 0) {
                const checkAray = Array.isArray(image) ? image : [image]
                const formData = new FormData();
                checkAray.forEach(el => formData.append('image', el));
                for (const [key, value] of Object.entries(data)) {
                    formData.append(key, value);
                }
                formData.append('IntroCode', IntroCode.IntroCode)
                const response = await axios.put(`/api/v1/update-customer/${Id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                if (response.data.success) {
                    showToast({ str: response.data.message });
                } else {
                    showToast({ str: 'Failed to update customer' });
                }
                setId('');
                setPopUp(false);
                accessData();
            } else {
                showToast({ str: 'Please select an image and provide an ID' });
            }
        } catch (error) {
            console.error('Something went wrong during the update:', error);
            showToast({ str: 'An error occurred while updating the customer' });
        }
    };

    // access customer data
    const accessData = async () => {
        try {
            const { data } = await axios.get('/api/v1/getall-customer')
            if (data.success) {
                setAllResult(data.result)
            }
        } catch (error) {
            console.log(error.message)
        }
    }

    // access project
    const accessproject = async () => {
        try {
            const response = await axios.get('/api/v1/get-Project');
            if (response.data.success) {
                setAllProject(response.data.result);
            }
        } catch (error) {
            console.error('Error accessing projects', error);
        }
    };
    useEffect(() => {
        accessproject()
        accessData()
    }, []);

    //  slect value in member id from sugggetion
    const handleIntro = (value) => {
        if (value) {
            setIntroCode({
                IntroCode: value.C_Id,
            });
            setData({
                IntroName: value.ApplicantName,
            });
        }

        const scrollView = document.getElementById('IntroCode');
        scrollView.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        setintroDucerCode(prevState => prevState.filter(el => el.C_Id !== value.C_Id));
        setintroDucerCode()
    };
    // handle blur for select project price
    const handleBlur = async () => {
        const ProjectName = data.ProjectName;
        let plotSize = parseInt(data?.ProjectSize);

        if (isNaN(plotSize) || plotSize <= 0) {
            console.log('Invalid plot size');
            return;
        }

        try {
            if (ProjectName) {
                const { data: response } = await axios.post('/api/v1/get-plot-price', { ProjectName });
                // console.log(data)
                if (response.success) {

                    let projectPrice = parseInt(response.result[0].proprice);
                    const term = response.result[0]['Term(yr)'];

                    if (data.ProCost !== projectPrice * plotSize) {
                        setData({
                            ...data,
                            ProCost: projectPrice * plotSize,
                            PayableAmount: projectPrice * plotSize,
                            term: term
                        });
                    }

                }
            }
        } catch (error) {
            console.log('Plot amount not assigned', error);
        }
    };

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

    // searchData from member
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
                    setData({
                        ...data,
                        BranchCode: values.BranchCode,
                        FormFee: values.FormFee,
                        MemberId: values.M_Id,
                        SO: values.So,
                        gender: values.gender,
                        DOB: values.DOB,
                        Category: values.Category,
                        ApplicantName: values.MemberName,
                        Mobile: values.Mobile,
                        SupName: values.SupName,
                        AgreeDate: values.JoinDate,
                        Address: values.Address,
                        Nationality: values.nationality,
                        PAN: values.PAN,

                    });

                }
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    const handleMemberData = async (value) => {
        setMemberData(value)

        const scrollView = document.getElementById('suggestion')
        scrollView.scrollIntoView({ behavior: 'smooth', block: 'nearest' })

        suggetionofmember.filter(el => el.M_Id !== value)
        setsuggetionofmember()
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

    // handle payment blur
    const handlePayBlur = async () => {
        let plotcost = parseInt(data?.ProCost) || 0;
        let discount = parseFloat(data?.Discount) || 0;
        let plcCost = parseInt(data?.PLCCost) || 0;
        let developmentCharge = parseInt(data?.DeveCharge) || 0;

        let totalAmount = plotcost;

        if (discount > 0) {
            totalAmount -= totalAmount * (discount / 100);
        }

        if (plcCost > 0) {
            totalAmount += plotcost * (plcCost / 100);
        }

        if (developmentCharge > 0) {
            totalAmount += plotcost * (developmentCharge / 100);
        }

        setData({
            ...data,
            PayableAmount: totalAmount.toString(),
        });
    };

    // handle emi charge 
    const mode = data.PayMode;
    const term = parseInt(data.term, 10);
    const bookingCharge = parseInt(data.BookAmount, 10) || 0;
    const payableAmount = parseInt(data.PayableAmount, 10);
     const amountInWords = toWords.convert(bookingCharge);

    let restAmount = payableAmount - bookingCharge;
    let emiAmount;
    const handlePayCharge = async () => {

        if (term > 0) {
            switch (mode) {
                case 'Monthly':
                    emiAmount = restAmount / (term * 12);
                    break;
                case 'Quaterly':
                    emiAmount = restAmount / (term * 4);
                    break;
                case 'Halfyearly':
                    emiAmount = restAmount / (term * 2);
                    break;
                case 'Yearly':
                    emiAmount = restAmount / term;
                    break;
                default:
                    console.warn('Unexpected PayMode:', mode);
                    break;
            }
        }

        setData(prevData => ({
            ...prevData,
            EMI: Math.ceil(emiAmount),
            AmountWord:amountInWords
        }));
    };

    useEffect(() => {
        if (data.PayMode) {
            handlePayCharge();
        }
    }, [data.PayMode, data.term, data.BookAmount, data.PayableAmount]);

    return (
        <BranchLayout>
            <div className='w-full h-full bg-white shadow-2xl flex flex-col gap-5  relative'>
                <div className='h-14 flex items-center sm:mx-12 mx-5 justify-between shadow md:px-3 px-1'>
                    <p className='md:text-xl text-gray-400 font-semibold'>Create Customer</p>
                    <Link onClick={handleClick} className='text-center text-sm create px-2 py-1 shadow-md bg-blue-600 text-white hover:bg-blue-800 hover:border-2 cursor-pointer rounded-full'>
                        Create New Customer
                    </Link>
                </div>
                <div className='overflow-scroll w-full lg:h-[76.8vh] h-[73.4vh]' style={{ boxShadow: '0 0 5px 2px #ddd' }}>
                    <table className='w-full userTable p-1'>
                        <thead>
                            <tr className='px-1 sticky' style={{ background: '#3e3e3e', color: 'aliceblue' }}>
                                <th>Sr No</th>
                                <th>Branch Code</th>
                                <th>Member_Id</th>
                                <th>Name_Applicant</th>
                                <th>S/D/W_O</th>
                                <th>Mobile</th>
                                <th>Introducer_Code</th>
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
                                        <td className='p-2'>{items.BranchCode}</td>
                                        <td className='p-2'>{items.MemberId}</td>
                                        <td className='p-2'>{items.ApplicantName}</td>
                                        <td className='p-2'>{items.SO}</td>
                                        <td className='p-2'>{items.Mobile}</td>
                                        <td className='p-2'>{items.IntroCode}</td>
                                        <td className='p-2'>{items.DOB}</td>
                                        <td className='p-2'>{items.AgreeDate}</td>
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
                        <form target='_blank' onSubmit={changeValue ? handleUpdate : handleSubmit} style={{ zIndex: '100' }} className='absolute w-full top-14'>
                            <div className='bg-white py-6 rounded flex flex-col  relative sm:mx-10 mx-3 overflow-y-scroll h-[75vh] shadow-current shadow-sm font-serif sm:px-4  gap-2 md:gap-6'>
                                <p className={`absolute top-4 right-4 text-xl transition-transform duration-300 ${rotate ? 'rotate-180' : ''}`} onClick={() => { setTimeout(() => { setPopUp(false) }, 200); setData(''); setImage([]); setRotate(!rotate); }}>
                                    <RxCross2 />
                                </p>

                                <div className='lg:flex lg:gap-4 lg:justify-between cust '>

                                    <div className='flex flex-col  gap-2'>

                                        <div className='flex flex-col gap-5 shadow-lg p-4'>
                                            <p className='font-bold text-lg'>Personal Details</p>

                                            <div className='flex flex-col md:flex-row gap-1  border-b-2 relative'>
                                                <label htmlFor="BranchCode" className='whitespace-nowrap'>Branch Code :</label>
                                                <input type="text" name="BranchCode" id="BranchCode" maxLength={4} value={data.BranchCode} readOnly onChange={handleChange} className='w-full outline-none px-2 py-1' />
                                            </div>

                                            <div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                                <label htmlFor="FormFee" className='whitespace-nowrap'>Form Fee :</label>
                                                <input type="text" name="FormFee" id="FormFee"
                                                    onKeyPress={(e) => {
                                                        if (!/^[0-9.]+$/.test(e.key)) {
                                                            e.preventDefault()
                                                        }
                                                    }} value={data.FormFee} onChange={handleChange} readOnly className='w-full outline-none px-2 py-1' />
                                            </div>

                                            <div className='flex flex-col md:flex-row gap-1  border-b-2 '>
                                                <label htmlFor="MemberId" className='whitespace-nowrap'>Member Id :</label>
                                                <input type="text" name="MemberId" id="MemberId" value={data.MemberId}
                                                    onKeyPress={(e) => {
                                                        if (!/^[0-9.]+$/.test(e.key)) {
                                                            e.preventDefault()
                                                        }
                                                    }}
                                                    readOnly
                                                    onChange={handleChange} className='w-full outline-none px-2 py-1' />

                                            </div>

                                            <div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                                <label htmlFor="ApplicantName" className='whitespace-nowrap'>Name of Applicant:</label>
                                                <input type="text" name="ApplicantName" id="ApplicantName"
                                                    onKeyPress={(e) => {
                                                        if (!/^[a-z A-Z]+$/.test(e.key)) {
                                                            e.preventDefault()
                                                        }
                                                    }}
                                                    value={data.ApplicantName} readOnly onChange={handleChange} className='w-full outline-none px-2 py-1' />
                                            </div>

                                            <div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                                <select name="SupName" id="SupName" value={data.SupName} readOnly onChange={handleChange} className=' w-[240px] outline-none px-2 py-1'>
                                                    <option value=""> Select </option>
                                                    {
                                                        supName.map((el, index) => (
                                                            <option key={el.Id} value={el.name}>{el.name}</option>
                                                        ))
                                                    }
                                                </select>
                                                <input type="text" name="SO" id="SO" value={data.SO} readOnly onChange={handleChange} className='w-full outline-none px-2 py-1' />
                                            </div>

                                            <div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                                <label htmlFor="Category" className='whitespace-nowrap'>Category :</label>
                                                <select name="Category" id="Category" value={data.Category} readOnly onChange={handleChange} className='w-full outline-none px-2 py-1'>
                                                    <option value="">-- Select Category --</option>
                                                    {
                                                        category.map(el => (
                                                            <option key={el.Id} value={el.name}>{el.name}</option>
                                                        ))
                                                    }
                                                </select>
                                            </div>

                                            <div className='flex flex-col md:flex-row gap-1  '>
                                                <label htmlFor="IncomeGroup" className='whitespace-nowrap '>Income Group :</label>
                                                <select name="IncomeGroup" id="IncomeGroup" value={data.IncomeGroup} onChange={handleChange} className='w-full outline-none px-2 py-1'>
                                                    <option value="">-- Select Income Group --</option>
                                                    <option value="Lower Income Group">Lower Income Group</option>
                                                    <option value="Middle Income Group">Middle Income Group</option>
                                                    <option value="Upper Income Group">Upper Income Group</option>
                                                </select>
                                            </div>

                                            <div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                                <label htmlFor="Address" className='whitespace-nowrap'>Address :</label>
                                                <input type="text" name="Address" id="Address" value={data.Address} readOnly onChange={handleChange} className='w-full outline-none px-2 py-1' />
                                            </div>

                                            <div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                                <label htmlFor="Mobile" className='whitespace-nowrap'>Mobile No :</label>
                                                <input type="text" name="Mobile" id="Mobile" maxLength={10} value={data.Mobile} readOnly onChange={handleChange}
                                                    onKeyPress={(e) => {
                                                        if (!/^[0-9]+$/.test(e.key)) {
                                                            e.preventDefault()
                                                        }
                                                    }}
                                                    className='w-full outline-none px-2 py-1' />
                                            </div>

                                            <div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                                <label htmlFor="IntroName" className='whitespace-nowrap'>Introducer Name :</label>
                                                <input type="text" name="IntroName" id="IntroName"
                                                    onKeyPress={e => {
                                                        if (!/^[a-z A-Z]+$/.test(e.key)) {
                                                            e.preventDefault()
                                                        }
                                                    }}
                                                    value={data.IntroName} onChange={handleChange} className='w-full outline-none px-2 py-1' />
                                            </div>

                                            <div className='flex flex-col md:flex-row gap-1 border-b-2 relative'>
                                                <label htmlFor="IntroCode" className='whitespace-nowrap'>Introducer Code :</label>
                                                <input
                                                    type="text"
                                                    name="IntroCode"
                                                    onKeyPress={e => {
                                                        if (!/^[0-9]+$/.test(e.key)) {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                    id="IntroCode"
                                                    value={IntroCode.IntroCode}
                                                    onChange={handleChangeIntroCode}
                                                    className='w-full outline-none px-2 py-1'
                                                />
                                                <div className='md:w-[18vw] w-full bg-white shadow-md max-h-[35vh] overflow-y-scroll absolute left-0 top-full md:mr-auto md:ml-[150px]'>
                                                    {introDucerCode && introDucerCode.map((el, index) => (
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


                                            <div className='flex flex-col md:flex-row gap-1  border-b-2 mt-5'>
                                                <label htmlFor="AgreeDate" className='whitespace-nowrap'>Date of Agreement :</label>
                                                <input type="date" name="AgreeDate" id="AgreeDate" readOnly value={data.AgreeDate} onChange={handleChange} className='w-full outline-none px-2 py-1' />
                                            </div>

                                            <div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                                <label htmlFor="DOB" className='whitespace-nowrap'>Date of Birth :</label>
                                                <input type="date" name="DOB" id="DOB" value={data.DOB} readOnly onChange={handleChange} className='w-full outline-none px-2 py-1' />
                                            </div>

                                            <div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                                <label htmlFor="Nationality" className='whitespace-nowrap'>Nationality :</label>
                                                <input type="text" name="Nationality" id="Nationality" readOnly value={data.Nationality} onChange={handleChange} className='w-full outline-none px-2 py-1' />
                                            </div>

                                        </div>

                                        <div className='flex flex-col gap-5 shadow-lg p-5 mt-2'>
                                            <p className='font-bold text-lg'>Guardian Details</p>

                                            <div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                                <label htmlFor="GaurdName" className='whitespace-nowrap'>Guardian Name :</label>
                                                <input type="text" name="GaurdName" id="GaurdName" value={data.GaurdName} onChange={handleChange} className='w-full outline-none px-2 py-1' />
                                            </div>

                                            <div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                                <label htmlFor="GaurdAge" className='whitespace-nowrap'>Guardian's Age :</label>
                                                <input type="text" name="GaurdAge" id="GaurdAge" value={data.GaurdAge} onChange={handleChange} className='w-full outline-none px-2 py-1' />
                                            </div>

                                            <div className='flex flex-col md:flex-row gap-1 md:gap-3 border-b-2'>
                                                <label htmlFor="relation" className='whitespace-nowrap'>Relationship :</label>
                                                <input type="text" name="relation" id="relation" required value={data.relation} onChange={handleChange} className='w-full outline-none px-2 py-1' />
                                            </div>

                                            <div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                                <label htmlFor="GuardAddr" className='whitespace-nowrap'>Guardian Address :</label>
                                                <input type="text" name="GuardAddr" id="GuardAddr" value={data.GuardAddr} onChange={handleChange} className='w-full outline-none px-2 py-1' />
                                            </div>

                                            <div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                                <label htmlFor="" className='whitespace-nowrap'>Upload Image :</label>
                                                <input type="file" name="image" id="" onChange={(e) => handleImage(e, 0)} className='w-full outline-none px-2 py-1' />
                                            </div>
                                            {image[0] || preview ? (
                                                <img
                                                    src={image[0] && (image[0] instanceof Blob || image[0] instanceof File) ? URL.createObjectURL(image[0]) : preview}
                                                    width={120}
                                                    height={120}
                                                    alt=""
                                                />
                                            ) : null}

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
                                            <p className='font-bold text-lg'>Property Details</p>

                                            <div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                                <label htmlFor="ProjectName" className='whitespace-nowrap'>Project Name :</label>
                                                <select name="ProjectName" id="ProjectName" value={data.ProjectName} onChange={handleChange} className='w-full outline-none px-2 py-1'>
                                                    <option value="">-- Select Project --</option>
                                                    {
                                                        allProject.map((project, index) => (
                                                            <option key={index + 1} value={project.projsite}>{project.projsite}</option>
                                                        ))
                                                    }
                                                </select>
                                            </div>

                                            <div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                                <label htmlFor="State" className='whitespace-nowrap'>Property Type :</label>
                                                <select name="PropertyType" value={data.PropertyType} onChange={handleChange} id="" className='w-full outline-none px-2 py-1'>
                                                    <option value="">-- Select Property Type --</option>
                                                    <option value="Residential">Residential</option>
                                                    <option value="Commertial">Commertial</option>
                                                </select>
                                            </div>

                                            <div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                                <label htmlFor="ProjectSize" className='whitespace-nowrap'>Plot Size(SqYd) :</label>
                                                <input type="text" name="ProjectSize" id="ProjectSize" value={data.ProjectSize} onChange={handleChange} onBlur={handleBlur} className='w-full outline-none px-2 py-1' />

                                            </div>



                                            <div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                                <label htmlFor="ProReference" className='whitespace-nowrap'>Preference :</label>
                                                <select name="ProReference" id="ProReference" value={data.ProReference} onChange={handleChange} className='w-full outline-none px-2 py-1'>
                                                    <option value="">-- Select --</option>
                                                    {
                                                        ProRefer.map(el => (
                                                            <option key={el.Id} value={el.name}>{el.name}</option>
                                                        ))
                                                    }
                                                </select>
                                            </div>

                                            <div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                                <label htmlFor="ProCost" className='whitespace-nowrap'>Plot Cost(Rs.) :</label>
                                                <input type="text" name="ProCost" id="ProCost" value={data.ProCost} readOnly onChange={handleChange} className='w-full outline-none px-2 py-1' />
                                            </div>

                                            <div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                                <label htmlFor="PayType" className='whitespace-nowrap'>Payment Type :</label>
                                                <select name="PayType" value={data.PayType} onChange={handleChange} id="PayType" className='w-full outline-none px-2 py-1'>
                                                    <option value="">-- Select Payment Type --</option>
                                                    {
                                                        PaymentType.map(el => (
                                                            <option key={el.Id} value={el.name}>{el.name}</option>
                                                        ))
                                                    }
                                                </select>
                                            </div>



                                            {
                                                data.PayType && (data.PayType === 'EMI Payment Plan' || data.PayType === 'Part Payment Plan') && (
                                                    <div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                                        <label htmlFor="BookAmount" className='whitespace-nowrap'>Booking Amount(Rs.) :</label>
                                                        <input type="text" name="BookAmount" id="BookAmount" value={data.BookAmount} onChange={handleChange} className='w-full outline-none px-2 py-1' />
                                                    </div>
                                                )
                                            }

                                            <div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                                <label htmlFor="term" className='whitespace-nowrap'>Term (yr) :</label>
                                                <select name="term" id="term" value={data.term} disabled={data.PayType === 'Full Payment Plan'} onChange={handleChange} className='w-full outline-none px-2 py-1'>
                                                    <option value="">-- Select --</option>
                                                    <option value={data.term}>{data.term}</option>
                                                </select>
                                            </div>


                                            <div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                                <label htmlFor="Discount" className='whitespace-nowrap'>Discount(%) :</label>
                                                <input type="text" name="Discount" id="Discount" value={data.Discount} onChange={handleChange} onBlur={handlePayBlur} className='w-full outline-none px-2 py-1' />
                                            </div>

                                            <div className='flex flex-col md:flex-row gap-1 border-b-2'>
                                                <label htmlFor="PLCCost" className='whitespace-nowrap'>PLC Cost(In %) :</label>
                                                <input
                                                    name="PLCCost" type="text" id="PLCCost" value={data.ProReference && data.ProReference === 'Normal' ? '0' : data.PLCCost}
                                                    onChange={handleChange} onBlur={handlePayBlur}
                                                    className='w-full outline-none px-2 py-1'
                                                    disabled={data.ProReference === 'Normal'}
                                                />
                                            </div>


                                            <div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                                <label htmlFor="DeveCharge" className='whitespace-nowrap'>Development Charge(%) :</label>
                                                <input type="text" name="DeveCharge" id="DeveCharge" value={data.DeveCharge} onChange={handleChange} onBlur={handlePayBlur} className='w-full outline-none px-2 py-1' />
                                            </div>

                                            <div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                                <label htmlFor="PayableAmount" className='whitespace-nowrap'>Payable Amount :</label>
                                                <div className='w-full flex gap-3 ms-4'>
                                                    <input type="text" name="PayableAmount" id="PayableAmount" value={data.PayableAmount} onChange={handleChange} className='w-full outline-none px-2 py-1' />
                                                </div>
                                            </div>

                                            <div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                                <label htmlFor="PayMode" className='whitespace-nowrap'>Payment Mode :</label>
                                                <select name="PayMode" id="PayMode" value={data.PayMode} onChange={(e) => { handleChange(e); handlePayCharge(e); }} className='w-full outline-none px-2 py-1'>
                                                    <option value="">-- Select Payment Mode --</option>
                                                    {
                                                        data.PayType && data.PayType === 'EMI Payment Plan' && (
                                                            <>
                                                                <option value="Monthly">Monthly</option>
                                                                <option value="Quaterly">Quaterly</option>
                                                                <option value="Halfyearly">Halfyearly</option>
                                                                <option value="Yearly">Yearly</option>
                                                            </>
                                                        )
                                                    }
                                                    {
                                                        data.PayType && data.PayType === 'Part Payment Plan' && (
                                                            <>
                                                                <option value="Part">Part</option>

                                                            </>
                                                        )
                                                    }
                                                    {
                                                        data.PayType && data.PayType === 'Full Payment Plan' && (
                                                            <>
                                                                <option value="Full">Full</option>

                                                            </>
                                                        )
                                                    }

                                                </select>
                                            </div>

                                            {
                                                data.PayType && data.PayType === 'EMI Payment Plan' && (<div className='flex flex-col md:flex-row gap-1  border-b-2'>
                                                    <label htmlFor="EMI" className='whitespace-nowrap'>EMI (Rs.) :</label>
                                                    <div className='w-full flex gap-3 ms-4'>
                                                        <input type="text" name="EMI" id="EMI" value={data.EMI} readOnly className='w-full outline-none px-2 py-1' />

                                                    </div>
                                                </div>)
                                            }

                                        </div>

                                        <div className='flex-col gap-5 shadow-lg p-5 flex'>
                                            <p className='font-bold text-lg'>Payment Details</p>

                                            <div className='flex flex-col md:flex-row gap-1 border-b-2'>
                                                <p className='whitespace-nowrap'>Payment Mode :</p>
                                                <div className='w-full flex gap-1'>
                                                    {['Cash', 'DD', 'Cheque', 'Bank Transaction'].map((mode) => (
                                                        <React.Fragment key={mode}>
                                                            <input
                                                                type="radio"
                                                                name="PayDMode"
                                                                value={mode}
                                                                checked={data.PayDMode === mode}
                                                                onChange={handleChange}
                                                                className='text-[0.7rem] outline-none'
                                                            />
                                                            <span className='text-[0.7rem]'>{mode}</span>
                                                        </React.Fragment>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className='flex flex-col md:flex-row gap-1 border-b-2'>
                                                <label htmlFor="PayDate" className='whitespace-nowrap'>Payment Date :</label>
                                                <input type="date" name="PayDate" id="PayDate" value={data.PayDate} onChange={handleChange} className='w-full outline-none px-2 py-1' />
                                            </div>

                                            {data.PayDMode === 'DD' && (
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
                                                data.PayDMode === 'Cheque' && (
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
                                                            <input type="text" name="ChequeNo" id="ChequeNo" value={data.ChequeNo ?? 'NA'} onChange={handleChange} className='w-full outline-none px-2 py-1' />
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
                                                            <label htmlFor="" className='whitespace-nowrap'>Cheque Image :</label>
                                                            <input type="file" name="image" id="" onChange={(e) => handleImage(e, 1)} className='w-full outline-none px-2 py-1' />
                                                        </div>
                                                        {Cpreview || image[1] ? (
                                                            <img
                                                                src={image[1] && (image[1] instanceof Blob || image[1] instanceof File) ? URL.createObjectURL(image[1]) : Cpreview}
                                                                width={120}
                                                                height={120}
                                                                alt=""
                                                            />
                                                        ) : null}
                                                    </>
                                                )
                                            }

                                            {data.PayDMode === 'Bank Transaction' && (
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
                                                        <p className='whitespace-nowrap'>Transaction Type :</p>
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

                                            <div className='flex flex-col md:flex-row gap-1 border-b-2'>
                                                <label htmlFor="PayableAt" className='whitespace-nowrap'>Branch Payable At :</label>
                                                <input
                                                    type="text"
                                                    name="PayableAt"
                                                    id="PayableAt"
                                                    value={data.PayableAt}
                                                    onChange={handleChange}
                                                    className='w-full outline-none px-2 py-1'
                                                />
                                            </div>

                                            <div className='flex flex-col md:flex-row gap-1 border-b-2'>
                                                <label htmlFor="AmountWord" className='whitespace-nowrap'>Amount In Words :</label>
                                                <input
                                                    type="text"
                                                    name="AmountWord"
                                                    id="AmountWord"
                                                    readOnly
                                                    value={data.AmountWord}
                                                    onChange={handleChange}
                                                    className='w-full outline-none px-2 py-1'
                                                />
                                            </div>
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
                    <div className={`w-10 h-10  rounded-full drop-shadow-lg ${openSearch ? 'hidden transition-all' : 'block transition-all'}`} onClick={() => setOpenSearch(true)}>
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

export default Customer