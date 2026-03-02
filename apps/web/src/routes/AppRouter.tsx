import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { ProductPage } from "../pages/ProductPage"
import { SummaryPage } from "../pages/SummaryPage"
import { StatusPage } from "../pages/StatusPage"

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProductPage />} />
        <Route path="/summary" element={<SummaryPage />} />
        <Route path="/status" element={<StatusPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}