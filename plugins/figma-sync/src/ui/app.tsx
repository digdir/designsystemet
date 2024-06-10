import '@digdir/designsystemet-theme';
import '@digdir/designsystemet-css';

import './App.css';
import { Routes, Route } from 'react-router-dom';

import PageOne from './pages/PageOne/PageOne';
import PageTwo from './pages/PageTwo/PageTwo';
import PageThree from './pages/pageThree/PageThree';
import { Footer } from './components/Footer/Footer';

function App() {
  return (
    <div>
      {/* <div className='links'>
        <NavLink
          className={({ isActive }) => (isActive ? 'link active' : 'link')}
          to='/'
        >
          Lokale variabler
        </NavLink>
        <NavLink
          className='link'
          to='/pageTwo'
        >
          Sync fra repo
        </NavLink>
        <NavLink
          className='link'
          to='/pageThree'
        >
          Oppdater UI Kit
        </NavLink>
      </div> */}

      <div className='content'>
        <Routes>
          <Route
            path='/'
            element={<PageOne />}
          />
          <Route
            path='/pageTwo'
            element={<PageTwo />}
          />
          <Route
            path='/pageThree'
            element={<PageThree />}
          />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
