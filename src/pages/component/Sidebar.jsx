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
                {title: "HMS FT-UH", path: "/data-anggota/hms-ftuh", orgPath: "Organisasi_mahasiswa/HMS-FTUH/Anggota_organisasi" },
                {title: "HMDP FT-UH", path: "/data-anggota/hmdp-ftuh", orgPath: "Organisasi_mahasiswa/HMDP-FTUH/Anggota_organisasi" },
                {title: "HME FT-UH", path: "/data-anggota/hme-ftuh", orgPath: "Organisasi_mahasiswa/HME-FTUH/Anggota_organisasi" },
                {title: "HMG FT-UH", path: "/data-anggota/hmg-ftuh", orgPath: "Organisasi_mahasiswa/HMG-FTUH/Anggota_organisasi" },
                {title: "HMM FT-UH", path: "/data-anggota/hmm-ftuh", orgPath: "Organisasi_mahasiswa/HMM-FTUH/Anggota_organisasi" },
                {title: "HMA FT-UH", path: "/data-anggota/hma-ftuh", orgPath: "Organisasi_mahasiswa/HMA-FTUH/Anggota_organisasi" },
                {title: "HMTI FT-UH", path: "/data-anggota/hmti-ftuh", orgPath: "Organisasi_mahasiswa/HMTI-FTUH/Anggota_organisasi" },
                {title: "HMTL FT-UH", path: "/data-anggota/hmtl-ftuh",  orgPath: "Organisasi_mahasiswa/HMTL-FTUH/Anggota_organisasi" },
                {title: "OKIF FT-UH", path: "/data-anggota/okif-ftuh", orgPath: "Organisasi_mahasiswa/OKIF-FTUH/Anggota_organisasi" },
                {title: "OKSP FT-UH", path: "/data-anggota/oksp-ftuh", orgPath: "Organisasi_mahasiswa/OKSP-FTUH/Anggota_organisasi" },
                {title: "HMTK FT-UH", path: "/data-anggota/hmtk-ftuh", orgPath: "Organisasi_mahasiswa/HMTK-FTUH/Anggota_organisasi" },
                {title: "PERMATA FT-UH", path: "/data-anggota/permata-ftuh", orgPath: "Organisasi_mahasiswa/PERMATA-FTUH/Anggota_organisasi" },
            ]
        },
        { 
            title: "Agenda kegiatan", icon: <HiCalendar />,
            submenu: true,
            submenuItems: [
                {title: "HMS FT-UH", path: "/agenda-anggota/hms-ftuh", orgPath: "Organisasi_mahasiswa/HMS-FTUH/Agenda_organisasi" },
                {title: "HMDP FT-UH", path: "/agenda-anggota/hmdp-ftuh", orgPath: "Organisasi_mahasiswa/HMDP-FTUH/Agenda_organisasi" },
                {title: "HME FT-UH", path: "/agenda-anggota/hme-ftuh", orgPath: "Organisasi_mahasiswa/HME-FTUH/Agenda_organisasi" },
                {title: "HMG FT-UH", path: "/agenda-anggota/hmg-ftuh", orgPath: "Organisasi_mahasiswa/HMG-FTUH/Agenda_organisasi" },
                {title: "HMM FT-UH", path: "/agenda-anggota/hmm-ftuh", orgPath: "Organisasi_mahasiswa/HMM-FTUH/Agenda_organisasi" },
                {title: "HMA FT-UH", path: "/agenda-anggota/hma-ftuh", orgPath: "Organisasi_mahasiswa/HMA-FTUH/Agenda_organisasi" },
                {title: "HMTI FT-UH", path: "/agenda-anggota/hmti-ftuh", orgPath: "Organisasi_mahasiswa/HMTI-FTUH/Agenda_organisasi" },
                {title: "HMTL FT-UH", path: "/agenda-anggota/hmtl-ftuh",  orgPath: "Organisasi_mahasiswa/HMTL-FTUH/Agenda_organisasi" },
                {title: "OKIF FT-UH", path: "/agenda-anggota/okif-ftuh", orgPath: "Organisasi_mahasiswa/OKIF-FTUH/Agenda_organisasi" },
                {title: "OKSP FT-UH", path: "/agenda-anggota/oksp-ftuh", orgPath: "Organisasi_mahasiswa/OKSP-FTUH/Agenda_organisasi" },
                {title: "HMTK FT-UH", path: "/agenda-anggota/hmtk-ftuh", orgPath: "Organisasi_mahasiswa/HMTK-FTUH/Agenda_organisasi" },
                {title: "PERMATA FT-UH", path: "/agenda-anggota/permata-ftuh", orgPath: "Organisasi_mahasiswa/PERMATA-FTUH/Agenda_organisasi" },
            ]
        },
        { 
            title: "Struktur organisasi", icon: <PiTreeStructureFill />,
            submenu: true,
            submenuItems: [
                {title: "HMS FT-UH", path: "/struktur-anggota/hms-ftuh", orgPath: "Organisasi_mahasiswa/HMS-FTUH/Struktur_organisasi" },
                {title: "HMDP FT-UH", path: "/struktur-anggota/hmdp-ftuh", orgPath: "Organisasi_mahasiswa/HMDP-FTUH/Struktur_organisasi" },
                {title: "HME FT-UH", path: "/struktur-anggota/hme-ftuh", orgPath: "Organisasi_mahasiswa/HME-FTUH/Struktur_organisasi" },
                {title: "HMG FT-UH", path: "/struktur-anggota/hmg-ftuh", orgPath: "Organisasi_mahasiswa/HMG-FTUH/Struktur_organisasi" },
                {title: "HMM FT-UH", path: "/struktur-anggota/hmm-ftuh", orgPath: "Organisasi_mahasiswa/HMM-FTUH/Struktur_organisasi" },
                {title: "HMA FT-UH", path: "/struktur-anggota/hma-ftuh", orgPath: "Organisasi_mahasiswa/HMA-FTUH/Struktur_organisasi" },
                {title: "HMTI FT-UH", path: "/struktur-anggota/hmti-ftuh", orgPath: "Organisasi_mahasiswa/HMTI-FTUH/Struktur_organisasi" },
                {title: "HMTL FT-UH", path: "/struktur-anggota/hmtl-ftuh",  orgPath: "Organisasi_mahasiswa/HMTL-FTUH/Struktur_organisasi" },
                {title: "OKIF FT-UH", path: "/struktur-anggota/okif-ftuh", orgPath: "Organisasi_mahasiswa/OKIF-FTUH/AStruktur_organisasi" },
                {title: "OKSP FT-UH", path: "/struktur-anggota/oksp-ftuh", orgPath: "Organisasi_mahasiswa/OKSP-FTUH/Struktur_organisasi" },
                {title: "HMTK FT-UH", path: "/struktur-anggota/hmtk-ftuh", orgPath: "Organisasi_mahasiswa/HMTK-FTUH/Struktur_organisasi" },
                {title: "PERMATA FT-UH", path: "/struktur-anggota/permata-ftuh", orgPath: "Organisasi_mahasiswa/PERMATA-FTUH/Struktur_organisasi" },
            ]
        },
    ];

    return(
        <div>
        <div className="fixed top-0 left-0 h-full  z-50">
            <div className={`bg-primary h-full p-5 pt-8 ${open ? "w-60" : "w-20"} duration-700 relative flex flex-col`}>
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
                            onClick={() => {
                                // Jika tidak ada submenu, langsung navigasi
                                if (!menu.submenu) {
                                  navigate(menu.path || "/Dashboard"); // Navigasi ke path menu
                                } else {
                                  toggleSubmenu(index); // Toggle sub-menu
                                }
                              }}
                            >
                                <span className="text-2xl block float-left"
                                onClick={() => navigate('/Dashboard')}
                                >
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
                                        className={`text-white text-xs flex items-center gap-x-4 cursor-pointer p-1 px-5 hover:bg-gray-700 rounded-md mt-2 ${menu.spacing ? "mt-[50vh]" : "mt-2"}`}
                                        onClick={() => navigate(submenuItems.path)}
                                        >
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
};