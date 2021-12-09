import React, { useRef, useState } from "react";
import { Avatar, Box, Button, TextField, Typography } from "@mui/material";
import { LoadingButton } from '@mui/lab';
import { Draggable, Map, Marker, Overlay } from "pigeon-maps"
import { stamenToner } from 'pigeon-maps/providers'
import LocationOnIcon from '@mui/icons-material/LocationOn';

interface Position {
  latitude: number;
  longitude: number;
  zoom: number;
}

export const LocationScreen = () => {
  const [usingGps, setUsingGps] = useState(false);
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
    setUsingGps(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUsingGps(false);
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
        setUsingGps(false);
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
    <>
      <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
        <LocationOnIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Where in the world are you?
      </Typography>
      <Box sx={{ mt: 1 }}>

        <LoadingButton
          onClick={useGps}
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          loading={usingGps}
        >Use GPS</LoadingButton>
        <Typography variant="h5" align="center" color="text.secondary" component="p">
          or
        </Typography>
        <Typography variant="h5" align="center" color="text.secondary" component="p"
          sx={{ mt: 3, mb: 2 }}>
          Select from the Map
        </Typography>
      </Box>
      <Map
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
        </Draggable>
      </Map>
    </ >
  )
}