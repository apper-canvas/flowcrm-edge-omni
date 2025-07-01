import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Layout from '@/components/organisms/Layout';
import Dashboard from '@/components/pages/Dashboard';
import Contacts from '@/components/pages/Contacts';
import Deals from '@/components/pages/Deals';
import Tasks from '@/components/pages/Tasks';
import Activities from '@/components/pages/Activities';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <Layout title="Dashboard">
            <Dashboard />
          </Layout>
        } />
        <Route path="/contacts" element={
          <Layout title="Contacts">
            <Contacts />
          </Layout>
        } />
        <Route path="/deals" element={
          <Layout title="Deals">
            <Deals />
          </Layout>
        } />
        <Route path="/tasks" element={
          <Layout title="Tasks">
            <Tasks />
          </Layout>
        } />
        <Route path="/activities" element={
          <Layout title="Activities">
            <Activities />
          </Layout>
        } />
      </Routes>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: 9999 }}
      />
    </Router>
  );
}

export default App;