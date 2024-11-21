import React from 'react'
import { DASHBOARD_SIDEBAR_LINKS } from '../../lib/consts/Navigationn'
import { Link, useLocation } from 'react-router-dom'
import classNames from 'classnames'
import { HiOutlineLogin } from "react-icons/hi";
import { useNavigate } from 'react-router-dom';
import { handleLogout } from '../../service/Auth';

const linkClasses = 
'flex item-center gap-2 font-light px-3 py-2 hover:bg-gray-700 hover:no-underline active:bg-neutral-600 rounded-sm text-base'

export default function Sidebar() {
    const navigate = useNavigate();

  return (
    <div className='bg-slate-900 w-60 p-3 flex flex-col text-white h-screen'>
        <div className='flex items-center gap-2 px-1 py-3'>
            ORGANISASI KEMAHASISWAAN
        </div>
        {/*dashboard, anggota, kegiatan, struktural button*/}
        <div className='flex-1 py-8 flex flex-col gap-2'>
            {DASHBOARD_SIDEBAR_LINKS.map( (item) => (
                <SidebarLink key={item.key} item={item} />
            ))}
        </div>
        {/*logout button*/}
        <div className='flex item-center flex-col gap-0.5 pt-2 border-t border-neutral-700'
        onClick={() => handleLogout}>
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
