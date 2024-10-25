import React, { useEffect, useState } from 'react';
import { AdminMenuList } from '../common/index.jsx';
import { Link, useNavigate } from 'react-router-dom';

const AdminMenu = () => {
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
    <div className={`flex flex-col gap-3 border-2 ${widthSize ? 'w-[3rem]' : 'w-[42vh]'} pl-3 py-5  bg-gray-100 overflow-y-scroll lg:h-[91.5vh] h-[90.7vh]`}>
      {AdminMenuList.map((items, index) => (
        <div key={index}>
          <Link
            to={items.to}
            onClick={() => handleSubMenu(items)}
            className="flex gap-2 xx whitespace-nowrap hover:font-semibold hover:text-white font-serif hover:bg-blue-800 items-center px-2 py-1 hover:border-2 focus:text-blue-600 rounded-full hover:shadow-md hover:shadow-blue-800"
          >
            {items.icon}{!widthSize && items.name}
          </Link>
        </div>
      ))}
    </div>
  );
};

export default AdminMenu;
