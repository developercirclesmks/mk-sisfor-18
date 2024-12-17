import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./pages/component/Layout";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login"; 
import DataAnggota from "./pages/DataAnggota"; 
import AgendaKegiatan from "./pages/AgendaKegiatan";
import StrukturOrganisasi from "./pages/StrukturOrganisasi";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<Layout />}>
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route
            path="/data-anggota/:orgName"
            element={<DataAnggota />}
          />
          <Route
            path="/agenda-kegiatan/:orgName"
            element={<AgendaKegiatan />}
          />
          <Route
            path="/struktur-organisasi/:orgName"
            element={<StrukturOrganisasi />}
          />

          {/* Route page lain sesuaikan mi sama route page ku */}
 
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
