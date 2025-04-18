import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(() => ({
  paper: {
     display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100px!important',boxShadow:"none!important",
  },
  mapContainer: {
    height: '80vh', width: '100%',
  },
  markerContainer: {
    position: 'absolute', transform: 'translate(-50%, -50%)', zIndex: 1, '&:hover': { zIndex: 2 },
  },
  pointer: {
    cursor: 'pointer',
    height:"90px",
  },
}));