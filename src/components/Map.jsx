import React, { useEffect, useMemo, useState } from "react";
import {
  GoogleMap,
  useLoadScript,
  MarkerF,
  InfoWindow,
} from "@react-google-maps/api";
import { poi } from "../utils/axiosTool";
import calendar from "../assets/calendar.png";
import station from "../assets/fuel.png";
import trotinettesImage from "../assets/trotinettes.png";
import mapStyles from "./mapStyles";
import InfoWindoDetails from "./InfoWindoDetails";

function Map() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_TOKEN,
  });

  const [events, setEvents] = useState([]);
  const [stations, setStations] = useState([]);
  const [selectedPoi, setSelectedPoi] = useState(null);
  const [trotinettes, setTrotinettes] = useState(null);

  const center = useMemo(() => ({ lat: 44.837789, lng: -0.57918 }), []);

  useEffect(() => {
    poi.getEvents().then((result) => setEvents(result.records));
    poi.getStations().then((result) => setStations(result.records));
    poi.getTrotinettes().then((result) => setTrotinettes(result.data.stations));
  }, []);

  if (!isLoaded || !events || !stations || !trotinettes)
    return <div>Loading...</div>;
  console.log(trotinettes);
  return (
    <>
      <GoogleMap
        zoom={12}
        center={center}
        mapContainerStyle={{
          height: "70vh",
          width: "100%",
        }}
        options={{ styles: mapStyles }}
      >
        {events.map((poi) => (
          <MarkerF
            key={poi.recordid}
            onClick={() => {
              setSelectedPoi({
                poi: poi,
                type: "event",
                lat: poi.fields.location_coordinates[0],
                lng: poi.fields.location_coordinates[1],
              });
            }}
            position={{
              lat: poi.fields.location_coordinates[0],
              lng: poi.fields.location_coordinates[1],
            }}
            icon={{
              url: calendar,
              fillColor: "#EB00FF",
              scale: 5,
            }}
          />
        ))}

        {stations.map((poi) => (
          <MarkerF
            key={poi.recordid}
            onClick={() => {
              setSelectedPoi({
                poi: poi,
                type: "station",
                lat: poi.fields.geom[0],
                lng: poi.fields.geom[1],
              });
            }}
            position={{
              lat: poi.fields.geom[0],
              lng: poi.fields.geom[1],
            }}
            icon={{
              url: station,
              fillColor: "#EB00FF",
              scale: 5,
            }}
          />
        ))}
        {trotinettes.map((poi) => (
          <MarkerF
            key={poi.station_id}
            onClick={() => {
              setSelectedPoi({
                poi: poi,
                type: "trotinettes",
                lat: poi.lat,
                lng: poi.lon,
              });
            }}
            position={{
              lat: poi.lat,
              lng: poi.lon,
            }}
            icon={{
              url: trotinettesImage,
              fillColor: "#EB00FF",
              scale: 0.1,
              size: "1px",
            }}
          />
        ))}
        {selectedPoi && (
          <InfoWindow
            onCloseClick={() => {
              setSelectedPoi(null);
            }}
            position={{
              lat: selectedPoi.lat,
              lng: selectedPoi.lng,
            }}
          >
            <InfoWindoDetails poi={selectedPoi} />
          </InfoWindow>
        )}
      </GoogleMap>
    </>
  );
}

export default Map;
