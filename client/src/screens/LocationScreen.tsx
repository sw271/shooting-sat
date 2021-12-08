import React, { useRef, useState } from "react";
import { Button, TextField } from "@mui/material";
import { Draggable, Map, Marker, Overlay } from "pigeon-maps"
import { stamenToner } from 'pigeon-maps/providers'
import LocationOnIcon from '@mui/icons-material/LocationOn';

interface Position {
  latitude: number;
  longitude: number;
  zoom: number;
}

export const LocationScreen = () => {
  const [position, setPosition] = useState<Position>({
    latitude: 1,
    longitude: 1,
    zoom: 1
  });
  const [marker, setMarker] = useState({
    latitude: 1,
    longitude: 1,
  })

  const useGps = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        console.log("got pos", pos)
        setPosition({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          zoom: 16
        });
        setMarker({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        })
      },
      (error) => {
        console.log("Handle no goeloaction")
        console.log("posError", error)
        // setPosition({

        //   },
        //   timestamp: Date.now()
        // })
      },
      {
        enableHighAccuracy: true,

      }
    )
  }

  return (
    <div>
      <Button
        onClick={useGps}
        variant="contained">Use GPS</Button>
      <div>or</div>
      <TextField id="outlined-basic" label="Find address" variant="outlined" />
      <Map
        // ref={x}
        provider={stamenToner}
        height={300}
        center={[position.latitude, position.longitude]}
        zoom={position.zoom}
        onClick={x => {
          setMarker({
            latitude: x.latLng[0],
            longitude: x.latLng[1]
          })
        }}
      >
        <Draggable
          anchor={[marker.latitude, marker.longitude]}
          offset={[25, 50 * 0.95]} // Fudge factor to compensate for icon padding
          onDragEnd={x => {
            setMarker({
              latitude: x[0],
              longitude: x[1]
            })
          }}
        >
          <LocationOnIcon color="primary" sx={{ width: 50, height: 50, }} />
          {/* <div>a</div> */}
        </Draggable>
      </Map>
    </div >
  )
}