import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HRLayout from '../../Layout/HRLayout.jsx';
import { Link } from 'react-router-dom';
import { MdDelete, MdEdit } from "react-icons/md";
import { RxCross2 } from 'react-icons/rx';  
import moment from 'moment'
import showToast from 'show-toast';




const Registration = () => {
    const states = [
        "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
        "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
        "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
        "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
        "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Chandigarh",
        "Delhi", "Ladakh", "Jammu and Kashmir"
    ];
    const [formData, setFormData] = useState({
        name: '',
        relname: '',
        dob: '',
        gender: '',
        department: '',
        designation: '',
        baseSalary: '',
        mobile: '',
        email: '',
        address: '',
        state: '',
        district: '',
        dateofjoining: '',
        hra: '',
        da: '',
        cca: '',
        ta: '',
        medical: '',
        professionaltax: '',
        providentfund: '',
        qualification: '',
        aadhar: '',
        pan: '',
    });
    const [popUp, setPopUp] = useState(false);
    const [changeValue, setChangeValue] = useState(false);
    const [rotate, setRotate] = useState(false);
    const [allResult, setAllResult] = useState([])
    const [id, setId] = useState('');
    const [img, setImg] = useState([])

    const handleImage = async (e, index) => {
        const file = e.target.files[0]
        setImg((prev) => {
            const Images = [...prev]
            Images[index] = file
            return Images
        }
        )
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();

        // Append form data
        for (const [key, value] of Object.entries(formData)) {
            formDataToSend.append(key, value);
        }

        // Append image files
        img.forEach((file, index) => {
            if (file) {
                formDataToSend.append(`image${index}`, file);
            }
        });
        try {
            const response = await fetch('/api/v1/registeremployee', {
                method: 'POST',
                body: formDataToSend,

            });
            
            if (response.ok) {
                const data = await response.json();
                showToast({
                    string:data.message,
                    time:1000,
                    position:top
                   })
                   setPopUp(false)

            } else {
                const error = await response.json();
                showToast({
                    string:error.message,
                    time:1000,
                    position:top
                   })
            }
        } catch (error) {
            console.error('Network error:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));

    };

    const handleClick = () => {
        setPopUp(true);
        setRotate(false);
    };
    const handleEdit = (value) => {
        setPopUp(true);
        setChangeValue(true);
        setId(value.Id);
        setFormData({
            name: value.name || '',
            relname: value.relname || '',
            dob: value.dateofbirth || '',
            gender: value.gender || '',
            department: value.department || '',
            designation: value.designation || '',
            baseSalary: value.salary || '',
            mobile: value.mobile || '',
            email: value.email || '',
            address: value.address || '',
            state: value.state || '',
            district: value.district || '',
            hra: value.hra || '',
            da: value.da || '',
            cca: value.cca || '',
            ta: value.ta || '',
            aadhar: value.aadhar || '',
            pan: value.pan || '',
            medical: value.medical || '',
            professionaltax: value.professionaltax || '',
            providentfund: value.providentfund || '',
            qualification: value.qualification || '',
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            console.log(formData)
            const response = await axios.put(`/api/v1/updateemployee/${id}`, formData);
            if (response.data.success) {
                showToast({
                    str: response.data.message,
                    time: 1000,
                    position: 'top',
                });
                setId('');
                accessData();
                setPopUp(prev => !prev);
                setChangeValue(false)
                // setTimeout(() => {
                //     window.location.reload();
                // }, 500);
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
    }

    const handleDelete = async (value) => {
        const { Id } = value;
        console.log(value.Id)
        try {
            if (Id) {

                const response = await axios.delete(`/api/v1/deleteemployee/${Id}`);
                if (response.data.success) {
                    showToast({
                        str: response.data.message,
                        time: 500,
                        position: 'top'
                    });
                }
                accessData();
            }
        } catch (error) {
            console.error('Error deleting User', error);
        }
    }

    const accessData = async () => {
        try {
            const { data } = await axios.get('/api/v1/getallemployee')
            if (data.success) {
                setAllResult(data.result)
            }

        } catch (error) {
            console.log('Error in getting all Employee', error.message)
        }
    }

    useEffect(() => { accessData() }, [])
    return (
        <HRLayout>
            <main className="w-full h-full bg-white shadow-2xl flex flex-col gap-5 HR relative">

                <div className='h-14 flex items-center sm:mx-12 mx-5 justify-between shadow md:px-3 px-1 mb-2'>
                    <p className='md:text-xl text-gray-400 font-semibold'>Add New Employee</p>
                    <Link onClick={handleClick} className='text-center text-sm create px-2 py-1 shadow-md bg-blue-600 text-white hover:bg-blue-800 hover:border-2 cursor-pointer rounded-full'>Add New Employee</Link>
                </div>
                <div className='overflow-scroll w-full lg:h-[76.8vh] h-[73.4vh] ' style={{ boxShadow: '0 0 5px 2px #ddd' }}>
                    <table className='w-full userTable p-1'>
                        <thead>
                            <tr className=' px-1 sticky' style={{ background: '#3e3e3e', color: 'aliceblue' }}>
                                <th>Sr.No.</th>
                                <th>Employee Id</th>
                                <th>Name</th>
                                <th>Department</th>
                                <th>Designation</th>
                                <th>Basic Salary</th>
                                <th>Mobile</th>
                                <th>Address</th>
                                <th>E-mail</th>
                                <th>Date of Joining</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                allResult.map((item, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item.EId || 'NA'}</td>
                                        <td>{item.name || 'NA'}</td>
                                        <td>{item.department || 'NA'}</td>
                                        <td>{item.designation || 'NA'}</td>
                                        <td>{item.salary || 'NA'}</td>
                                        <td>{item.mobile || 'NA'}</td>
                                        <td>{item.address || 'NA'}</td>
                                        <td>{item.email || 'NA'}</td>
                                        <td>{moment(item.dateofjoining, 'YYYY-MM-DD').format('LL') || 'NA'}</td>
                                        <td className='flex gap-2 items-center justify-center'>
                                            <button className='p-2 shadow-md rounded-full  text-lg hover:bg-green-700  hover:border hover:shadow-md hover:shadow-green-600 text-white bg-green-700 ' onClick={() => handleEdit(item)}><MdEdit /></button>
                                            <button className='p-2 shadow-md rounded-full text-lg hover:bg-red-700 hover:border hover:shadow-md hover:shadow-red-600 text-white bg-red-700' onClick={() => handleDelete(item)}><MdDelete /></button>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>

                {popUp && (
                    <form onSubmit={changeValue ? handleUpdate : handleSubmit} style={{ zIndex: '100' }} className='absolute w-full top-14'>
                        <div className=' bg-white py-2 rounded flex flex-col relative sm:mx-18 mx-6 overflow-y-scroll h-[75vh]  shadow-md font-serif sm:px-12 px-2 gap-2 md:gap-3'>
                            <p
                                className={`absolute top-4 right-4 text-xl transition-transform duration-300 ${rotate ? 'rotate-180' : ''}`}
                                onClick={() => {
                                    setTimeout(() => { setPopUp(false) }, 200);
                                    setFormData({});
                                    setRotate(!rotate);
                                }}
                            >
                                <RxCross2 />
                            </p>

                            <div className='container  text-black'>
                                <h1 className="text-1xl font-semibold">Basic Details</h1>
                                <hr className=''></hr>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 md-3">
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="px-2 mt-1 block w-full border-gray-300 rounded-md shadow-md"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Father/Husband Name</label>
                                    <input
                                        type="text"
                                        name="relname"
                                        placeholder="Father/Husband Name"
                                        value={formData.relname}
                                        onChange={handleChange}
                                        className="px-2 mt-1 block w-full border-gray-300 rounded-md shadow-md"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Date Of Birth</label>
                                    <input
                                        type="date"
                                        name="dob"
                                        value={formData.dob}
                                        onChange={handleChange}
                                        className="px-2 mt-1 block w-full border-gray-300 rounded-md shadow-md"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Gender</label>
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        className="px-2 mt-1 block w-full border-gray-300 rounded-md shadow-md"
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Department</label>
                                    <input
                                        type="text"
                                        name="department"
                                        placeholder="Department"
                                        value={formData.department}
                                        onChange={handleChange}
                                        className="px-2 mt-1 block w-full border-gray-300 rounded-md shadow-md"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Designation</label>
                                    <input
                                        type="text"
                                        name="designation"
                                        placeholder="Designation"
                                        value={formData.designation}
                                        onChange={handleChange}
                                        className="px-2 mt-1 block w-full border-gray-300 rounded-md shadow-md"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Mobile</label>
                                    <input
                                        type="text"
                                        pattern="/^\d*$/."
                                        name="mobile"
                                        inputmode="numeric"
                                        placeholder="Enter a number"
                                        value={formData.mobile}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (/^\d{0,13}$/.test(value)) {
                                                handleChange(e); // Only update formData if input is numeric
                                            }
                                        }}
                                        className="px-2 mt-1 block w-full border-gray-300 rounded-md shadow-md"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">E-mail Id</label>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Email Id"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="px-2 mt-1 block w-full border-gray-300 rounded-md shadow-md"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Address</label>
                                    <input
                                        type="text"
                                        name="address"
                                        placeholder="Address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="px-2 mt-1 block w-full border-gray-300 rounded-md shadow-md"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="state">Select State:</label>
                                    <select id="state" name="state" onChange={handleChange} className="px-2 mt-1 block w-full border-gray-300 rounded-md shadow-md">
                                        <option value={formData.state}>--Select State--</option>
                                        {states.map((state) => (
                                            <option key={state} value={state}>{state}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">District</label>
                                    <input
                                        type="text"
                                        name="district"
                                        placeholder="District"
                                        value={formData.district}
                                        onChange={handleChange}
                                        className="px-2 mt-1 block w-full border-gray-300 rounded-md shadow-md"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Date Of Joining</label>
                                    <input
                                        type="date"
                                        name="dateofjoining"
                                        placeholder="Date Of Joining"
                                        value={formData.dateofjoining}
                                        onChange={handleChange}
                                        className="px-2 mt-1 block w-full border-gray-300 rounded-md shadow-md"
                                    />
                                </div>
                            </div>
                            <div className='container  text-black'>
                                <h1 className="text-1xl font-semibold">Salary Details</h1>
                                <hr className=''></hr>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 md-3">
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Base Salary</label>
                                    <input
                                        type="number"
                                        name="baseSalary"
                                        placeholder="Base Salary"
                                        value={formData.baseSalary}
                                        onChange={handleChange}
                                        className="px-2 mt-1 block w-full border-gray-300 rounded-md shadow-md"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">HRA (  % )</label>
                                    <input
                                        type="number"
                                        name="hra"
                                        min="0"
                                        max="100"
                                        step="0.01"
                                        placeholder="0-100"
                                        value={formData.hra}
                                        onChange={handleChange}
                                        className="px-2 mt-1 block w-full border-gray-300 rounded-md shadow-md"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">DA (  % )</label>
                                    <input
                                        type="number"
                                        name="da"
                                        min="0"
                                        max="100"
                                        step="0.01"
                                        placeholder="0-100"
                                        value={formData.da}
                                        onChange={handleChange}
                                        className="px-2 mt-1 block w-full border-gray-300 rounded-md shadow-md"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">CCA (  % )</label>
                                    <input
                                        type="number"
                                        name="cca"
                                        min="0"
                                        max="100"
                                        step="0.01"
                                        placeholder="0-100"
                                        value={formData.cca}
                                        onChange={handleChange}
                                        className="px-2 mt-1 block w-full border-gray-300 rounded-md shadow-md"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">TA (  % )</label>
                                    <input
                                        type="number"
                                        name="ta"
                                        min="0"
                                        max="100"
                                        step="0.01"
                                        placeholder="0-100"
                                        value={formData.ta}
                                        onChange={handleChange}
                                        className="px-2 mt-1 block w-full border-gray-300 rounded-md shadow-md"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Medical</label>
                                    <input
                                        type="number"
                                        name="medical"
                                        placeholder="Medical"
                                        value={formData.medical}
                                        onChange={handleChange}
                                        className="px-2 mt-1 block w-full border-gray-300 rounded-md shadow-md"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Professional Tax</label>
                                    <input
                                        type="number"
                                        name="professionaltax"
                                        placeholder="Professional Tax"
                                        value={formData.professionaltax}
                                        onChange={handleChange}
                                        className="px-2 mt-1 block w-full border-gray-300 rounded-md shadow-md"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Provident Fund</label>
                                    <input
                                        type="number"
                                        name="providentfund"
                                        placeholder="Provident Fund"
                                        value={formData.providentfund}
                                        onChange={handleChange}
                                        className="px-2 mt-1 block w-full border-gray-300 rounded-md shadow-md"
                                    />
                                </div>
                            </div>
                            <div className='container  text-black'>
                                <h1 className="text-1xl font-semibold">Upload Document</h1>
                                <hr className=''></hr>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 md-3">
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Highest Qualification</label>
                                    <input
                                        type="text"
                                        name="qualification"
                                        placeholder="qualification"
                                        value={formData.qualification}
                                        onChange={handleChange}
                                        className="px-2 mt-1 block w-full border-gray-300 rounded-md shadow-md"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Aadhar No</label>
                                    <input
                                        type="number"
                                        name="aadhar"
                                        placeholder="Aadhar No"
                                        value={formData.aadhar}
                                        onChange={handleChange}
                                        className="px-2 mt-1 block w-full border-gray-300 rounded-md shadow-md"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">PAN</label>
                                    <input
                                        type="text"
                                        name="pan"
                                        placeholder="Pan"
                                        value={formData.pan}
                                        onChange={handleChange}
                                        className="px-2 mt-1 block w-full border-gray-300 rounded-md shadow-md"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Upload Image</label>
                                    <input
                                        type="file"
                                        name="image"
                                        onChange={(e) => handleImage(e, 1)}
                                        className="px-2 mt-1 block w-full border-gray-300 rounded-md shadow-md"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Upload CV</label>
                                    <input
                                        type="file"
                                        name="cv"
                                        onChange={(e) => handleImage(e, 2)}
                                        className="px-2 mt-1 block w-full border-gray-300 rounded-md shadow-md"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Upload Cheque</label>
                                    <input
                                        type="file"
                                        name="cheque"
                                        onChange={(e) => handleImage(e, 3)}
                                        className="px-2 mt-1 block w-full border-gray-300 rounded-md shadow-md"
                                    />
                                </div>
                            </div>

                            <div className='flex w-full justify-center'>
                                <button type="submit" className="w-32 text-center bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-800">{changeValue ? 'Save' : 'Submit'}</button>
                            </div>
                        </div>
                    </form>
                )}

            </main>
        </HRLayout>
    );
}

export default Registration;
