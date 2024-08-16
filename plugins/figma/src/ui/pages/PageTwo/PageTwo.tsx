import { Type } from 'lucide-react';

import { Card } from '@ui/components/Card/Card';
import { CardButton } from '@ui/components/CardButton/CardButton';

function PageTwo() {
  return (
    <div className='content'>
      <div>
        <Card
          url={'/themes/colors'}
          title='Inter'
          icon={<Type />}
        />
        <CardButton />
      </div>
    </div>
  );
}

export default PageTwo;
