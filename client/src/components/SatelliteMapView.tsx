import { Map, Marker, Overlay } from "pigeon-maps"
import { stamenToner } from 'pigeon-maps/providers'
import { ILocation } from "../models/ILocation"
import { useGetSelectedSatellitePass } from "../operations/queries";
import { ZOOM_WHEN_LOCATED } from "../screens/LocationScreen";

interface Props {
  location: ILocation;
}
const COMPASS_L = 300
const CIRCLE_R = 40
const TRI_BOUNDING_R = 7
const TRI_R = CIRCLE_R + 5

const createTrianglePoly = (bearingDegrees: number) => {
  const rads = bearingDegrees * Math.PI / 180;
  const up_shift = -Math.cos(rads) * TRI_R;
  const right_shift = Math.sin(rads) * TRI_R;
  const side1 = [TRI_BOUNDING_R * Math.cos(rads + 0 * Math.PI / 3 + Math.PI / 2), TRI_BOUNDING_R * Math.sin(rads + 0 * Math.PI / 3 + Math.PI / 2)];
  const side2 = [TRI_BOUNDING_R * Math.cos(rads + 2 * Math.PI / 3 + Math.PI / 2), TRI_BOUNDING_R * Math.sin(rads + 2 * Math.PI / 3 + Math.PI / 2)];
  const side3 = [TRI_BOUNDING_R * Math.cos(rads + 4 * Math.PI / 3 + Math.PI / 2), TRI_BOUNDING_R * Math.sin(rads + 4 * Math.PI / 3 + Math.PI / 2)];
  return `
    ${right_shift + 50 + side1[0]},${up_shift + 50 + side1[1]}
    ${right_shift + 50 + side2[0]},${up_shift + 50 + side2[1]}
    ${right_shift + 50 + side3[0]},${up_shift + 50 + side3[1]}
  `;
}

export const SatelliteMapView: React.FC<Props> = (props) => {
  const q = useGetSelectedSatellitePass();
  return (
    <Map
      provider={stamenToner}
      height={300}
      defaultCenter={[props.location.latitude, props.location.longitude]} defaultZoom={ZOOM_WHEN_LOCATED}
    >
      <Marker width={50} anchor={[props.location.latitude, props.location.longitude]} />
      {
        q.data && q.data.selectedSatellitePass && (
          <Overlay anchor={[props.location.latitude, props.location.longitude]} offset={[COMPASS_L / 2, COMPASS_L / 2]} >
            <svg height={COMPASS_L} width={COMPASS_L} viewBox="0 0 100 100">
              <circle cx="50" cy="50" r={CIRCLE_R} stroke="#8bbae8" strokeWidth="3" fillOpacity="0" />
              <polygon points={createTrianglePoly(q.data.selectedSatellitePass.riseAzimuth)} fill="green" strokeWidth="0" />
              <polygon points={createTrianglePoly(q.data.selectedSatellitePass.setAzimuth)} fill="red" strokeWidth="0" />
            </svg>
          </Overlay>
        )
      }
    </Map>
  )
}