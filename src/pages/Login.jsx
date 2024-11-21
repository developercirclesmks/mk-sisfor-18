import { useState, useEffect } from 'react';
import { toast } from "react-toastify"; 
import { auth } from "../config/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if(user) {
        navigate('/');
      }
    });
    return unsubscribe;
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("User logged in successfully");
    } catch (error) {
      console.log(error.message);
      toast.error(error.message, {
        position: "bottom-center",
      });
    }
  };

  return (
  
  <div>
      <div className="flex flex-col items-center bg-slate-200 justify-center min-h-screen">
          <form className="flex flex-col items-center justify-center bg-slate-900/80 w-2/5 max-h-fit rounded-[16px] backdrop-blur-sm gap-3 text-white"
            onSubmit={handleSubmit}>
    
      
        <h3 className='pt-7 pb-2 text-2xl font-semibold'>ORGANISASI KEMAHASISWAAN</h3>
      <div className="flex flex-col w-10/12 gap-3 capitalize">
        <label htmlFor="email">Email</label>
        <input type="email" placeholder="example@gmail.com" value={email} name="email" onChange={(e) => setEmail(e.target.value)}
           className="p-6 h-10 focus:outline-none bg-white rounded-[12px] text-black" 
           required autoComplete='email'
        />
    

        <label htmlFor="password" className="mt-2">Password</label>
        <input type="password" placeholder="password" value={password} name="password" onChange={(e) => setPassword(e.target.value)}
            className="p-6 h-10 focus:outline-none bg-white rounded-[12px] text-black" 
            required autoComplete='current-password'
        />
      </div>
      <div className='pb-7 pt-4 justify-center flex flex-col w-10/12 capitalize'>
      <button type="submit" 
      className="btn btn-primary p-2 font-medium text-white rounded-[12px]  justify-center bg-green-500"
      >Login</button>
      </div>
    

      </form>
      </div>
  </div>
  );
}

export default Login;