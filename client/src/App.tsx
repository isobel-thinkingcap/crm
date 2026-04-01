import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ContactsPage from './pages/ContactsPage';
import CompaniesPage from './pages/CompaniesPage';
import DealsPage from './pages/DealsPage';
import DashboardPage from './pages/DashboardPage';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/contacts" element={<ContactsPage />} />
        <Route path="/companies" element={<CompaniesPage />} />
        <Route path="/deals" element={<DealsPage />} />
      </Routes>
    </Layout>
  );
}
