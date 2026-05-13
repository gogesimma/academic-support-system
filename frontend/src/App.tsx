import { RouterProvider } from 'react-router';
import { Toaster } from './components/ui/sonner';
import { AuthProvider } from './context/AuthContext';
import { router } from './routes/index';

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster />
    </AuthProvider>
  );
}