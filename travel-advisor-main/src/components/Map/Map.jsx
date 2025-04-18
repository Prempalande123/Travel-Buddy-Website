import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer} from 'react-leaflet'
import { useMediaQuery, CircularProgress } from '@material-ui/core';

import { DisplayPosition } from './DisplayPosition';
import MapMarkers from './MapMarkers';


import "leaflet/dist/leaflet.css"
import useStyles from './styles.js';



const Map=({setBounds,setCenter,setLocId,center,places,location})=> {
  
  const isDesktop = useMediaQuery('(min-width:600px)');
  const classes = useStyles();

  const [map, setMap] = useState(null)
  const [position, setPosition] = useState({})
  const [getBounds, setGetBounds] = useState({})
  const [objClicked, setObjClicked] = useState('');
  const zoom = 13;


useEffect(() => {
    const L = require("leaflet");
  
    delete L.Icon.Default.prototype._getIconUrl;

    L.Icon.Default.mergeOptions({
      iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
      iconUrl: require("leaflet/dist/images/marker-icon.png"),
      shadowUrl: require("leaflet/dist/images/marker-shadow.png")
    });

    
}, []);

  useEffect(() => {
    setBounds(getBounds);
  }, [position])

  
  useEffect(() => {

    setLocId(objClicked)
    
  }, [objClicked])



useEffect(() => {
  if(location.length){
    map.setView(location,zoom)
  }
    }, [location])
  return (
    <div>


      {map ? <DisplayPosition map={map} center={center} zoom={zoom} setPosition={setPosition} setGetBounds={setGetBounds} /> : null}
     
      <div className={classes.mapContainer} >
{center.length !== 0 ?
      <MapContainer
        style={{height:"100%"}}
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        whenCreated={setMap}
        >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />  
         

           {places !== undefined && places.map((place,index)=>
              
              
             <MapMarkers key={index} place={place} classes={classes} setObjClicked={setObjClicked} />
            
            )}
         
      </MapContainer>
      :
      <div style={{width:"100%",height:"100%",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center"}}><CircularProgress /><span>Find your location..</span><button onClick={()=>setCenter([53,9.05])}>cancle</button></div>

}
      </div>



    </div>
  )
}

export default Map
