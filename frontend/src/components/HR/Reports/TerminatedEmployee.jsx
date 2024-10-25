import React, { useEffect,useState } from 'react'
import HRLayout from '../../Layout/HRLayout'
import { MdDelete, MdEdit } from "react-icons/md";
import axios from 'axios';
import moment from 'moment'
import showToast from 'show-toast';
import { RxCross2 } from 'react-icons/rx';

const TerminatedEmployee = () => {


    const [allResult, setAllResult] = useState([])

    
        const fetchData = async () => {
          try {
            const response = await axios.get('/api/v1/terminatdemployee');
            if (response.data.success) {
                setAllResult(response.data.result);
            } else {
              console.error('Failed to fetch data:', response.data.message);
            }
          } catch (err) {
            console.log(err.message);
          }
        };
    
        // Call the async function
        useEffect(()=>{
            fetchData()
        },[])
    
      const handleblock=async(item)=>{
            const { EId } = item;
            // let status=1
            try {
                if (EId) {
    
                    const response = await axios.put(`/api/v1/updateterminatedemployee/${EId}`,{status:1});
                    
                    if (response.data.success) {
                        showToast({
                            str: response.data.message,
                            time: 500,
                            position: 'top'
                        });
                    }
                    fetchData();
                }
            } catch (error) {
                console.error('Errorupdating employee status', error);
            }
        }
      

    return (
        <HRLayout>
            <main className="w-full h-full bg-white shadow-2xl flex flex-col gap-5 HR relative">
            <div className='h-14 flex items-center sm:mx-12 mx-5 justify-between shadow md:px-3 px-1 mb-2'>
                    <p className='md:text-xl text-gray-400 font-semibold'>Terminted Employee</p>
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
                                            
                                        <button onClick={()=>{handleblock(item)}} type="submit" className="w-28 text-center bg-green-600 text-white py-1 px-2 rounded hover:bg-green-800">Unblock</button>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </main>
        </HRLayout>
    )
}

export default TerminatedEmployee