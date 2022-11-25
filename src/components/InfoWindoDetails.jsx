import React from 'react';

function InfoWindoDetails({ poi }) {
  if (poi.type === 'event')
    return (
      <div className="w-20 h-20">
        <hi className="text-lg">🎭 🖼️ 🎸</hi>
        <h1 className="font-semibold bg-yellow-200 underline">
          {poi.poi.fields.title_fr}
        </h1>
        <p className="font-medium bg-yellow-200">
          {poi.poi.fields.description_fr}
        </p>
      </div>
    );
  if (poi.type === 'station')
    return (
      <div className="w-40 h-20">
        <h1>{poi.poi.fields.title_fr}</h1>
        <p>{poi.poi.fields.services_service}</p>
      </div>
    );
  if (poi.type === 'favori')
    return (
      <div className="w-40 h-20">
        <h1>{poi.poi.key}</h1>
      </div>
    );

  if (poi.type === 'velo')
    return (
      <div className="w-40 bg-[#e8eaed] h-20">
        <h1 className="text-4xl ">🚲 🚲 🚲</h1>
        <h1 className="font-semibold underline">{poi.poi.fields.nom}</h1>
        <p className="font-medium">{`Nombre de places: ${poi.poi.fields.nbplaces}`}</p>
      </div>
    );
  if (poi.type === 'espace')
    return (
      <div className="w-40 bg-[rgb(151,193,92)] h-20">
        <h1></h1>
        <h1 className="font-semibold underline">
          <span className="text-lg">🌲🌲</span>
          {poi.poi.fields.nom}
        </h1>
        <p className="font-medium">{`Couverture: ${poi.poi.fields.couverture}`}</p>
        <p className="font-medium">{`Type d'arbres: ${poi.poi.fields.nom_francais}`}</p>
      </div>
    );
}
export default InfoWindoDetails;
