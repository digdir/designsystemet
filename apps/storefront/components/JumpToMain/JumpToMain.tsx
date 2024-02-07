import classes from './JumpToMain.module.css';

const JumpToMain = () => {
  return (
    <a
      className={classes.link}
      href='#main'
    >
      <span>Hopp til hovedinnhold</span>
    </a>
  );
};

export { JumpToMain };
