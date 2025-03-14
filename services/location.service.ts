import apiClient from "./apiClient"
import type { ILocation } from "@/types/backend" // Ensure ILocation is defined in your types

const locationService = {
  createLocation: (location: ILocation) => {
    return apiClient.post("/locations", location)
  },

  getAllLocations: () => {
    return apiClient.get("/locations")
  },

  getLocationById: (id: number) => {
    return apiClient.get(`/locations/${id}`)
  },

  getLocationByUserId: (userId: number) => {
    return apiClient.get(`/locations/user/${userId}`)
  },


  deleteLocation: (id: number) => {
    return apiClient.delete(`/locations/${id}`)
  },
}

export default locationService
