import apiClient from "./apiClient"
import type { IAddress } from "@/types/backend"

const addressService = {
  getAddressesByUserId: (userId: number) => {
    return apiClient.get(`/locations/user/${userId}`)
  },

  addAddress: (address: IAddress) => {
    return apiClient.post("/locations", address)
  },

  // updateAddress: (addressId: number, address: IAddress) => {
  //   return apiClient.put(`/locations/${addressId}`, address)
  // },

  deleteAddress: (addressId: number) => {
    return apiClient.delete(`/locations/${addressId}`)
  },
}

export default addressService

