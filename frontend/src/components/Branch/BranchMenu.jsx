import React, { useEffect, useState } from 'react';
import { branchMenu } from '../common/index.jsx';
import { Link, useNavigate } from 'react-router-dom';
import { FaAngleRight } from "react-icons/fa6";
import { FaAngleDown } from "react-icons/fa6";
const BranchMenu = () => {
  const [changeAngle, setChangeAngle] = useState(false)
  const [subMenu, setSubMenu] = useState(null);
  const [widthSize, setWidthSize] = useState(window.innerWidth <= 540);
  const navigate = useNavigate();

  const handleSubMenu = (value) => {
    setSubMenu(subMenu === value.name ? null : value.name);
  };
  useEffect(() => {
    const handleResize = () => {
      setWidthSize(window.innerWidth <= 770);
    };
    window.addEventListener('resize', handleResize);

  }, []);
  return (
    <div className={`flex flex-col gap-3 border-2 ${widthSize ? 'w-[3rem]' : 'w-[42vh]'} pl-3 py-5  bg-gray-100  lg:h-[91.5vh] h-[90.7vh]`}>
      {branchMenu.map((items, index) => (
        <div key={index} className='relative'>
          <Link
            to={items.to}
            onClick={() => handleSubMenu(items)}
            className="flex justify-between  gap-2 xx whitespace-nowrap hover:font-semibold hover:text-white font-serif hover:bg-blue-800 items-center px-2 py-1 hover:border-2 focus:text-blue-600 rounded-full hover:shadow-md hover:shadow-blue-800"
          >
            <p className='flex items-center gap-2'> {items.icon}{!widthSize && items.name}</p>  {subMenu === items.name ? <FaAngleDown /> : <FaAngleRight />}
          </Link>

          {
            subMenu === items.name && items.children && items.children.length > 0 && (
              <div className={widthSize ? `absolute -top-[0.1rem]  z-50 w-[49vw] left-7 rounded-tr-2xl rounded-es-2xl shadow-lg  shadow-[#918f8f] bg-white p-2 ` : `absolute top-full z-50 w-full  rounded-tr-2xl rounded-es-2xl shadow-lg  shadow-[#918f8f] bg-white p-3 `}>
                {
                  subMenu === items.name && (
                    <div className='flex flex-col gap-2 '>
                      {
                        items.children.map((value, index) => (
                          <div key={index} className='bg-white px-2 whitespace-nowrap text-ellipsis line-clamp-2 text-black hover:bg-[#3e3e3e] hover:text-white font-semibold rounded-full cursor-pointer py-[5px]'>
                           <Link to={value.to}>
                            <p value={value.value}>{value.name}</p>
                           </Link>
                          </div>
                        ))
                      }
                    </div>
                  )
                }
              </div>
            )
          }
        </div>
      ))}
    </div>
  );
}

export default BranchMenu