import { 
    HiHome,
    HiUserGroup,
    HiCalendar,
} from "react-icons/hi";
import { 
    PiTreeStructureFill 
} from "react-icons/pi";

export const DASHBOARD_SIDEBAR_LINKS = [
    {
        key: 'Dashboard',
        label: 'Dashboard',
        path: '/',
        icon: <HiHome />
    },
    {
        key: 'Anggota',
        label: 'Data anggota',
        path: '/Anggota',
        icon: <HiUserGroup />
    },
    {
        key: 'Kegiatan',
        label: 'Agenda kegiatan',
        path: '/kegiatan',
        icon: <HiCalendar />
    },
    {
        key: 'Organisasi',
        label: 'Struktur organisasi',
        path: '/Struktural',
        icon: <PiTreeStructureFill />
    },
]
