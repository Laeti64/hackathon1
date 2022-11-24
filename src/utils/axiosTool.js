import axios from "axios";

const apiUri =
  "https://anglet-opendatapaysbasque.opendatasoft.com/api/records/1.0/";

const axiosInstance = axios.create({
  baseURL: apiUri,
  headers: {
    "Content-Type": "application/json",
  },
});

export const anglet = {
  getParking: async () =>
    (await axiosInstance.get("search/?dataset=parking-velos-amenages")).data,
};
