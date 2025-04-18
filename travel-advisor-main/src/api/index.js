import axios from "axios";



export const getPlacesData = async(type,sw,ne) =>{
    try{
        const {data:{data}} = await axios.get(`https://travel-advisor.p.rapidapi.com/${type}/list-in-boundary`, {
 
          params: {
            bl_latitude: sw.lat,
            tr_latitude:ne.lat,
            bl_longitude: sw.lng,
            tr_longitude:ne.lng,
          },
          headers: {
            'x-rapidapi-host': 'travel-advisor.p.rapidapi.com',
            'x-rapidapi-key': 'e340a894cemsh0a5d42f009bed6bp1d5f9fjsn1028ccd7b5e1'
          }
        });

        return data;
        
    }catch(error){
        console.log(error)
    }
}
