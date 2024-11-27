// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./pages/component/Layout";
import Dashboard from "./pages/Dashboard";
import Anggota from "./pages/Anggota";
import Kegiatan from "./pages/Kegiatan";
import Struktural from "./pages/Struktural";
import Login from "./pages/Login";
import OkifFtUh from "./pages/OkifFtUh";  
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="anggota" element={<Anggota />} />
          <Route path="kegiatan" element={<Kegiatan />} />
          <Route path="struktural" element={<Struktural />} />
          <Route path="okif-ft-uh" element={<OkifFtUh />} /> {/* Menambahkan route ke OkifFtUh */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
