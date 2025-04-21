import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import EventPage from './EventPage';
import TopTimesPage from './TopTimesPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />                    
        <Route path="/event/:eventId" element={<EventPage />} />
        <Route path="/event/:eventId/top-times" element={<TopTimesPage />} />
        </Routes>
    </Router>
  );
}

export default App;
