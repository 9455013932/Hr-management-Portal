import React from 'react'
import AdminLayout from '../../Layout/AdminLayout.jsx'
import { createUser } from '../../common/index.jsx'
import { Link } from 'react-router-dom'
const UserPage = () => {
    const user = sessionStorage.getItem('date')
    const uid = localStorage.getItem('uid')
    return (
        <AdminLayout>
            <div className='p-5 h-full w-full shadow-md flex-col bg-slate-50 flex items-center justify-center '>

                <div className='flex  bg-white mb-3 shadow-md px-4 font-serif text-md md:text-lg capitalize h-14 w-[65vw] items-center justify-between'>
                    <p>Welcome :{uid}</p>
                    <p className='hidden sm:block'>Purodha Infrabuild LLP</p>
                    <p className='hidden sm:block'>{user}</p>
                </div>

                <div className='w-[65vw] bg-white gap-5 overflow-y-scroll h-[73.3vh] sm:px-10 px-2 shadow-md justify-center py-8 flex flex-wrap'>
                    {createUser.map((item, index) => (
                        <Link
                            to={item.to}
                            key={index}
                            className='h-[20vh] flex items-center hover:bg-gray-200 flex-col bg-gray-50 px-2 pt-2 justify-center w-[16vh] shadow-md relative box-item'
                        >
                            <img src={item.src} alt={item.name} className='w-auto h-14 hover:animate-pulse' />
                            <div className='text-center pt-1'>
                                <p className='text-[0.8rem]'>{item.name}</p>
                            </div>
                        </Link>
                    ))}
                </div>


            </div>

        </AdminLayout>
    )
}

export default UserPage