import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

export default function Layout() {
  return (
    <div className="flex h-screen">
      <div className="bg-slate-900 text-white p-3 fixed left-0 top-0 bottom-0 w-[35vh] flex flex-col">
        <Sidebar />
      </div>
      <div className="flex-1 ml-[35vh] overflow-y-auto">
        <Outlet />
      </div>
    </div>
  )
}