import './App.css';
import Home from './components/Home/Home';
import Dashboard from './components/Dashboard/Dashboard';
import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";
import Authenticate from './components/helpers/Authentication';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Authenticate>
          <Dashboard/>
        </Authenticate>} />
      </Routes>
    </Router>
  );
}

export default App;