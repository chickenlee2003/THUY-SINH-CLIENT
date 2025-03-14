"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

interface MapProps {
  onLocationSelect: (lat: number, lng: number) => void
}

const Map: React.FC<MapProps> = ({ onLocationSelect }) => {
  const mapRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map("map").setView([10.762622, 106.660172], 13)

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(mapRef.current)

      mapRef.current.on("click", (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng
        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng])
        } else {
          markerRef.current = L.marker([lat, lng]).addTo(mapRef.current!)
        }
        onLocationSelect(lat, lng)
      })
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [onLocationSelect])

  return <div id="map" style={{ height: "400px", width: "100%" }} />
}

export default Map

