import { Routes, Route } from 'react-router-dom'
import LayoutShell from './components/layout/LayoutShell'
import ExplorePage from './pages/ExplorePage'
import PlaceDetailsPage from './pages/PlaceDetailsPage'
import SavedPage from './pages/SavedPage'
import AdminPage from './pages/AdminPage'
import ScrollToTop from './components/common/ScrollToTop'

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<LayoutShell />}>
          <Route path="/" element={<ExplorePage />} />
          <Route path="/saved" element={<SavedPage />} />
          <Route path="/profile" element={<div className="p-8 text-center text-neutral-500">Profile (Coming Soon)</div>} />
          <Route path="/admin" element={<AdminPage />} />
        </Route>
        <Route path="/place/:id" element={<PlaceDetailsPage />} />
      </Routes>
    </>
  )
}

export default App
