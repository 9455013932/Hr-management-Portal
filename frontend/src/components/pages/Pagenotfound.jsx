import React from 'react'
import AdminHeader from '../Admin/AdminHeader';
import { Link } from 'react-router-dom';

const Pagenotfound = () => {
  return (
    <>
    <AdminHeader/>
      <div className='pnf'>
        <h1 className='pnf-404'>404</h1>
        <p className='pnf-oopx'>Oops ! Page Not Found</p>
        <Link className='pnf-btn' to='/'>Go Back</Link>
      </div>
    </>
  )
}

export default Pagenotfound;