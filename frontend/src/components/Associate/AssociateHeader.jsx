import React, { useState } from 'react';
import logo from '../../assets/CompanyLogo.png';
import { IoSearchSharp } from "react-icons/io5";
import { IoSettingsOutline } from "react-icons/io5";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'

const AssociateHeader = () => {
    const uid=localStorage.getItem('uid')
    const role=sessionStorage.getItem('userType')
    const [searchBar, setSearchBar] = useState(false);
    const [openMenu, setOpenMenu] = useState(false);
    const navigate = useNavigate();

    const handleDelete = async () => {
        try {
            const { data } = await axios.delete('/api/v1/delete-user');
            if (data.success) {
  
                navigate('/')
                localStorage.removeItem('token')
                localStorage.removeItem('user')
              
                // localStorage.clear()
                sessionStorage.clear()
            }
            setTimeout(() => {
                window.location.reload()
            }, 100);
        } catch (error) {
            console.log(error);
        }
    };

  return (
    <>
    <div className='flex items-center bg-gray-50 shadow-md'>
              <div className='h-14 w-full flex items-center justify-between pl-[8vw] pr-5'>
                  <img src={logo} className='md:h-12 h-10' alt="Company Logo" />
                  <div className='sm:text-xl md:text-2xl md:flex md:items-center lg:text-3xl text-md font-semibold font-serif hidden sm:block'>
                   WELCOME : <pre className='color-cycle uppercase sm:text-xl md:text-2xl lg:text-3xl '> {uid}({role})</pre>
                  </div>
                  <div className={`flex gap-1 pl-2 items-center justify-around ${searchBar ? 'bg-gray-200' : ''} rounded-full py-1`}>
                      <IoSearchSharp
                          className='text-center text-xl cursor-pointer'
                          onClick={() => setSearchBar(prev => !prev)}
                      />
                      {searchBar && (
                          <input
                              type="search"
                              placeholder='Search...'
                              className='outline-none px-2 bg-transparent border-l-2 border-gray-400'
                          />
                      )}
                  </div>
              </div>
              <div className='pr-8'>
                  <IoSettingsOutline
                      className='text-xl text-black cursor-pointer'
                      onClick={() => setOpenMenu(prev => !prev)}
                  />
              </div>
              {
                  openMenu && (
                      <div className='min-w-32 bg-slate-50 font-serif px-3 py-3 rounded-sm shadow-md shadow-blue-400 flex flex-col gap-3 whitespace-nowrap justify-start absolute right-2 top-14' style={{ zIndex: '1000' }}>
                          <Link className='hover:border-2 hover:bg-blue-700 hover:shadow-sm hover:text-white hover:rounded-full px-2 hover:shadow-black'>
                              Profile
                          </Link>
                          <hr />
                          <Link className='hover:border-2 hover:bg-blue-700 hover:shadow-sm hover:text-white hover:rounded-full px-2 hover:shadow-black'>
                              Change Password
                          </Link>
                          <hr />
                          <Link className='hover:border-2 hover:bg-blue-700 hover:shadow-sm hover:text-white hover:rounded-full px-2 hover:shadow-black'
                              onClick={() => handleDelete()}>
                              Logout
                          </Link>
                      </div>
                  )
              }
          </div>
     </>
  )
}

export default AssociateHeader