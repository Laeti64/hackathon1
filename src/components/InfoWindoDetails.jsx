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
  if (poi.type === "favori")
    return (
      <div className="w-40 h-20">
        <h1>{poi.poi.key}</h1>
  if (poi.type === "velo")
    return (
      <div className="w-40 h-20">
        <h1>{poi.poi.fields.nom}</h1>
        <p>{`Nombre de places: ${poi.poi.fields.nbplaces}`}</p>
      </div>
    );
  if (poi.type === "espace")
    return (
      <div className="w-40 h-20">
        <h1>{poi.poi.fields.nom}</h1>
        <p>{`Couverture: ${poi.poi.fields.couverture}`}</p>
        <p>{`Type d'arbres: ${poi.poi.fields.nom_francais}`}</p>
      </div>
    );
}
export default InfoWindoDetails;
