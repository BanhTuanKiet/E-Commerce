import AppRoute from './route/AppRoute';
import './style/App.css';
import Context from './context/index'
import { ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'

function App() {
  return (
    <div className="App">
      <Context>
        <ToastContainer />
        <AppRoute />
      </Context>
    </div>
  );
}

export default App;
