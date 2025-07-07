"use client"

import { useEffect, useRef, useState } from "react"

const GoogleMap = ({
  properties = [],
  center = { lat: 37.7749, lng: -122.4194 },
  zoom = 10,
  onMarkerClick,
  showInfoWindows = true,
  mapStyle = "roadmap",
  height = "400px",
}) => {
  const mapRef = useRef(null)
  const [map, setMap] = useState(null)
  const [markers, setMarkers] = useState([])
  const [infoWindows, setInfoWindows] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState(null)

  // Initialize Google Maps
  useEffect(() => {
    const initMap = () => {
      if (!window.google) {
        setError("Google Maps failed to load")
        return
      }

      try {
        const mapInstance = new window.google.maps.Map(mapRef.current, {
          center,
          zoom,
          mapTypeId: mapStyle,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
          ],
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
          zoomControl: true,
        })

        setMap(mapInstance)
        setIsLoaded(true)
      } catch (err) {
        setError("Failed to initialize map")
        console.error("Map initialization error:", err)
      }
    }

    if (window.google) {
      initMap()
    } else {
      // Load Google Maps script if not already loaded
      const script = document.createElement("script")
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "AIzaSyBvOkBwgGlbUiuS-oKrPGFaiQylyc-Ywl8"}&libraries=places`
      script.async = true
      script.defer = true
      script.onload = initMap
      script.onerror = () => setError("Failed to load Google Maps")
      document.head.appendChild(script)
    }
  }, [center, zoom, mapStyle])

  // Create markers when map and properties are ready
  useEffect(() => {
    if (!map || !properties.length) return

    // Clear existing markers and info windows
    markers.forEach((marker) => marker.setMap(null))
    infoWindows.forEach((infoWindow) => infoWindow.close())

    const newMarkers = []
    const newInfoWindows = []

    properties.forEach((property) => {
      // Get coordinates for the property (demo coordinates based on location)
      const coordinates = getCoordinatesForLocation(property.location)

      if (!coordinates) return

      // Create custom marker icon
      const markerIcon = {
        path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
        fillColor: property.is_sold ? "#ef4444" : "#3b82f6",
        fillOpacity: 1,
        strokeColor: "#ffffff",
        strokeWeight: 2,
        scale: 1.5,
        anchor: new window.google.maps.Point(12, 24),
      }

      // Create marker
      const marker = new window.google.maps.Marker({
        position: coordinates,
        map: map,
        title: property.title,
        icon: markerIcon,
        animation: window.google.maps.Animation.DROP,
      })

      // Create info window content
      const infoWindowContent = `
        <div class="p-4 max-w-sm">
          <div class="flex items-center justify-between mb-2">
            <h3 class="font-bold text-lg text-gray-900">${property.title}</h3>
            <span class="px-2 py-1 rounded-full text-xs font-medium ${
              property.is_sold ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
            }">
              ${property.is_sold ? "SOLD" : "Available"}
            </span>
          </div>
          
          ${
            property.image
              ? `
            <img src="${property.image}" alt="${property.title}" 
                 class="w-full h-32 object-cover rounded-lg mb-3" />
          `
              : ""
          }
          
          <div class="space-y-2">
            <div class="flex items-center text-gray-600">
              <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              <span class="text-sm">${property.location}</span>
            </div>
            
            <div class="text-2xl font-bold text-blue-600">
              $${property.price?.toLocaleString()}
            </div>
            
            <div class="flex justify-between text-sm text-gray-500">
              <span>${property.bedrooms} beds</span>
              <span>${property.bathrooms} baths</span>
              <span>${property.area} sq ft</span>
            </div>
            
            <div class="pt-3">
              <button onclick="window.location.href='/properties/${property.id}'" 
                      class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                View Details
              </button>
            </div>
          </div>
        </div>
      `

      // Create info window
      const infoWindow = new window.google.maps.InfoWindow({
        content: infoWindowContent,
        maxWidth: 300,
      })

      // Add click listener to marker
      marker.addListener("click", () => {
        // Close all other info windows
        newInfoWindows.forEach((iw) => iw.close())

        if (showInfoWindows) {
          infoWindow.open(map, marker)
        }

        if (onMarkerClick) {
          onMarkerClick(property)
        }
      })

      newMarkers.push(marker)
      newInfoWindows.push(infoWindow)
    })

    setMarkers(newMarkers)
    setInfoWindows(newInfoWindows)

    // Fit map bounds to show all markers
    if (newMarkers.length > 0) {
      const bounds = new window.google.maps.LatLngBounds()
      newMarkers.forEach((marker) => bounds.extend(marker.getPosition()))
      map.fitBounds(bounds)

      // Ensure minimum zoom level
      const listener = window.google.maps.event.addListener(map, "idle", () => {
        if (map.getZoom() > 15) map.setZoom(15)
        window.google.maps.event.removeListener(listener)
      })
    }
  }, [map, properties, showInfoWindows, onMarkerClick])

  // Helper function to get coordinates for locations (demo data)
  const getCoordinatesForLocation = (location) => {
    const locationMap = {
      "Delhi": { lat: 28.6139, lng: 77.2090 },
      "Mumbai, MH": { lat: 19.0760, lng: 72.8777 },
      "Bengaluru, KA": { lat: 12.9716, lng: 77.5946 },
      "Hyderabad, TS": { lat: 17.3850, lng: 78.4867 },
      "Chennai, TN": { lat: 13.0827, lng: 80.2707 },
      "Kolkata, WB": { lat: 22.5726, lng: 88.3639 },
      "Pune, MH": { lat: 18.5204, lng: 73.8567 },
      "Ahmedabad, GJ": { lat: 23.0225, lng: 72.5714 },
      "Jaipur, RJ": { lat: 26.9124, lng: 75.7873 },
      "Lucknow, UP": { lat: 26.8467, lng: 80.9462 },
      "Bhopal, MP": { lat: 23.2599, lng: 77.4126 },
    };

    // Try exact match first
    if (locationMap[location]) {
      return locationMap[location]
    }

    // Try partial match
    for (const [key, coords] of Object.entries(locationMap)) {
      if (location.includes(key.split(",")[0]) || key.includes(location.split(",")[0])) {
        // Add small random offset for multiple properties in same city
        return {
          lat: coords.lat + (Math.random() - 0.5) * 0.02,
          lng: coords.lng + (Math.random() - 0.5) * 0.02,
        }
      }
    }

    // Default to San Francisco if no match
    return { lat: 37.7749, lng: -122.4194 }
  }

  if (error) {
    return (
      <div
        className="flex items-center justify-center bg-gray-100 rounded-lg border-2 border-dashed border-gray-300"
        style={{ height }}
      >
        <div className="text-center p-6">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7"
            />
          </svg>
          <p className="text-gray-600 font-medium">Map unavailable</p>
          <p className="text-gray-500 text-sm mt-1">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      <div ref={mapRef} style={{ height, width: "100%" }} className="rounded-lg overflow-hidden shadow-lg" />
      {isLoaded && (
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 text-sm">
          <h4 className="font-semibold mb-2">Legend</h4>
          <div className="space-y-1">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-600 rounded-full mr-2"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
              <span>Sold</span>
            </div>
          </div>
        </div>
      )}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg" style={{ height }}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default GoogleMap
