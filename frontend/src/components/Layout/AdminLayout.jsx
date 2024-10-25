import React, { useEffect } from 'react'
import AdminHeader from '../Admin/AdminHeader.jsx'
import AdminMenu from '../Admin/AdminMenu.jsx'
import axios from 'axios'
import Context from '../../content/index.js'
import { useDispatch } from 'react-redux'
import { userDetails } from '../../store/counterSlice.js'
// import Footer from './Footer.jsx'
const AdminLayout = (props) => {
    const dispatch = useDispatch()
    const midFun = async () => {
        try {
            const response = await axios.get('/api/v1/access-token');
            dispatch(userDetails(response.data.result[0]))
        } catch (error) {
            console.error('Error fetching access token:', error);
        }
    };
    useEffect(() => {
        midFun();
    }, []);
    
    // branchCode access
   
   
    return (
        <>
            <Context.Provider value={{ midFun }}>
                <AdminHeader className='h-14' />
                <div className='flex'>
                    <div>
                        <AdminMenu />
                    </div>
                    <main className='md:w-[calc(100%-42vh)]  w-[calc(100%-3rem)] px-3 py-3' style={{ Height: '91vh' }}>
                        {props.children}
                    </main>
                </div>
                {/* <Footer /> */}
            </Context.Provider>
        </>
    )
}

export default AdminLayout