import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import Layout from './layouts/DefaultLayout';
import { Toaster } from '@/components/ui/toaster';
import { TaskProvider } from './contexts/TaskContext';

const App = () => (
  <BrowserRouter>
    <TaskProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Index />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      <Toaster />
    </TaskProvider>
  </BrowserRouter>
);

export default App;
