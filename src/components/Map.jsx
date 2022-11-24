import React, { useEffect, useMemo, useState } from "react";
import { GoogleMap, useLoadScript, MarkerF } from "@react-google-maps/api";
import { anglet } from "../utils/axiosTool";
import icon from "../assets/react.svg";

console.log(import.meta.env.GOOGLE_TOKEN);

function Map() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_TOKEN,
  });

  const [data, setData] = useState([]);

  const center = useMemo(() => ({ lat: 43.5, lng: -1.5 }), []);

  useEffect(() => {
    anglet.getParking().then((result) => setData(result.records));
  }, []);

  if (!isLoaded || !data) return <div>Loading...</div>;

  return (
    <>
      <GoogleMap
        zoom={12}
        center={center}
        mapContainerStyle={{
          height: "70vh",
          width: "100%",
        }}
      >
        {data.map((poi) => (
          <MarkerF
            position={{
              lat: poi.geometry.coordinates[1],
              lng: poi.geometry.coordinates[0],
            }}
            icon={{
              url: icon,
              fillColor: "#EB00FF",
              scale: 5,
            }}
          />
        ))}
      </GoogleMap>
    </>
  );
}

export default Map;
