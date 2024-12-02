import React from 'react'
import { DASHBOARD_SIDEBAR_LINKS } from '../../lib/consts/Navigationn'
import { Link, useLocation } from 'react-router-dom'
import classNames from 'classnames'
import { HiOutlineLogin } from "react-icons/hi";
import { useNavigate } from 'react-router-dom';
// import { handleLogout } from '../../service/Auth';
import { signOut } from "firebase/auth";
import { auth } from "../../config/firebaseConfig";

const linkClasses = 
'flex items-center gap-4 font-light px-3 py-2 rounded-sm text-base hover:bg-gray-700 hover:no-underline active:bg-neutral-600 hover: w-[30vh]'

export default function Sidebar() {
    const navigate = useNavigate();
    const handleLogout = async () => {
        try {
            await signOut(auth);
            console.log("Logout berhasil!");
            navigate('/Login');
        } catch (error) {
            console.error("Logout gagal:", error);
            throw error;
        }
    };

  return (
    <div className='bg-slate-900 text-white p-3 fixed left-0 top-0 bottom-0 w-[35vh] flex flex-col '>
        <div className='flex items-center gap-2 px-1 py-3 text-center font-bold text-lg'>
            ORGANISASI KEMAHASISWAAN
        </div>
        {/*dashboard, anggota, kegiatan, struktural button*/}
        <div className='flex-1 py-8 flex flex-col gap-2 place-items-start '>
            {DASHBOARD_SIDEBAR_LINKS.map( (item) => (
                <SidebarLink key={item.key} item={item} />
            ))}
        </div>
        {/*logout button*/}
        <div className='flex item-center flex-col gap-0.5 pt-2 border-t border-neutral-700'
        onClick={handleLogout}>
            <div className={classNames('text-red-500 cursor-pointer', linkClasses)}
            >
                <span className='text-xl'>
                    <HiOutlineLogin />
                </span>
                Logout
            </div>
        </div>
    </div>
  )
}

function SidebarLink({item}) {
    const {pathname} = useLocation()
    return(
        <Link
            to={item.path}
            className={classNames(
                pathname === item.path ? 'bg-gray-700 text-white' : 'text-neutral-300',
                linkClasses
                )}
        >
            <span className='text-xl'>{item.icon}</span>
            {item.label}
        </Link>
    )
}
