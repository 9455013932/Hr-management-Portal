import showToast from 'show-toast';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { TbCreditCardPay } from "react-icons/tb";
import { ToWords } from 'to-words';
import moment from 'moment';
import React, { useState } from 'react';
import BranchLayout from '../../../Layout/BranchLayout.jsx'
import { useSelector } from 'react-redux';
import AssociatePrint from '../../../Helper/BranchLetter/AssociatePrint.jsx'
const AssociateLetter = () => {
    const toWords = new ToWords();
    const [toInstall, setToInstall] = useState([])
    const [popUp, setPopUp] = useState(false)
    const [allResult, setAllResult] = useState(null)
    const associateId = useSelector(state => state?.user?.associate)
    const [filterData, setFilterData] = useState()
    const user = localStorage.getItem('uid')
    const [values, setValues] = useState({
        search: '',
    });

    const AccessData = async (e) => {
        e.preventDefault();
        try {
            if (values) {
                const response = await axios.post('/api/v1/get-associte-data', values);
                const { data } = response;
                if (data.success) {
                    setAllResult(data.result);

                    // setValues({})
                } else {
                    alert('Failed to retrieve data.');
                }
            }
        } catch (error) {
            console.error('Error:', error);
            showToast({
                str: error.message,
                time: 1000,
                position: 'top'
            })
        }
    };
    // for suggestion
    const handleValues = async (e) => {
        const { name, value } = e.target
        let typeData = ({
            ...values,
            [name]: value
        })
        setValues(typeData)
        if (typeData.search) {
            const filtered = associateId.filter(items =>
                items.C_Id.includes(typeData.search)
            )
            setFilterData(filtered)
        }
    }

    const handleSelect = (value) => {
        setValues({ ...values, search: value });

        const scrollview = document.getElementById('search')
        scrollview.scrollIntoView({ behavior: 'smooth', block: 'nearest' })

        filterData.filter(el => el.C_Id !== value)
        setFilterData()
    };


    return (
        <BranchLayout>
            <div className={`w-full h-full bg-white shadow-2xl flex flex-col gap-5 relative`}>

                <div className='h-14 flex  items-center sm:mx-12 mx-5 justify-between shadow  md:px-3 px-1'>
                    <p className='md:text-xl text-gray-400 font-semibold'>Associate Welcome Letter</p>
                    <Link className=' text-center text-sm  create px-4 py-1 shadow-md border-2 cursor-pointer rounded-full font-semibold shine-effect' >{moment(new Date()).format('LL')}</Link>
                </div>

                {
                    popUp && (
                        <div className='absolute top-[3.6rem]  bg-white w-[65vw] mx-[5vw] rounded shadow-md shadow-[#b4afaf] overflow-y-scroll scrollbar-hide h-[80vh]' style={{ zIndex: '100' }}>
                            <AssociatePrint/>
                        </div>
                    )
                }

                <div className=' w-full lg:h-[76.8vh] h-[73.4vh] relative ' style={{ boxShadow: '0 0 5px 2px #ddd' }}>

                    <form action="" className='flex flex-col' onSubmit={AccessData} >
                        <div className='flex mx-auto  gap-1 w-[46vw]  mt-5  items-center rounded-md  border-2'>

                            <label htmlFor="search" className='whitespace-nowrap bg-[#ddd]  md:px-3 w-[250px] md:w-[265px] py-1 shadow-md  md:font-bold text-gray-600 '>Associate Id</label>
                            <input type="text" name="search" id='search' value={values.search} onChange={handleValues}
                                className='md:w-full w-[17vw] outline-none px-2  ' />
                            <button className='bg-blue-700 py-1 px-1 md:px-3 rounded-md font-semibold  text-white'>Search</button>
                        </div>
                        {
                            filterData && (
                                <div className='border  w-[23vw] absolute top-12 left-[29vw]  mt-1 z-50 bg-white rounded-md shadow-lg'>
                                    {filterData.map((el, index) => (
                                        <p
                                            className={`hover:bg-gray-200 px-3 py-1 cursor-pointer`}
                                            key={index}
                                            onClick={() => handleSelect(el.C_Id)}
                                        >
                                            {
                                                el.C_Id
                                            }
                                        </p>
                                    ))}
                                </div>
                            )
                        }


                    </form>

                    {
                        allResult && (
                            <div className=' w-full mt-5 lg:h-[62.8vh] h-[60.4vh] -z-10' style={{ boxShadow: '0 0 5px 2px #ddd' }}>
                                <table className='w-full userTable p-1'>
                                    <thead>
                                        <tr className=' px-1 sticky' style={{ background: '#3e3e3e', color: 'aliceblue' }}>
                                            <th>Sr.</th>
                                            <th>Associate_Id</th>
                                            <th>Name</th>
                                            <th>Referral ID</th>
                                            <th>Mobile_No</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            allResult.map((el, index) => (
                                                <tr key={index + 1}>
                                                    <td>{index + 1}</td>
                                                    <td>{el.C_Id}</td>
                                                    <td>{el.Appliname}</td>
                                                    <td>{el.IntrodCode}</td>
                                                    <td>{el.Mobile}</td>

                                                    <td className='flex gap-2 items-center justify-center '>
                                                        <div className="relative flex items-center justify-center">
                                                            <Link state={{ data: el }} className='relative flex items-center justify-center p-2 gap-2 shadow-md rounded-full text-lg hover:bg-green-700 hover:border hover:shadow-md hover:shadow-green-700 text-white bg-green-700 group' onClick={(e) => { setPopUp(true) }}>
                                                                <TbCreditCardPay className='text-2xl' />
                                                                <p className='absolute -top-2 shadow-md bg-green-950 bg-opacity-70 text-white text-sm px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300' >
                                                                    Get Print
                                                                </p>
                                                            </Link>

                                                        </div>
                                                    </td>
                                                </tr>
                                                // to={`/branch/associate-print-letter/`+el.C_Id
                                            ))
                                        }
                                    </tbody>
                                </table>


                            </div>
                        )
                    }

                </div>


            </div>
        </BranchLayout>
    )
}

export default AssociateLetter