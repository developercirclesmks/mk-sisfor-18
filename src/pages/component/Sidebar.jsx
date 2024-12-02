import { useState } from "react";
import { BsArrowLeftShort, BsChevronDown } from "react-icons/bs";
import { 
    HiUserGroup,
    HiCalendar,
    HiAcademicCap,
    HiOutlineLogin
} from "react-icons/hi";
import { PiTreeStructureFill } from "react-icons/pi";
import { RiDashboardFill } from "react-icons/ri";
import { useNavigate } from 'react-router-dom';
import { signOut } from "firebase/auth";
import { auth } from "../../config/firebaseConfig";

export default function Sidebar({ open, onToggle }){

    const [activeSubmenu, setActiveSubmenu] = useState(null);
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
    }

    const toggleSubmenu = (index) => {
        setActiveSubmenu(activeSubmenu === index ? null : index);
    }

    const Menus = [
        { title: "Dashboard"},
        { 
            title: "Data anggota", icon: <HiUserGroup />,
            submenu: true,
            submenuItems: [
                {title: "HMS FT-UH"},
                {title: "HMDP FT-UH"},
                {title: "HME FT-UH"},
                {title: "HMG FT-UH"},
                {title: "HMM FT-UH"},
                {title: "HMA FT-UH"},
                {title: "HMTI FT-UH"},
                {title: "HMTL FT-UH"},
                {title: "OKIF FT-UH"},
                {title: "OKSP FT-UH"},
                {title: "HMTK FT-UH"},
                {title: "PERMATA FT-UH"},
            ]
        },
        { 
            title: "Agenda kegiatan", icon: <HiCalendar />,
            submenu: true,
            submenuItems: [
                {title: "HMS FT-UH"},
                {title: "HMDP FT-UH"},
                {title: "HME FT-UH"},
                {title: "HMG FT-UH"},
                {title: "HMM FT-UH"},
                {title: "HMA FT-UH"},
                {title: "HMTI FT-UH"},
                {title: "HMTL FT-UH"},
                {title: "OKIF FT-UH"},
                {title: "OKSP FT-UH"},
                {title: "HMTK FT-UH"},
                {title: "PERMATA FT-UH"},
            ]
        },
        { 
            title: "Struktur organisasi", icon: <PiTreeStructureFill />,
            submenu: true,
            submenuItems: [
                {title: "HMS FT-UH"},
                {title: "HMDP FT-UH"},
                {title: "HME FT-UH"},
                {title: "HMG FT-UH"},
                {title: "HMM FT-UH"},
                {title: "HMA FT-UH"},
                {title: "HMTI FT-UH"},
                {title: "HMTL FT-UH"},
                {title: "OKIF FT-UH"},
                {title: "OKSP FT-UH"},
                {title: "HMTK FT-UH"},
                {title: "PERMATA FT-UH"},
            ]
        },
    ];

    return(
        <div>
        <div className="fixed top-0 left-0 h-full  z-50">
            <div className={`bg-primary h-full p-5 pt-8 ${open ? "w-60" : "w-20"} duration-300 relative flex flex-col`}>
                <BsArrowLeftShort 
                className={`bg-white text-primary text-3xl rounded-full absolute -right-3 top-9 border border-primary cursor-pointer ${!open && "rotate-180"} `}
                onClick={onToggle}/>

                <div className="inline-flex items-center gap-x-4">
                    <HiAcademicCap className="text-5xl cursor-pointer block float-left mr-2 text-white" />
                    {open && (
                        <h1 className="text-white origin-left font-bold duration-300">
                            Organisasi Kemahasiswaan
                        </h1>
                    )}
                </div>

                <ul className="pt-2 flex-grow overflow-auto scrollbar-hide">
                    {Menus.map((menu, index) => (
                        <div key={index}>
                            <li 
                            className={`text-white text-sm flex items-center gap-x-4 cursor-pointer p-2 hover:bg-gray-700/50 rounded-md mt-2 ${menu.spacing ? "mt-[48vh]" : "mt-2"}`}
                            onClick={() => toggleSubmenu(index)}>
                                <span className="text-2xl block float-left">
                                    {menu.icon ? menu.icon : <RiDashboardFill />}
                                </span>
                                <span 
                                className={`text-sm font-normal flex-1 duration-200 ${
                                    !open && "hidden"}`}>
                                    {menu.title}
                                </span>
                                {menu.submenu && open && (
                                    <BsChevronDown 
                                    className={`${activeSubmenu === index ? "rotate-180" : ""}`}/>
                                )}
                            </li>
                            {menu.submenu && activeSubmenu === index && open && (
                                <ul>
                                    {menu.submenuItems.map((submenuItems, subIndex) => (
                                        <li 
                                        key={subIndex}
                                        className={`text-white text-xs flex items-center gap-x-4 cursor-pointer p-1 px-5 hover:bg-gray-700 rounded-md mt-2 ${menu.spacing ? "mt-[50vh]" : "mt-2"}`}>
                                            {submenuItems.title}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}
                </ul>

                <div className="mt-auto">
                    <li 
                    className="text-white text-sm flex items-center gap-x-4 cursor-pointer p-2 hover:bg-gray-700/50 rounded-md"
                    onClick={handleLogout}>
                        <HiOutlineLogin className="text-2xl"/>
                        {open && <span>Logout</span>}
                    </li>
                </div>
            </div>
        </div>  
        </div>
    );
}