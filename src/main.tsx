import 'react-datepicker/dist/react-datepicker.css';
import ReactDOM from 'react-dom/client';
import 'react-toastify/dist/ReactToastify.css';
import App from './App.tsx';
import './index.css';
import './thems/css/collapse-tree-view.css';
import './thems/css/demo.min.css';
import './thems/css/tabler-flags.min.css';
import './thems/css/tabler-payments.min.css';
import './thems/css/tabler-vendors.min.css';
import './thems/css/tabler.min.css';
import './thems/js/demo.min.js';
import './thems/js/tabler.js';
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(<App />);
