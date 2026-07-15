import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import PatientList from './pages/PatientList'
import PatientDetail from './pages/PatientDetail'
import MainLayout from './components/MainLayout'
import './App.css'

export default function App() {
  return (
    <BrowserRouter basename="/research-platform">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<MainLayout />}>
          <Route path="/patients" element={<PatientList />} />
          <Route path="/patients/:id" element={<PatientDetail />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
