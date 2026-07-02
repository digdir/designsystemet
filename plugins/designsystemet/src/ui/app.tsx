import '@digdir/designsystemet-css/theme';
import '@digdir/designsystemet-css';
import { Button } from '@digdir/designsystemet-react';
import { useEffect, useState } from 'react';

import './app.css';

function App() {
  const [_count, _setCount] = useState(0);
  const [_pingCount, _setPingCount] = useState(0);

  useEffect(() => {
    // UI_CHANNEL.subscribe('ping', () => {
    //   setPingCount((cnt) => cnt + 1);
    // });
  }, []);

  return (
    <div className='homepage'>
      <h1>Designsystemet</h1>
      <Button>hot refresh me</Button>
    </div>
  );
}

export default App;
