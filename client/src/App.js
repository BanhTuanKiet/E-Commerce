import AppRoute from './route/AppRoute';
import './style/App.css';
import Context from './context/index'

function App() {
  return (
    <div className="App">
      <Context>
        <AppRoute />
      </Context>
    </div>
  );
}

export default App;
