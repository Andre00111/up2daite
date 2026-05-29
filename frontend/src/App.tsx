import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import AdminLayout from "./components/layout/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import LandingPage from "./pages/public/LandingPage";
import ArchivPage from "./pages/public/ArchivPage";
import EditionDetailPage from "./pages/public/EditionDetailPage";
import AIJobsPage from "./pages/public/AIJobsPage";
import AIModelsPage from "./pages/public/AIModelsPage";
import AboutPage from "./pages/public/AboutPage";
import ConfirmPage from "./pages/public/ConfirmPage";
import UnsubscribePage from "./pages/public/UnsubscribePage";
import LoginPage from "./pages/LoginPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import StoryFormPage from "./pages/admin/StoryFormPage";
import EditionFormPage from "./pages/admin/EditionFormPage";
import EditionPreviewPage from "./pages/admin/EditionPreviewPage";
import SubscriberListPage from "./pages/admin/SubscriberListPage";
import AIJobListPage from "./pages/admin/AIJobListPage";
import AIJobFormPage from "./pages/admin/AIJobFormPage";
import AIModelListPage from "./pages/admin/AIModelListPage";
import AIModelFormPage from "./pages/admin/AIModelFormPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/archiv" element={<ArchivPage />} />
        <Route path="/ausgabe/:slug" element={<EditionDetailPage />} />
        <Route path="/ki-jobs" element={<AIJobsPage />} />
        <Route path="/ki-modelle" element={<AIModelsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/confirm" element={<ConfirmPage />} />
        <Route path="/unsubscribe" element={<UnsubscribePage />} />
      </Route>

      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboardPage />} />
        <Route path="story/neu" element={<StoryFormPage />} />
        <Route path="story/:id/edit" element={<StoryFormPage />} />
        <Route path="edition/neu" element={<EditionFormPage />} />
        <Route path="edition/:id" element={<EditionPreviewPage />} />
        <Route path="edition/:id/edit" element={<EditionFormPage />} />
        <Route path="subscribers" element={<SubscriberListPage />} />
        <Route path="ki-jobs" element={<AIJobListPage />} />
        <Route path="ki-jobs/neu" element={<AIJobFormPage />} />
        <Route path="ki-jobs/:id/edit" element={<AIJobFormPage />} />
        <Route path="ki-modelle" element={<AIModelListPage />} />
        <Route path="ki-modelle/neu" element={<AIModelFormPage />} />
        <Route path="ki-modelle/:id/edit" element={<AIModelFormPage />} />
      </Route>
    </Routes>
  );
}
