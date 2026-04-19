import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import AdminLayout from './components/layout/AdminLayout'
import LandingPage from './pages/public/LandingPage'
import ArchivPage from './pages/public/ArchivPage'
import EditionDetailPage from './pages/public/EditionDetailPage'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import StoryFormPage from './pages/admin/StoryFormPage'
import EditionFormPage from './pages/admin/EditionFormPage'
import EditionPreviewPage from './pages/admin/EditionPreviewPage'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/archiv" element={<ArchivPage />} />
        <Route path="/ausgabe/:slug" element={<EditionDetailPage />} />
      </Route>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="story/neu" element={<StoryFormPage />} />
        <Route path="edition/neu" element={<EditionFormPage />} />
        <Route path="edition/:id" element={<EditionPreviewPage />} />
      </Route>
    </Routes>
  )
}
