import React, { useEffect, useState } from 'react'
import AssociateLayout from '../../Layout/AssociateLayout'
import { showToast } from 'show-toast'
import axios from 'axios'

const SelfAccount = () => {

    const AId = JSON.parse(localStorage.getItem('uid'))
    const [getCustomer, setCustomer] = useState({ C_Id: '' })
    const [getAllResult, setAllResult] = useState([])

    // const accessdata = async () => {
    //   try {
    //     const { data } = await axios.post(`/api/v1/getcustomer${AId}`)
    //     console.log(data)
    //     if (data.success) {
    //       setCustomer(data.result)
    //     }
    //     else {
    //       console.log("data not received")
    //     }
    //   } catch (error) {
    //     console.log('error in fetching data')
    //   }
    // }
    // useEffect(() => {
    //   accessdata()
    // }, []
    // )

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCustomer(prevstate => ({ ...prevstate, [name]: value }))
    }

    const handleSubmit=async(e)=>{
        e.preventDefault();
        try {
        const {data}=await axios.post(`/api/v1/referencecustomer`,getCustomer)
            if(data.success){
                setAllResult(data.result)
            }else{
                showToast({ position: 'top', str: `${data.error}`, time: 1500 })

            }
        
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <AssociateLayout>

            <main className='w-full  h-full shadow-2xl flex flex-col gap-3 HR relative'>
                <div className='h-14 flex items-center sm:mx-12 mx-5 justify-between shadow md:px-3 px-1 mb-2'>
                    < p className='md:text-xl text-gray-400 fonts-semibold'>Self Account</p>
                </div>
                <div className='bg-gray-100'>
                 <form action="" onSubmit={handleSubmit}>
                 <div className='m-4'>
                        <label htmlFor="customer" >Customer Id :</label>
                        <input className='mx-7  text-1xl  rounded-sm border-1 border-black'
                            type='text'
                            required
                            value={getCustomer.C_Id}
                            name='C_Id'
                            onChange={handleChange} ></input>
                        <button type='submit' className=' font-bold text-white rounded-md px-6 py-2  bg-blue-500 hover:bg-blue-700'>Search</button>
                    </div>
                 </form>

                </div>

                <div className='overflow-scroll w-full lg:h-[76.8vh]' style={{ boxshadow: '0 0px 2px #add' }}>
          <table className='w-full p-1 userTable'>
            <thead>
              <tr className='px-1 sticky' style={{ background: '#3e3e3e', color: 'aliceblue' }}>

                <th>Sr.No.</th>
                <th>Customer Id</th>
                <th>Name</th>
                <th>Introducer Code</th>
                <th>Root Id</th>
                <th>Mobile</th>
                <th>Agreement Date</th>
                <th>Project Name</th>
                <th>Plot Size</th>
                <th>Plot Cost</th>

              </tr>
            </thead>
            <tbody>
              {
                getAllResult.map((item, index) => (
                  <tr className='p-2 shadow-md rounded-sm px-4 m-2 text-lg' key={index}>
                    <td className='py-2'>{index + 1 }</td>
                    <td>{item.C_Id || 'NA'}</td>
                    <td>{item.Appliname || 'NA'}</td>
                    <td>{item.IntrodCode || 'NA'}</td>
                    <td>{item.ParentId || 'NA'}</td>
                    <td>{item.AgreeDate || 'NA'}</td>
                    <td>{item.ProjectName || 'NA'}</td>
                    <td>{item.ProCoste || 'NA'}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>

            </main>
        </AssociateLayout>
    )
}

export default SelfAccount