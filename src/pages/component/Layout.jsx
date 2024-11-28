import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

export default function Layout() {
  return (
        <div className='flex flex-row w-full bg-white'>
             <Sidebar />  
             <div className='w-full'>
              <Outlet/>
              </div>
        </div>
   
  )
}