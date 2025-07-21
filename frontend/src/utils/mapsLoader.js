// utils/mapsLoader.js
import { Loader } from "@googlemaps/js-api-loader"

const apiKey =
  import.meta.env.VITE_GOOGLE_MAPS_API_KEY || process.env.REACT_APP_GOOGLE_MAPS_API_KEY

const loader = new Loader({
  apiKey,
  version: "weekly",
  libraries: ["places"],
})

export const mapsReady = loader.load()
