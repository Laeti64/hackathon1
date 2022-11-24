import axios from "axios";

const apiUri = "https://opendata.bordeaux-metropole.fr/api/records/1.0/";

const axiosInstance = axios.create({
  baseURL: apiUri,
  headers: {
    "Content-Type": "application/json",
  },
});

export const bordeaux = {
  getEvents: async () =>
    (
      await axiosInstance.get(
        "search/?dataset=met_agenda&q=&facet=location_city&facet=originagenda_title&facet=keywords_fr&facet=firstdate_begin&facet=lastdate_end&facet=accessibility_label_fr&refine.firstdate_begin=2022%2F12"
      )
    ).data,
};
