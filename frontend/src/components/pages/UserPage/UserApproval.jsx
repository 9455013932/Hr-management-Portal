import React, { useState, useEffect } from 'react'
import AdminLayout from '../../Layout/AdminLayout.jsx'
import showToast from 'show-toast';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { RxCross2 } from "react-icons/rx";
import moment from 'moment'

const UserApproval = () => {
    const [popUp, setPopUp] = useState(false)
    const [rotate, setRotate] = useState(false);
    const [allResult, setAllResult] = useState(null)

    const handleClick = async () => { setPopUp(true) }

    const accessData = async () => {
        try {
            const response = await axios.get('/api/v1/getuser-data');
            if (response.data.success) {
                setAllResult(response.data.result);
            }
        } catch (error) {
            console.error('Error accessing Users', error);
        }
    };

    useEffect(() => {
        accessData();
    }, []);

    //handle handleStatus function
    const handleStatus = async (value) => {
        const { Id, status } = value;
        const newStatus = status === 'Block' ? 'Approved' : 'Block';
        try {
            const response = await axios.post(`/api/v1/users_status/${Id}`, {
                status: newStatus
            });
            if (response.data.success) {
                showToast({
                    str: `User ${newStatus} Successfully`,
                    position: 'top',
                });
                accessData();
            }
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Something went wrong. Please try again.');
        }
    };

    return (
        <AdminLayout>
            <div className='w-full h-full bg-white shadow-2xl flex flex-col gap-5 Associate relative'>
                <div className='h-14 flex  items-center sm:mx-12 mx-5 justify-between shadow  md:px-3 px-1'>
                    <p className='md:text-xl text-gray-400 font-semibold'>User Approval</p>
                    <Link onClick={handleClick} className=' text-center text-sm  create px-2 py-1 shadow-md bg-blue-600 text-white hover:bg-blue-800 hover:border-2 cursor-pointer rounded-full font-semibold' >Check Approval</Link>
                </div>

                <div className='overflow-scroll w-full lg:h-[76.8vh] h-[73.4vh]' style={{ boxShadow: '0 0 5px 2px #ddd' }}>
                    <table className='w-full userTable p-1'>
                        <thead>
                            <tr className='px-1 sticky' style={{ background: '#3e3e3e', color: 'aliceblue' }}>
                                <th>Sr.</th>
                                <th>User Id</th>
                                <th>Branch_Code</th>
                                <th>User Name</th>
                                <th>Email</th>
                                <th>Password</th>
                                <th>Mobile</th>
                                <th>User_Type</th>
                                <th>User_Entry</th>
                                <td>Status</td>
                            </tr>
                        </thead>
                        <tbody>

                            {allResult && allResult.map((item, index) => (
                                <tr key={index}>
                                    <td>{index + 1 || 'NA'}</td>
                                    <td>{item.U_Id || 'NA'}</td>
                                    <td>{item.branchCode || 'NA'}</td>
                                    <td>{item.name || 'NA'}</td>
                                    <td>{item.email || 'NA'}</td>
                                    <td>{item.password}</td>
                                    <td>{item.Mobile || 'NA'}</td>
                                    <td>{item.userType || 'NA'}</td>
                                    <td>{moment(item.E_Date.split('T')[0]).format('LL') || 'NA'}</td>
                                    <td className='text-center'>
                                        <button className='w-full' onClick={() => handleStatus(item)}>{
                                            item.status === 'Approved' ?
                                                <p className='font-semibold shadow-md px-8 py-2 bg-red-700 rounded-full hover:shadow-blue-600  shadow-red-400 border-2 text-white'>Block</p> :
                                                <p className='font-semibold  px-3 py-2 shadow-md hover:shadow-red-600 bg-blue-700 rounded-full shadow-blue-400 border-2 text-white'>Approved</p>
                                        }
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {popUp && (
                    <form action="" style={{ zIndex: '100' }} className='absolute w-full top-14'>
                        <div className=' cust bg-white py-5 rounded flex flex-col relative sm:mx-24 mx-3 overflow-y-scroll h-[16vh] shadow-current shadow-sm  font-serif  md:px-16 px-5  gap-2 md:gap-6'>

                            <p className={`absolute top-4 right-4 text-xl transition-transform duration-300 ${rotate ? 'rotate-180' : ''
                                }`} onClick={() => {
                                    setTimeout(() => { setPopUp(false) }, 200); setRotate(!rotate); setData('')
                                }}><RxCross2 />
                            </p>

                            <div className='flex mx-auto xx gap-1 w-[46vw] mt-5 items-center rounded-md  border-2'>
                                <label htmlFor="search" className='whitespace-nowrap bg-[#ddd]   w-[250px] md:w-[265px] py-[.3rem] shadow-md  md:font-bold text-gray-600 '>User Id</label>
                                <input type="text" name="search" id='search'
                                    className='md:w-full w-[18vw] outline-none px-2  ' />
                                <button className='bg-blue-700 py-1 px-1 md:px-3 rounded-md font-semibold  text-white'>Search</button>
                            </div>

                        </div>
                    </form>
                )}
            </div>
        </AdminLayout>
    )
}

export default UserApproval