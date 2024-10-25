import React, { useEffect, useState } from 'react';
import showToast from 'show-toast';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { RxCross2 } from "react-icons/rx";
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import AdminLayout from '../../Layout/AdminLayout.jsx';


const BonanazaPage = () => {
    const [imgPrev, setImgPrev] = useState(false)
    const [Id, setId] = useState('');
    // const [images, setImages] = useState([]);
    const [error, setError] = useState('')
    const [popUp, setPopUp] = useState(false);
    const [rotate, setRotate] = useState(false);
    const [changeValue, setChangeValue] = useState(false);
    const [allResult, setAllResult] = useState([]);
    const uid = localStorage.getItem('uid');
    const [img, setImg] = useState('');
    const [preview, setPreview] = useState(null);
    const [data, setData] = useState({
        BItem: '',
        BDesc: '',
        EDate: '',
        SDate: '',
        user: uid || 'NA',
    });
    // Create Bonanza
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (img) {
                const formData = new FormData();
                formData.append('image', img);
                for (const [key, value] of Object.entries(data)) {
                    formData.append(key, value)
                }
                const response = await axios.post('/api/v1/create-bonanza', formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                );
                if (response.data.success) {
                    showToast({
                        str: response.data.message,
                        time: 500,
                        position: 'top',
                    });
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                } else {
                    showToast({
                        str: response.data.error,
                        time: 1000,
                        position: 'right',
                    });
                }
            }
        } catch (error) {
            showToast({
                str: 'Invalid user',
                time: 1000,
                position: 'bottom',
            });
        }
    };

    // Handle picture
    const handlePic = async (e) => {
        const file = e.target.files[0];
        const allowedExtensions = ['.jpeg', '.jpg', '.png'];
        if (!allowedExtensions.includes(file.name.toLowerCase().match(/\.[^.]+$/)[0])) {
            setError('Only JPG ,JPEG and PNG files are allowed!');
            return;
        }
        if (file.size > 1 * 1024 * 1024) {
            setError('File size must be less than 1MB');
            return;
        }
        setError('');
        setImg(file);
        setPreview(URL.createObjectURL(file));
    };

    // set value    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setData({
            ...data,
            [name]: value
        });
    };

    const handleClick = () => {
        setPopUp(true);
    };

    // Get all Bonanza
    const accessData = async () => {
        try {
            const { data } = await axios.get('/api/v1/get-bonanza');
            if (data.success) {
                setAllResult(data.result);
            }
        } catch (error) {
            console.log('Error in getting all Bonanza', error.message);
        }
    };

    useEffect(() => {
        accessData();
    }, []);

    // Edit data
    const handleEdit = (value) => {
        setChangeValue(true);
        setPopUp((prev) => !prev);
        setId(value.Id);
        setData({
            BItem: value.BItem,
            BDesc: value.BDesc,
            EDate: value.EDate,
            SDate: value.SDate,
            user: uid || 'NA',
            BPic: value.BPic
        });
        setPreview(`/api/v1/get-bonanza/${value.BPic}`);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            if (Id ) {
                const formData = new FormData();
                formData.append('image', img);
                for (const [key, value] of Object.entries(data)) {
                    formData.append(key, value)
                }
                const response = await axios.put(`/api/v1/update-bonanza/${Id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                if (response.data.success) {
                    showToast({
                        str: response.data.message,
                        time: 1000,
                        position: 'top',
                    });
                    setId('');
                    accessData();
                    setPopUp((prev) => !prev);
                }
                setData('')
            }
        } catch (error) {
            alert('Error in updation');
        }
    };

    // Delete data
    const handleDelete = async (value) => {
        const { Id, BPic } = value;

        try {
            const response = await axios.delete(`/api/v1/delete-bonanza/${BPic}/${Id}`)
            if (response.data.success) {
                showToast({
                    str: response.data.message,
                    time: 500,
                    position: 'top',
                });
            }
            accessData();
        } catch (error) {
            console.error('Error in deletion', error.message);
            showToast({
                str: 'Error deleting Bonanza',
                time: 500,
                position: 'top',
            });
        }
    };

    return (
        <AdminLayout>
            <div className={`w-full h-full bg-white shadow-2xl flex flex-col gap-5 Bonanza relative`}>
                <div className='h-14 flex  items-center sm:mx-12 mx-5 justify-between shadow  md:px-3 px-1'>
                    <p className='md:text-xl text-gray-400 font-semibold'>Create Bonanza</p>
                    <Link onClick={handleClick} className=' text-center text-sm  create px-2 py-1 shadow-md bg-blue-600 text-white hover:bg-blue-800 hover:border-2 cursor-pointer rounded-full'>Create New Bonanza</Link>
                </div>
                <div className='overflow-scroll w-full lg:h-[76.8vh] h-[73.4vh]' style={{ boxShadow: '0 0 5px 2px #ddd' }}>
                    <table className='w-full userTable p-1'>
                        <thead>
                            <tr className=' px-1 sticky' style={{ background: '#3e3e3e', color: 'aliceblue' }}>
                                <th>Sr.</th>
                                <th>Bonanza Item</th>
                                <th>Bonanza Description</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Picture</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allResult.map((item, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{item.BItem}</td>
                                    <td>{item.BDesc}</td>
                                    <td>{item.SDate}</td>
                                    <td>{item.EDate}</td>
                                    <td >
                                        <img src={`/api/v1/get-bonanza/${item.BPic}`} alt={item.BPic} width={50} className='max-h-14' />
                                    </td>
                                    <td className='flex gap-2 items-center justify-center my-2'>
                                        <button className='p-2 shadow-md rounded-full text-lg hover:bg-green-700 hover:border hover:shadow-md hover:shadow-green-600 text-white bg-green-400' onClick={() => handleEdit(item)}><MdEdit /></button>
                                        <button className='p-2 shadow-md rounded-full text-lg hover:bg-red-700 hover:border hover:shadow-md hover:shadow-red-600 text-white bg-red-400' onClick={() => handleDelete(item)}><MdDelete /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {popUp && (
                    <form onSubmit={changeValue ? handleUpdate : handleSubmit} style={{ zIndex: '100' }} className={`absolute w-full top-14 ${imgPrev && 'backdrop-blur-sm bg-white/50'}`}>
                        <div className={`bg-white py-5 rounded flex flex-col relative sm:mx-24 mx-6 overflow-y-scroll h-[75vh] shadow-current shadow-sm font-serif sm:px-16 px-5 gap-2 md:gap-8`}>
                            <p className={`absolute top-4 right-4 text-xl transition-transform duration-300 ${rotate ? 'rotate-180' : ''}`} onClick={() => { setTimeout(() => { setPopUp(false); }, 200); setRotate(!rotate); }}><RxCross2 /></p>

                            <div className='flex flex-col md:flex-row gap-1 md:gap-3 border-b-2'>
                                <label htmlFor="name" className='whitespace-nowrap'>Bonanza Item:</label>
                                <input type="text" name="BItem" id="name" required value={data.BItem || ''} onChange={handleChange} className='w-full outline-none px-2 py-1' placeholder='Enter Bonanza name...' />
                            </div>

                            <div className='flex flex-col md:flex-row gap-1 md:gap-3 border-b-2'>
                                <label htmlFor="BDesc" className='whitespace-nowrap'>Description:</label>
                                <input type="text" name="BDesc" required value={data.BDesc || ''} id="BDesc" onChange={handleChange} className='w-full outline-none px-2 py-1' placeholder='Enter Bonanza description...' />
                            </div>

                            <div className='flex flex-col md:flex-row gap-1 md:gap-3 border-b-2'>
                                <label htmlFor="SDate" className='whitespace-nowrap'>Start date:</label>
                                <input type="date" name="SDate" required id="SDate" onChange={handleChange} value={data.SDate || ''} className='w-full outline-none px-2 py-1' />
                            </div>

                            <div className='flex flex-col md:flex-row gap-1 md:gap-3 border-b-2'>
                                <label htmlFor="EDate" className='whitespace-nowrap'>End Date:</label>
                                <input
                                    type="date"
                                    required
                                    name='EDate'
                                    id="EDate"
                                    onChange={handleChange}
                                    value={data.EDate}
                                    className='w-full outline-none px-2 py-1'
                                />
                            </div>

                            <div>
                                <div className='flex flex-col md:flex-row gap-1 md:gap-3 border-b-2'>
                                    <label htmlFor="BPic" className='whitespace-nowrap'>Photo:</label>
                                    <input type="file" name="BPic" id="BPic" onChange={handlePic} className='w-full outline-none px-2 py-1' />
                                </div>

                                <p className='text-red-600 font-thin text-[.7rem]'>{error}</p>
                                {(img || preview) && (
                                    <img
                                        src={preview || (img ? URL.createObjectURL(img) : '')}
                                        height={80}
                                        width={80}
                                        alt={img ? img.name : 'Preview'}
                                        className='mt-4'
                                        onClick={() => setImgPrev(prev => !prev)}
                                    />
                                )}
                            </div>

                            <button type='submit' className='bg-blue-700 py-1 px-2 rounded text-white font-semibold'>{changeValue ? 'Save' : 'Submit'}</button>

                            {/* images preview */}
                            {imgPrev && preview && (
                                <div className='h-[400px] bg-white w-[400px] absolute shadow-md top-2 left-36 flex items-center justify-center' style={{ zIndex: '100' }}>
                                    <img src={preview || (img ? URL.createObjectURL(img) : '')} height={280} width={280} alt={img.name} className='mt-4 object-cover' onClick={() => setImgPrev(prev => !prev)} />
                                </div>
                            )}

                        </div>

                    </form>
                )}

            </div>
        </AdminLayout>
    );
};

export default BonanazaPage;
