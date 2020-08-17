import { Theme, makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) => ({
  container: {
    height: '100vh',

    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroContainer: {
    display: 'flex',
    alignItems: 'center',

    '& img': {
      marginRight: theme.spacing(3),
    },
  },
  hero: {
    marginTop: theme.spacing(2),
    height: '160px',
    width: '160px',

    [theme.breakpoints.up('md')]: {
      height: '400px',
      width: '400px',
    },
  },
  select: {
    width: '160px',
  },
  flag: {
    width: '28px',
    height: '28px',
  },
  textField: {
    // width: 'auto',
    maxWidth: '400px',
  },
}));
