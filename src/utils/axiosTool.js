import axios from "axios";

const axiosInstance = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

export const poi = {
  getEvents: async () =>
    (
      await axiosInstance.get(
        "https://opendata.bordeaux-metropole.fr/api/records/1.0/search/?dataset=met_agenda&q=&facet=location_city&facet=originagenda_title&facet=keywords_fr&facet=firstdate_begin&facet=lastdate_end&facet=accessibility_label_fr&refine.firstdate_begin=2022%2F12"
      )
    ).data,
  getStations: async () =>
    (
      await axiosInstance.get(
        "https://www.data.economie.gouv.fr/api/records/1.0/search/?dataset=prix-carburants-fichier-quotidien-test-ods&q=&facet=prix_maj&facet=prix_nom&facet=com_arm_name&facet=epci_name&facet=dep_name&facet=reg_name&facet=services_service&facet=rupture_nom&facet=rupture_debut&facet=horaires_automate_24_24&refine.prix_maj=2022&refine.com_arm_name=Bordeaux"
      )
    ).data,
  getTrotinettes: async () =>
    (
      await axiosInstance.get(
        "https://www.data.gouv.fr/fr/datasets/trottinettes-bird-bordeaux"
      )
    ).data,
};
