import { Button, CssBaseline,Grid } from "@material-ui/core";

import Map from "./components/Map/Map";
import { useState,useEffect } from "react";
import Header from "./components/Header/Header";
import List from "./components/List/List";
import { getPlacesData } from "./api";

function App() {


  const [bounds, setBounds] = useState({});

  const [location, setLocation] = useState([]);
  const [center, setCenter] = useState([]);
  const [places, setPlaces] = useState([]);
  const [filteredPlaces,setFilteredPlaces] = useState([]);

  const [locId, setLocId] = useState('');
  const [isLoading,setIsLoading]=useState(false);

  const [type, setType] = useState('restaurants');
  const [rating, setRating] = useState('');



  useEffect(() => {
  
    navigator.geolocation.getCurrentPosition(({coords:{latitude,longitude}})=>{
      setCenter([latitude,longitude]); 
  })

  }, []);

  useEffect(()=>{

    const filtered=places.filter((place)=>Number(place.rating) > rating);
    setFilteredPlaces(filtered);
  },[rating])

 
  useEffect(() => {

    setIsLoading(true);
    const delay=setTimeout(() => {
      if(bounds._southWest && bounds._northEast){
        
        getPlacesData(type,bounds._southWest,bounds._northEast)
        .then((data)=> {
       
          setPlaces(data.filter((place) => place.name && place.num_reviews > 0));
          console.log(places);
          setFilteredPlaces([]);
          setRating('');
          setIsLoading(false);
        })
        console.log("heoooo");
      }
    }, 3000);

    return () => {
      clearTimeout(delay)
    }
   

  }, [type,bounds]);




  return (
    <>
      <CssBaseline />
     <Header setLocation={setLocation} center={center} />
     <Grid container spacing={3} style={{width:"100%"}}>
       <Grid item xs={12} md={4}>
          <List 
                places={filteredPlaces.length ? filteredPlaces : places} 
                locId={locId} 
                isLoading={isLoading} 
                type={type}
                setType={setType}
                rating={rating}
                setRating={setRating}
         />
       </Grid>
       <Grid item xs={12} md={8}>
       <Map 
       setBounds={setBounds}
       setCenter={setCenter}
       setLocId={setLocId}
       center={center}
       places={filteredPlaces.length ? filteredPlaces : places} 
       location={location}
       />
    
       </Grid>

     </Grid>
     
    </>
  );
}

export default App;
