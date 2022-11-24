import React from "react";

function InfoWindoDetails({ poi }) {
  if (poi.type === "event")
    return (
      <div className="w-20 h-20">
        <h1>{poi.poi.fields.title_fr}</h1>
        <p>{poi.poi.fields.description_fr}</p>
      </div>
    );
  if (poi.type === "station")
    return (
      <div className="w-40 h-20">
        <h1>{poi.poi.fields.title_fr}</h1>
        <p>{poi.poi.fields.services_service}</p>
      </div>
    );
}
export default InfoWindoDetails;
