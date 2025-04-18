import React, { useCallback, useEffect, useState } from 'react';
 
export const DisplayPosition=({ map,center,zoom,setPosition,setGetBounds })=> {


  const onMove = useCallback(() => {
    setPosition(map.getCenter());
    setGetBounds(map.getBounds())
  }, [map])

  useEffect(() => {
    map.on('move', onMove)
    return () => {
      map.off('move', onMove)
    }
  }, [map, onMove])

  useEffect(() => {
    onMove()
  }, [])
  

  return (
    <p>
    </p>
  )
}

