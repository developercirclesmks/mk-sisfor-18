import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

export default function Layout() {
  return (
    <div>
        <div className=' flex flex-row bg-white h-screen'>
             <Sidebar />  
                <Outlet/>
        </div>
        <div className=''>
        </div>
    </div>
  )
}
