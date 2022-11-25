import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  GoogleMap,
  useLoadScript,
  MarkerF,
  InfoWindow,
} from "@react-google-maps/api";
import { poi } from "../utils/axiosTool";
import calendar from "../assets/calendar.png";
import station from "../assets/fuel.png";
import bike from "../assets/bike.png";
import espace from "../assets/espace.png";
import mapStyles from "./mapStyles";
import InfoWindoDetails from "./InfoWindoDetails";

function Map() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_TOKEN,
  });

  const poiTypes = [
    { label: "Events", value: "events" },
    { label: "Stations", value: "stations" },
    { label: "Velos", value: "velos" },
    { label: "Espaces verts", value: "espaces" },
  ];

  const center = useMemo(() => ({ lat: 44.837789, lng: -0.57918 }), []);
  const [events, setEvents] = useState([]);
  const [stations, setStations] = useState([]);
  const [velos, setVelos] = useState([]);
  const [espaces, setEspaces] = useState([]);
  const [selectedPoi, setSelectedPoi] = useState(null);
  const [poiDisplayed, setPoiDisplayed] = useState({
    events: false,
    stations: false,
    velos: false,
    espaces: false,
  });

  async function getJSON(jsonFile) {
    const request = new Request(jsonFile);
    const response = await fetch(request);
    const json = await response.json();
    return json;
  }

  const inputRefEvents = useRef(true);
  const handleChange = (e) => {
    const poiTypes = { ...poiDisplayed };
    poiTypes[e.target.value] = e.target.checked;
    setPoiDisplayed(poiTypes);
  };

  useEffect(() => {
    poi.getEvents().then((result) => setEvents(result.records));
    poi.getStations().then((result) => setStations(result.records));
    poi.getEspaces().then((result) => setEspaces(result.records));
    getJSON("../data/stations_vcub.json").then((result) => setVelos(result));
  }, []);

  if (!isLoaded || !events || !stations || !velos) return <div>Loading...</div>;

  return (
    <>
      <div>
        {poiTypes.map((type, index) => (
          <label key={index}>
            {type.label}:
            <input
              value={type.value}
              type="checkbox"
              defaultChecked={false}
              onChange={handleChange}
            />
          </label>
        ))}
      </div>

      <GoogleMap
        zoom={12}
        center={center}
        mapContainerStyle={{
          height: "70vh",
          width: "100%",
        }}
        options={{ styles: mapStyles }}
      >
        {poiDisplayed.events &&
          events.map((poi) => (
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

        {poiDisplayed.stations &&
          stations.map((poi) => (
            <MarkerF
              key={poi.recordid}
              onClick={() => {
                setSelectedPoi({
                  poi: poi,
                  type: "station",
                  lat: poi.geometry.coordinates[1],
                  lng: poi.geometry.coordinates[0],
                });
              }}
              position={{
                lat: poi.geometry.coordinates[1],
                lng: poi.geometry.coordinates[0],
              }}
              icon={{
                url: station,
                fillColor: "#EB00FF",
                scale: 5,
              }}
            />
          ))}

        {poiDisplayed.velos &&
          velos.map((poi) => (
            <MarkerF
              key={poi.recordid}
              onClick={() => {
                setSelectedPoi({
                  poi: poi,
                  type: "velo",
                  lat: poi.fields.geo_point_2d[0],
                  lng: poi.fields.geo_point_2d[1],
                });
              }}
              position={{
                lat: poi.fields.geo_point_2d[0],
                lng: poi.fields.geo_point_2d[1],
              }}
              icon={{
                url: bike,
                fillColor: "#EB00FF",
                scale: 5,
              }}
            />
          ))}

        {poiDisplayed.espaces &&
          espaces.map((poi) => (
            <MarkerF
              key={poi.recordid}
              onClick={() => {
                setSelectedPoi({
                  poi: poi,
                  type: "espace",
                  lat: poi.fields.geo_point_2d[0],
                  lng: poi.fields.geo_point_2d[1],
                });
              }}
              position={{
                lat: poi.fields.geo_point_2d[0],
                lng: poi.fields.geo_point_2d[1],
              }}
              icon={{
                url: espace,
                fillColor: "#EB00FF",
                scale: 5,
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
