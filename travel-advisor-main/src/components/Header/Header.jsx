import React,{useState,useEffect} from 'react';

import { OpenStreetMapProvider } from 'leaflet-geosearch';
import { AppBar,Toolbar,Typography,InputBase,Box } from '@material-ui/core';
import { Clear, Search } from '@material-ui/icons';

import useStyles from "./styles"


const Header = ({setLocation,center}) => {
  
  const classes = useStyles()

  const [value, setValue] = useState('');
  const [locationData, setLocationData] = useState([]);


useEffect(() => {

  const provider = new OpenStreetMapProvider();
  const results = provider.search({ query: value })
  .then((value) => {
    setLocationData(value);
  });
 
}, [value])

  return (
    <AppBar position='static'>
      <Toolbar className={classes.toolbar}>
        <Typography varient="h5" className={classes.title}>
          Travel Buddy 
        </Typography>
        <Box display="flex" alignItems="center">
        <Typography varient="h6" className={classes.title}>
          Explore new places
        </Typography>

        <div style={{position:"relative"}}>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <Search />
            </div>

            
            <InputBase disabled={center.length === 0 && true} placeholder='search...'  classes={{root:classes.inputRoot,input:classes.inputInput}} value={value} onChange={(e)=>setValue(e.target.value)} />
            
          </div>
          {locationData.length !== 0 &&
            <Box className={classes.dataLocation}>
                  {locationData?.map((location,i) => (
                    <Box 
                          key={i} 
                          cursor="pointer" 
                          onClick={()=>{
                            setLocation([location.y,location.x]);
                            setLocationData('');
                            setValue('')
                          }}
                          >
                      <Typography varient="h6" className={classes.locationLabel} >
                        {location.label}
                      </Typography>
                    </Box>
                  ))}
                  </Box>
          }
          </div>



        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
