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
import coeur from "../assets/coeur.png";
import mapStyles from "./mapStyles";
import InfoWindoDetails from "./InfoWindoDetails";
import Formulaire from "./Formulaire";

function Map() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_TOKEN,
  });

  const [events, setEvents] = useState([]);
  const [stations, setStations] = useState([]);
  const [selectedPoi, setSelectedPoi] = useState(null);
  const [position, setPosition] = useState({
    latit: 0,
    longit: 0,
  });
  const [showFormulaire, setShowFormulaire] = useState(false);
  const [favourites, setFavorites] = useState([]);
  const favouritesList = JSON.parse(localStorage.getItem("Favourites"));

  const center = useMemo(() => ({ lat: 44.837789, lng: -0.57918 }), []);

  useEffect(() => {
    poi.getEvents().then((result) => setEvents(result.records));
    poi.getStations().then((result) => setStations(result.records));
  }, []);

  if (!isLoaded || !events || !stations) return <div>Loading...</div>;

  const addMarker = (position) => {
    setPosition({
      latit: parseFloat(position.latLng.lat()),
      longit: parseFloat(position.latLng.lng()),
    });
    setShowFormulaire(true);
  };
  console.log(selectedPoi);
  return (
    <>
      {showFormulaire && (
        <Formulaire
          lat={position.latit}
          lng={position.longit}
          favourites={favourites}
          setFavorites={setFavorites}
          showFormulaire={showFormulaire}
          setShowFormulaire={setShowFormulaire}
        />
      )}
      <GoogleMap
        zoom={12}
        center={center}
        mapContainerStyle={{
          height: "70vh",
          width: "100%",
        }}
        options={{ styles: mapStyles }}
        onClick={addMarker}
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
        {favouritesList.map((poi) => (
          <MarkerF
            key={poi.key}
            onClick={() => {
              setSelectedPoi({
                poi: poi,
                type: "favori",
              });
            }}
            position={{
              lat: poi.lat,
              lng: poi.lng,
            }}
            icon={{
              url: coeur,
              fillColor: "#EB00FF",
              scale: 5,
            }}
          />
        ))}

        {showFormulaire && (
          <MarkerF
            icon={{
              url: coeur,
              fillColor: "#EB00FF",
              scale: 5,
            }}
          />
        )}

        {selectedPoi && (
          <InfoWindow
            onCloseClick={() => {
              setSelectedPoi(null);
            }}
            position={{
              lat: selectedPoi.poi.lat,
              lng: selectedPoi.poi.lng,
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
