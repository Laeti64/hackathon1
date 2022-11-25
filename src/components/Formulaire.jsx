import React, { useEffect, useRef, useState } from "react";

function Formulaire({
  lat,
  lng,
  favourites,
  setFavorites,
  showFormulaire,
  setShowFormulaire,
}) {
  const [showFormulaire2, setShowFormulaire2] = useState(false);
  const favouritesList = JSON.parse(localStorage.getItem("Favourites"));

  console.log(lat, lng);
  const addFavorite = (e) => {
    setFavorites({
      key: input.current.value,
      lat: lat,
      lng: lng,
    });
  };
  console.log(favourites);
  useEffect(() => {
    {
      if (favouritesList) {
        if (favourites.length != 0) {
          favouritesList.push(favourites);
        }
        favouritesList.filter((e) => e != []);
        localStorage.removeItem("Favourites");
        localStorage.setItem("Favourites", JSON.stringify(favouritesList));
      }
      if (!favouritesList) {
        localStorage.setItem("Favourites", JSON.stringify(favourites));
      }
    }
  }, [favourites]);

  const input = useRef();

  return (
    <div className="flex flex-col justify-center align-middle absolute z-50 items-center m-16 bg-gray-50 rounded-3xl shadow-xl w-2/3 border border-black border-x-2">
      <p className="m-5">
        Do you want to add this destination to your favourites?
      </p>
      <p onClick={() => setShowFormulaire2(true)}>Yes</p>
      <p className="mb-5" onClick={() => setShowFormulaire(false)}>
        No
      </p>
      {showFormulaire2 && (
        <form className=" w-full flex flex-col justify-center align-middle  items-center m-5">
          <p>Please name it:</p>
          <div className="mx-5">
            <input
              ref={input}
              onChange={(e) => console.log(e)}
              placeholder="Favourite name"
            />
            <button onClick={addFavorite}>validate</button>
          </div>
        </form>
      )}
    </div>
  );
}

export default Formulaire;
