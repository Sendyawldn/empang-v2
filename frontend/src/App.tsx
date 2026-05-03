import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminSettingsPage from "./pages/admin/AdminSettingsPage";

// Halaman Publik
import HomePage from "./pages/HomePage";
import BookingPage from "./pages/BookingPage";
import StatusPage from "./pages/StatusPage";
import JadwalPage from "./pages/JadwalPage";

// Halaman Admin (Perhatikan tambahan /admin di jalurnya)
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminReportPage from "./pages/admin/AdminReportPage";
import AdminRekapHybridPage from "./pages/admin/AdminRekapHybridPage";
import AdminLombaPage from "./pages/admin/AdminLombaPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rute Publik */}
        <Route path="/" element={<HomePage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/status" element={<StatusPage />} />
        <Route path="/jadwal" element={<JadwalPage />} />

        {/* Rute Admin */}
        <Route path="/empang-rahasia" element={<AdminLoginPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/reports" element={<AdminReportPage />} />
        <Route path="/admin/settings" element={<AdminSettingsPage />} />
        <Route path="/admin/rekap-hybrid" element={<AdminRekapHybridPage />} />
        <Route path="/admin/lomba" element={<AdminLombaPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
