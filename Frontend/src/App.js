import logo from './logo.svg';
import './App.css';
import Navbar from './Components/Navbar/Navbar';
import PaginatedList from './Components/Pagination/PaginatedList';


function App() {
  return (
    <div className="App">
      <Navbar/>
      <PaginatedList/>
    </div>
  );
}

export default App;
