import React, { useEffect, useMemo, useState, useRef } from 'react';

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
import coeur from "../assets/coeur.png";
import bike from "../assets/bike.png";
import espace from "../assets/espace.png";
import trot from "../assets/trot.png";
import mapStyles from "./mapStyles";
import InfoWindoDetails from "./InfoWindoDetails";
import Formulaire from "./Formulaire";

function Map() {
  const [map, setMap] = useState(/** @type google.maps.Map */ (null));
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_TOKEN,
    libraries: ['places'],
  });

  const poiTypes = [
    { label: "Events", value: "events" },
    { label: "Stations", value: "stations" },
    { label: "Velos", value: "velos" },
    { label: "Espaces verts", value: "espaces" },
    { label: "Trottinettes", value: "trots" },
  ];

  const center = useMemo(() => ({ lat: 44.837789, lng: -0.57918 }), []);

  const [location, setLocation] = useState({ origin: '', destination: '' });
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');

  const [searchResult, setSearchResult] = useState('');
  const autocompleteRef = useRef();
  /** @type React.MutableRefObject<HTMLInputElement> */
  const originRef = useRef();
  /** @type React.MutableRefObject<HTMLInputElement> */
  const destinationRef = useRef();
  const [events, setEvents] = useState([]);
  const [velos, setVelos] = useState([]);
  const [espaces, setEspaces] = useState([]);
  const [stations, setStations] = useState([]);
  const [trots, setTrots] = useState([]);
  const [selectedPoi, setSelectedPoi] = useState(null);

  const [theme, setTheme] = useState(false);

  const styleRef = useRef();

  const [position, setPosition] = useState({
    latit: 0,
    longit: 0,
  });
  const [showFormulaire, setShowFormulaire] = useState(false);
  const [favourites, setFavorites] = useState([]);
  const favouritesList = JSON.parse(localStorage.getItem('Favourites'));


  const [poiDisplayed, setPoiDisplayed] = useState({
    events: false,
    stations: false,
    velos: false,
    espaces: false,
    trots: false,
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
    getJSON("../data/trot.json").then((result) =>
      setTrots(result[0].data.stations)
    );
  }, []);

  if (!isLoaded || !events || !stations || !velos || !trots)
    return <div>Loading...</div>;

  const handleChangeInput = (e) => {
    console.log(e.target.value);
    setLocation({
      ...location,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangeTheme = (e) => {
    setTheme(!theme);
  };

  const calculateRoute = async () => {
    if (originRef.current.value === '' || destinationRef.current.value === '') {
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
    setDistance('');
    setDuration('');
    originRef.current.value = '';
    destinationRef.current.value = '';
    () => calculateRoute();
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
      setLocation((state) => ({
        ...state,
        destination: name,
      }));
    } else {
      alert('Please enter text');
    }
  }

  function onOriginChanged() {
    if (searchResult != null) {
      //variable to store the result
      const place = searchResult.getPlace();
      //variable to store the name from place details result
      const name = place.name;
      setLocation((state) => ({
        ...state,
        origin: name,
      }));
    } else {
      alert('Please enter text');
    }
  }

  const addMarker = (position) => {
    setPosition({
      latit: parseFloat(position.latLng.lat()),
      longit: parseFloat(position.latLng.lng()),
    });
    setShowFormulaire(true);
  };
  console.log(favouritesList, selectedPoi);
  return (
    <>
      <div className="p-4">
        {poiTypes.map((type, index) => (
          <label className="mr-3" key={index}>
            {type.label}:
            <input
              className="ml-1"
              value={type.value}
              type="checkbox"
              defaultChecked={false}
              onChange={handleChange}
            />
          </label>
        ))}
      </div>

      <div className="flex flex-col ">
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
          onClick={addMarker}
          zoom={12}
          center={center}
          onLoad={(map) => setMap(map)}
          options={{ styles: theme ? mapStyles[0] : mapStyles[1] }}
          mapContainerStyle={{
            height: "70vh",
            width: "100%",
          }}
        >
          {poiDisplayed.events &&
            events.map((poi) => (
              <MarkerF
                key={poi.recordid}
                onClick={() => {
                  setSelectedPoi({
                    poi: poi,
                    type: 'event',
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
                  fillColor: '#EB00FF',
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
                    type: 'station',
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
                  fillColor: '#EB00FF',
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
                    type: 'velo',
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
                  fillColor: '#EB00FF',
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
                    type: 'espace',
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
                  fillColor: '#EB00FF',
                  scale: 5,
                }}
              />
            ))}
          {favouritesList &&
            favouritesList.map((poi) => (
              <MarkerF
                key={poi.key}
                onClick={() => {
                  setSelectedPoi({
                    poi: poi,
                    type: 'favori',
                    lat: poi.lat,
                    lng: poi.lng,
                  });
                }}
                position={{
                  lat: poi.lat,
                  lng: poi.lng,
                }}
                icon={{
                  url: coeur,
                  fillColor: '#EB00FF',
                  scale: 5,
                }}
              />
            ))}

          {showFormulaire && (
            <MarkerF
              key={position.latit}
              position={{
                lat: position.latit,
                lng: position.longit,
              }}
              icon={{
                url: coeur,
                fillColor: '#EB00FF',
                scale: 5,
              }}
            />
          )}

          {poiDisplayed.trots &&
            trots.map((poi) => (
              <MarkerF
                key={poi.station_id}
                onClick={() => {
                  setSelectedPoi({
                    poi: poi,
                    type: "trot",
                    lat: poi.lat,
                    lng: poi.lon,
                  });
                }}
                position={{
                  lat: poi.lat,
                  lng: poi.lon,
                }}
                icon={{
                  url: trot,
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

          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )}
        </GoogleMap>
        <div>
          <div className="w-full  h-30 flex flex-col  p-4">
            <div className="h-15 flex justify-around">
              <Autocomplete
                onPlaceChanged={onOriginChanged}
                onLoad={onLoad}
                className="w-2/5 mx-1"
              >
                <input
                  className="h-10 w-full pl-2 rounded-md"
                  type="text"
                  name="origin"
                  ref={originRef}
                  placeholder="origin"
                />
              </Autocomplete>
              <Autocomplete className="w-2/5 mx-1">
                <input
                  className="h-10 w-full pl-2 rounded-md"
                  type="text"
                  name="destination"
                  ref={destinationRef}
                  placeholder="destination"
                  onPlaceChanged={onDestinationChanged}
                />
              </Autocomplete>
              <button
                className="w-10 h-10 mx-1 bg-green-500 rounded-2xl text"
                type="submit"
                onClick={() => calculateRoute()}
              >
                GO
              </button>
              <button
                className="w-10 h-10 mx-1 bg-red-500 rounded-2xl text"
                type="submit"
                onClick={() => clearRoute()}
              >
                ✖️
              </button>
            </div>
          </div>
        </div>
        <div className="h-15 py-3 flex justify-around align-middle w-full   p-4">
          <p>Distance : {distance}</p>
          <p>Duration : {duration && Math.round(duration / 60) + 'min'}</p>
          <button
            className="pl-3 w-10 h-10 bg-grey-200 rounded-2xl text"
            type=""
            onClick={() => {
              map.panTo(center);
              map.setZoom(12);
            }}
          >
            🌐
          </button>
        </div>
        <div className="h-15 py-3 flex justify-around align-middle bg-slate-300 rounded-xl p-4">
          <input
            type="checkbox"
            defaultChecked={false}
            onChange={handleChangeTheme}
          />
          Autre thème
        </div>
      </div>
    </>
  );
}

export default Map;
