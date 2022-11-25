import React, { useEffect, useMemo, useState, useRef } from "react";

import {
  GoogleMap,
  useLoadScript,
  MarkerF,
  Autocomplete,
  DirectionsRenderer,
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
  const [map, setMap] = useState(/** @type google.maps.Map */ (null));
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_TOKEN,
    libraries: ["places"],
  });

  const poiTypes = [
    { label: "Events", value: "events" },
    { label: "Stations", value: "stations" },
    { label: "Velos", value: "velos" },
    { label: "Espaces verts", value: "espaces" },
  ];

  const center = useMemo(() => ({ lat: 44.837789, lng: -0.57918 }), []);

  const [location, setLocation] = useState({ origin: "", destination: "" });
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");

  const [searchResult, setSearchResult] = useState("");
  const autocompleteRef = useRef();
  /** @type React.MutableRefObject<HTMLInputElement> */
  const originRef = useRef();
  /** @type React.MutableRefObject<HTMLInputElement> */
  const destinationRef = useRef();
  const [events, setEvents] = useState([]);
  const [velos, setVelos] = useState([]);
  const [espaces, setEspaces] = useState([]);
  const [stations, setStations] = useState([]);
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

  const handleChangeInput = (e) => {
    console.log(e.target.value);
    setLocation({
      ...location,
      [e.target.name]: e.target.value,
    });
  };

  const calculateRoute = async () => {
    if (originRef.current.value === "" || destinationRef.current.value === "") {
      return;
    }
    const directionsService = new google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: originRef.current.value,
      destination: destinationRef.current.value,
      travelMode: google.maps.TravelMode.DRIVING,
    });
    setDirectionsResponse(results);
    setDistance(results.routes[0].legs[0].distance.text);
    setDuration(results.routes[0].legs[0].duration.value);
  };

  function clearRoute() {
    setDirectionsResponse(null);
    setDistance("");
    setDuration("");
    originRef.current.value = "";
    destinationRef.current.value = "";
    window.location.reload(false);
  }

  function onLoad(autocomplete) {
    console.log(autocomplete);
    setSearchResult(autocomplete);
  }
  function onDestinationChanged() {
    if (searchResult != null) {
      //variable to store the result
      const place = searchResult.getPlace();
      //variable to store the name from place details result
      const name = place.name;
      //variable to store the status from place details result
      const status = place.business_status;
      //variable to store the formatted address from place details result
      const formattedAddress = place.formatted_address;
      console.log(place);
      //console log all results
      console.log(`Name: ${name}`);
      console.log(`Business Status: ${status}`);
      console.log(`Formatted Address: ${formattedAddress}`);
      setLocation((state) => ({
        ...state,
        destination: name,
      }));
    } else {
      alert("Please enter text");
    }
  }

  function onOriginChanged() {
    if (searchResult != null) {
      //variable to store the result
      const place = searchResult.getPlace();
      //variable to store the name from place details result
      const name = place.name;
      //variable to store the status from place details result
      const status = place.business_status;
      //variable to store the formatted address from place details result
      const formattedAddress = place.formatted_address;
      console.log(place);
      //console log all results
      console.log(`Name: ${name}`);
      console.log(`Business Status: ${status}`);
      console.log(`Formatted Address: ${formattedAddress}`);
      setLocation((state) => ({
        ...state,
        origin: name,
      }));
    } else {
      alert("Please enter text");
    }
  }

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

      <div className="flex flex-col">
        <GoogleMap
          zoom={12}
          center={center}
          onLoad={(map) => setMap(map)}
          options={{ styles: mapStyles }}
          mapContainerStyle={{
            height: "70vh",
            width: "100%",
          }}>
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
              }}>
              <InfoWindoDetails poi={selectedPoi} />
            </InfoWindow>
          )}
          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )}
        </GoogleMap>
        <div>
          <div className="w-full  h-30 flex flex-col bg-slate-300 rounded-xl p-4">
            <div className="h-15 flex justify-around">
              <Autocomplete
                onPlaceChanged={onOriginChanged}
                onLoad={onLoad}
                className="w-2/5 mx-1">
                <input
                  className="h-10 w-full rounded-md"
                  type="text"
                  name="origin"
                  ref={originRef}
                  placeholder="origin"
                />
              </Autocomplete>
              <Autocomplete className="w-2/5 mx-1">
                <input
                  className="h-10 w-full rounded-md"
                  type="text"
                  name="destination"
                  ref={destinationRef}
                  placeholder="destination"
                  onPlaceChanged={onDestinationChanged}
                />
              </Autocomplete>
              <button
                className="w-10 h-10 mx-1 bg-pink-500 rounded-2xl text"
                type="submit"
                onClick={() => calculateRoute()}>
                GO
              </button>
              <button
                className="w-10 h-10 mx-1 bg-pink-500 rounded-2xl text"
                type="submit"
                onClick={() => clearRoute()}>
                ✖️
              </button>
            </div>
          </div>
        </div>
        <div className="h-15 py-3 flex justify-around align-middle w-full bg-slate-300 rounded-xl p-4">
          <p>Distance : {distance}</p>
          <p>Duration : {duration && Math.round(duration / 60) + "min"}</p>
          <button
            className="pl-3 w-10 h-10 bg-grey-200 rounded-2xl text"
            type=""
            onClick={() => {
              map.panTo(center);
              map.setZoom(12);
            }}>
            🌐
          </button>
        </div>
      </div>
    </>
  );
}

export default Map;
