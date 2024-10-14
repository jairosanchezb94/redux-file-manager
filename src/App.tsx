import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CounterComponent from './components/Counter/CounterComponent';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CounterComponent />} />
      </Routes>
    </Router>
  );
};

export default App;
