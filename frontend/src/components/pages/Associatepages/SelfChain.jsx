import React, { useEffect, useState } from 'react'
import AssociateLayout from '../../Layout/AssociateLayout'
import { showToast } from 'show-toast'
import axios from 'axios'

const SelfChain = () => {
  // const user = JSON.parse(localStorage.getItem("user"));
  const AId = JSON.parse(localStorage.getItem( 'uid'))

  const [getCustomer, setCustomer] = useState([])

  const accessdata = async () => {
    try {
      console.log(AId)
      if(AId){
        const { data } = await axios.post(`/api/v1/getcustomer/${AId}`)
        console.log(data)
        if (data.success) {
          setCustomer(data.result)
        }
        else {
          console.log("data not received")
        }
      }
      
    } catch (error) {
      console.log('error in fetching data')
    }
  }
  useEffect(() => {
    accessdata()
  }, []
  )

  return (
    <AssociateLayout>
      <main className='w-full  h-full shadow-2xl flex flex-col gap-3 HR relative'>
        <div className='h-14 flex items-center sm:mx-12 mx-5 justify-between shadow md:px-3 px-1 mb-2'>
          < p className='md:text-xl text-gray-400 fonts-semibold'>Self Chain</p>
        </div>

        <div className='overflow-scroll w-full lg:h-[76.8vh]' style={{ boxshadow: '0 0px 2px #add' }}>
          <table className='w-full p-1 userTable'>
            <thead>
              <tr className='px-1 sticky' style={{ background: '#3e3e3e', color: 'aliceblue' }}>

                <th>Sr.No.</th>
                <th>Associate Id</th>
                <th> Customer Name</th>
                <th>Introducer Code</th>
                <th>Mobile</th>
              </tr>
            </thead>
            <tbody>
              {
                getCustomer.map((item, index) => (
                  <tr className='p-2 shadow-md rounded-sm px-4 m-2 text-lg' key={index}>
                    <td className='py-2'>{index + 1}</td>
                    <td>{item.C_Id || 'NA'}</td>
                    <td>{item.Appliname || 'NA'}</td>
                    <td>{item.IntrodCode || 'NA'}</td>
                    <td>{item.Mobile || 'NA'}</td>
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

export default SelfChain