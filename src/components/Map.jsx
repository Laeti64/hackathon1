import React, { useEffect, useMemo, useState, useRef } from "react";
import {
  GoogleMap,
  useLoadScript,
  MarkerF,
  Marker,
  Autocomplete,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { bordeaux } from "../utils/axiosTool";
import icon from "../assets/react.svg";

function Map() {
  const [map, setMap] = useState(/** @type google.maps.Map */ (null));
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_TOKEN,
    libraries: ["places"],
  });
  const [location, setLocation] = useState({ origin: "", destination: "" });
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [data, setData] = useState([]);
  const center = useMemo(() => ({ lat: 44.84, lng: -0.58 }), []);
  /** @type React.MutableRefObject<HTMLInputElement> */
  const originRef = useRef();
  /** @type React.MutableRefObject<HTMLInputElement> */
  const destinationRef = useRef();

  useEffect(() => {
    bordeaux.getEvents().then((result) => setData(result.records));
  }, []);

  if (!isLoaded || !data) return <div>Loading...</div>;

  const handleChange = (e) => {
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

  return (
    <div className="flex flex-col">
      <GoogleMap
        zoom={12}
        center={center}
        mapContainerStyle={{
          height: "70vh",
          width: "100%",
        }}
        onLoad={(map) => setMap(map)}>
        <Marker position={center} />
        {data.map((poi) => (
          <MarkerF
            key={map.index}
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
        {directionsResponse && (
          <DirectionsRenderer directions={directionsResponse} />
        )}
      </GoogleMap>
      <div>
        <div className="w-full  h-30 flex flex-col bg-slate-300 rounded-xl p-4">
          <div className="h-15 flex justify-around">
            <Autocomplete className="w-2/5 mx-1">
              <input
                className="h-10 w-full rounded-md"
                type="text"
                name="origin"
                ref={originRef}
                placeholder="origin"
                onChange={(e) => handleChange(e)}
                value={location.origin}
              />
            </Autocomplete>
            <Autocomplete className="w-2/5 mx-1">
              <input
                className="h-10 w-full rounded-md"
                type="text"
                name="destination"
                ref={destinationRef}
                placeholder="destination"
                onChange={(e) => handleChange(e)}
                value={location.destination}
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
  );
}

export default Map;
