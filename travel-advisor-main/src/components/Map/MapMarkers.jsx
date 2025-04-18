import { Paper, Typography } from '@material-ui/core';
import { Rating } from '@material-ui/lab';
import React from 'react'
import { Marker, Popup } from 'react-leaflet';

const MapMarkers = ({place,classes,setObjClicked}) => {
    const lat= place.latitude ? Number(place.latitude) : '';
    const lng= place.longitude ? Number(place.longitude) : '' ;

  return (
    <Marker position={[lat,lng]} >
         
            <Popup>
            <Paper elevation={3} className={classes.paper}>
    <Typography className={classes.typography} variant="subtitle2" gutterBottom> {place.name}</Typography>
    <img
      onClick={()=>setObjClicked(place.location_id)}
      className={classes.pointer}
      src={place.photo ? place.photo.images.large.url : 'https://www.foodserviceandhospitality.com/wp-content/uploads/2016/09/Restaurant-Placeholder-001.jpg'}
    />
    <Rating name="read-only" size="small" value={Number(place.rating)} readOnly />
  </Paper>
             {/* <div>{place.name}</div> */}
            </Popup>
     </Marker>
  )
}

export default MapMarkers