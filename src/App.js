import './stylesheet/theme.css'
import './stylesheet/alignments.css'
import './stylesheet/textelements.css'
import './stylesheet/custom-component.css'
import './stylesheet/form-element.css'
import './stylesheet/layout.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './pages/common/Login'
import Register from './pages/common/Register'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/common/Home'
import Exams from './pages/admin/Exams'
import AddEditExam from './pages/admin/Exams/AddEditExam'
import Loader from './components/Loader'
import { useSelector } from "react-redux";

function App() {
  const { loading } = useSelector((state) => state.loader);
  return (
    <>
      {loading && <Loader />}
      <BrowserRouter>
        <Routes>
          {/* Common routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* User route */}
          <Route path="/" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>} />

          {/* Admin routes */}
          <Route path='/admin/exams' element={
            <ProtectedRoute>
              <Exams />
            </ProtectedRoute>
          }>
          </Route>
          <Route path='/admin/exams/add' element={
            <ProtectedRoute>
              <AddEditExam />
            </ProtectedRoute>
          }>
          </Route>
          <Route path='/admin/exams/edit/:id' element={
            <ProtectedRoute>
              <AddEditExam />
            </ProtectedRoute>
          }>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
