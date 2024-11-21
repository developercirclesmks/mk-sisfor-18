import { signOut } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import { toast } from "react-toastify";

export const handleLogout = async (navigate) => {
    try {
        await signOut(auth);
        toast.success('Logout successful!', {
            position: "bottom-center",
        });
        navigate('/Login');
    } catch (error) {
        toast.error('Logout failed. Please try again.', {
            position: "bottom-center",
        });
        console.error("Logout Error: ", error.message);
    }
};
