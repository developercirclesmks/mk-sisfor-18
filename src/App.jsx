import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./pages/component/Layout";
import Dashboard from "./pages/Dashboard";
import Anggota from "./pages/Anggota";
import Kegiatan from "./pages/Kegiatan";
import Struktural from "./pages/Struktural";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path='Anggota' element={<Anggota />} />
          <Route path='Kegiatan' element={<Kegiatan />} />
          <Route path='Struktural' element={<Struktural />} />

        </Route>

        <Route path="Login" element={<div>ini halaman Login</div>}/>
      </Routes>
    </Router>
  );
}

export default App;
