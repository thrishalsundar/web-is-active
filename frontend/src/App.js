import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path='/' element={<Login/>}/>
        <Route exact path='/signup' element={<Register/>}/>
        <Route exact path='/home' element={<Home/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
