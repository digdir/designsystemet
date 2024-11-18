import {
  Button,
  Checkbox,
  Chip,
  Heading,
  Switch,
  Tag,
  Textfield,
} from '@digdir/designsystemet-react';

import cl from 'clsx/lite';
import classes from './BorderRadius.module.css';

export const BorderRadius = () => {
  const items = [
    {
      name: 'Small',
      value: '2px',
    },
    {
      name: 'Medium',
      value: '4px',
    },
    {
      name: 'Large',
      value: '8px',
    },
    {
      name: 'xLarge',
      value: '16px',
    },
    {
      name: 'Base',
      value: '4px',
    },
    {
      name: 'Full',
      value: '999px',
    },
  ];

  return (
    <div className='panelContainer'>
      <div className='panelLeft'>
        <Heading data-size='xs'>Tokens</Heading>
        <div className={classes.items}>
          {items.map((item, index) => (
            <div key={index} className={classes.item}>
              <div className={classes.itemName}>{item.name}:</div>
              <div className={classes.itemValue}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>
      <div className={cl('panelRight', classes.outer)}>
        <div className={classes.inner}>
          <div className={classes.card}>
            <Heading data-size='2xs'>Opprett ny bruker</Heading>
            <Textfield placeholder='Ola Normann' label='Navn' data-size='sm' />
            <Checkbox label='Send nyhetsbrev' data-size='sm' value='ff' />
            <div className={classes.btnGroup}>
              <Button data-size='sm'>Opprett bruker</Button>
              <Button data-size='sm' variant='secondary'>
                Avbryt
              </Button>
            </div>
          </div>
          <div className={classes.card}>
            <Heading data-size='2xs'>Innstillinger</Heading>
            <Switch label='Switch' data-size='sm' checked />
            <Switch label='Switch' data-size='sm' />
          </div>
          <div className={classes.card} data-size='sm'>
            <Heading data-size='2xs'>Innstillinger</Heading>
            <div className={classes.tags}>
              <Tag color='brand1'>Sport</Tag>
              <Tag color='brand2'>Nyheter</Tag>
              <Tag color='brand3'>Innenriks</Tag>
              <Tag color='neutral'>Utenriks</Tag>
              <Tag color='success'>Været</Tag>
              <Tag color='info'>Musikk</Tag>
            </div>
            <div className={classes.chips}>
              <Chip.Radio defaultChecked name='myChips' value='chip1'>
                Chip
              </Chip.Radio>
              <Chip.Radio defaultChecked name='myChips' value='chip2'>
                Chip
              </Chip.Radio>
            </div>
            <div className={classes.chips}>
              <Chip.Checkbox defaultChecked name='myChips' value='chip1'>
                Chip
              </Chip.Checkbox>
              <Chip.Checkbox defaultChecked name='myChips' value='chip2'>
                Chip
              </Chip.Checkbox>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
