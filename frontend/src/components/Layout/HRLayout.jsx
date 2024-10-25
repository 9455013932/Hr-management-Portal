import React, { useEffect } from 'react';
import Context from '../../content/index.js';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { userDetails } from '../../store/counterSlice.js';
import HRmenu from '../HR/HRmenu.jsx'
import HRHeader from '../HR/HRHeader.jsx'

const HRLayout = (props) => {
  const dispatch = useDispatch();

  const midFun = async () => {
    try {
      const response = await axios.get('/api/v1/access-token');
      dispatch(userDetails(response.data.result[0]));
    } catch (error) {
      console.error('Error fetching access token:', error);
    }
  };

  useEffect(() => {
    midFun();
  }, []);
  
  return (
    <Context.Provider value={{ midFun }}>
      <HRHeader className='h-12' />
      <div className='flex'>
        <div style={{ zIndex: '1000' }}>
          <HRmenu />
        </div>
        <main className='md:w-[calc(100%-42vh)] w-[calc(100%-3rem)] px-3 py-3' style={{ height: '91vh' }}>
          {props.children}
        </main>
      </div>
    </Context.Provider>
  )
}

export default HRLayout