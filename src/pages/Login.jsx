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
      if (user) {
        navigate('/dashboard'); // Redirect to dashboard if the user is already logged in
      }
    });
    return unsubscribe;
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("User logged in successfully");
      navigate('/dashboard'); // Redirect to dashboard after successful login
    } catch (error) {
      console.log(error.message);
      toast.error(error.message, {
        position: "bottom-center",
      });
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen  bg-cover bg-center"
      style={{
        backgroundImage: 'url("/assets/bg-login.png")', // Jalur relatif ke folder public
      }}
    >
      <form
        className="flex flex-col items-center justify-center w-2/5 max-h-fit rounded-[30px]  gap-3  p-6"
        onSubmit={handleSubmit}
      >
        <h3 className="pt-7 pb-2 text-2xl font-semibold text-white">
          ORGANISASI KEMAHASISWAAN
        </h3>
        <div className="flex flex-col w-10/12 gap-3 capitalize">
          <label htmlFor="email" className="text-white">Email</label>
          <input
            type="email"
            placeholder="example@gmail.com"
            value={email}
            name="email"
            onChange={(e) => setEmail(e.target.value)}
            className="p-6 h-10 focus:outline-none bg-white rounded-[30px] text-black"
            required
            autoComplete="email"
          />
          <label htmlFor="password" className="mt-2 text-white">
            Password
          </label>
          <input
            type="password"
            placeholder="password"
            value={password}
            name="password"
            onChange={(e) => setPassword(e.target.value)}
            className="p-6 h-10 focus:outline-none bg-white rounded-[30px] text-black"
            required
            autoComplete="current-password"
          />
        </div>
        <div className="pb-7 pt-4 flex flex-col w-10/12 capitalize">
          <button
            type="submit"
            className="btn btn-primary p-6 h-10 font-medium text-white rounded-[30px] bg-green-500 flex items-center justify-center"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
