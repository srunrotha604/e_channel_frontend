import { BrowserRouter as Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import './App.css';
import AuthContextProvider from './context/AuthContext';
import ThemeContextProvider from './context/ThemeContext';
import AllRoutes from './router/index.tsx';

function App() {
  return (
    <ThemeContextProvider>
      <ToastContainer
        {...{
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        }}
      />
      <Router
        basename={import.meta.env.VITE_BASE_URL}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <AuthContextProvider>
          <AllRoutes />
        </AuthContextProvider>
      </Router>
    </ThemeContextProvider>
  );
}

export default App;
