import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import RoleSelection from "./auth/ui/choose-role";
import Registration from "./auth/Registration";
import Login from "./auth/Login";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/select" replace />} />

        <Route path="/select" element={<RoleSelection />} />

        <Route path="/register" element={<Registration />} />
        <Route path="/login" element={<Login />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;