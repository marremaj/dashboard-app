import './App.css';
import Dashboard from './Dashboard';
import Selector from './Selector';
import { useState } from 'react';
import Adder from './Adder'

function App() {
  const [openDash, setOpenDash] = useState(1)
  return (
    <div className="App">
      <div className="header">
        <div className="Navigation">
          <Selector setDash={setOpenDash} />
        </div>
        <div className="DashboardAdd">
          <Adder type="Dashboard" />
        </div>
      </div>
      <div className="Dashboard">
        {
          openDash && <Dashboard dash={openDash} />
        }
      </div>
    </div>
  );
}

export default App;
