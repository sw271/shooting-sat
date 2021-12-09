import { useState } from "react";
import { Avatar, Box, Button, Typography } from "@mui/material";
import { LoadingButton } from '@mui/lab';
import { Draggable, Map } from "pigeon-maps"
import { stamenToner } from 'pigeon-maps/providers'
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { ILocation } from "../interfaces/ILocation";

interface IPosition {
  latitude: number;
  longitude: number;
  zoom: number;
}

interface Props {
  location?: ILocation;
  setLocation: (location: ILocation) => void;
}

const DEFAULT_LOCATION: ILocation = {
  latitude: 1,
  longitude: 1,
}
const DEFAULT_POSITION: IPosition = {
  ...DEFAULT_LOCATION,
  zoom: 1
}
const ZOOM_WHEN_LOCATED = 16;

export const LocationScreen: React.FC<Props> = (props) => {
  const [usingGps, setUsingGps] = useState(false);
  const [position, setPosition] = useState<IPosition>(props.location ? { ...props.location, zoom: ZOOM_WHEN_LOCATED } : DEFAULT_POSITION);
  const [marker, setMarker] = useState<ILocation>(props.location ? props.location : DEFAULT_LOCATION)

  const useGps = () => {
    setUsingGps(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUsingGps(false);
        console.log("position found", pos)
        setPosition({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          zoom: ZOOM_WHEN_LOCATED
        });
        setMarker({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        })
      },
      (error) => {
        setUsingGps(false);
        console.log("position error", error);
      },
      {
        enableHighAccuracy: true
      }
    )
  }

  const onAccept = () => {
    props.setLocation(marker);
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
          sx={{ mt: 3, mb: 2 }}
        >
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
      <Button
        onClick={onAccept}
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        color='success'
      >
        Accept Location
      </Button>
    </ >
  )
}