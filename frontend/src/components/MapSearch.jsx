"use client"

import { useState, useRef, useEffect } from "react"

const MapSearch = ({ onLocationSelect, placeholder = "Search for a location..." }) => {
  const [query, setQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const autocompleteRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    const initializeAutocomplete = () => {
      try {
        if (window.google && window.google.maps && window.google.maps.places && inputRef.current) {
          autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
            types: ["address"],
            componentRestrictions: { country: "us" },
          })

          autocompleteRef.current.addListener("place_changed", () => {
            try {
              const place = autocompleteRef.current.getPlace()
              if (place.geometry) {
                const location = {
                  address: place.formatted_address,
                  lat: place.geometry.location.lat(),
                  lng: place.geometry.location.lng(),
                }
                onLocationSelect(location)
                setQuery(place.formatted_address)
                setError(null)
              }
            } catch (err) {
              console.error("Error getting place details:", err)
              setError("Failed to get location details")
            }
          })
        }
      } catch (err) {
        console.error("Error initializing autocomplete:", err)
        setError("Failed to initialize location search")
      }
    }

    // Check if Google Maps is already loaded
    if (window.google && window.google.maps && window.google.maps.places) {
      initializeAutocomplete()
    } else {
      // Wait for Google Maps to load
      const checkGoogleMaps = setInterval(() => {
        if (window.google && window.google.maps && window.google.maps.places) {
          clearInterval(checkGoogleMaps)
          initializeAutocomplete()
        }
      }, 100)

      // Clear interval after 10 seconds to prevent infinite checking
      setTimeout(() => {
        clearInterval(checkGoogleMaps)
        if (!window.google || !window.google.maps || !window.google.maps.places) {
          setError("Google Maps failed to load")
        }
      }, 10000)
    }
  }, [onLocationSelect])

  const handleInputChange = (e) => {
    setQuery(e.target.value)
    if (error) setError(null)
  }

  const handleManualSubmit = () => {
    if (query.trim() && onLocationSelect) {
      // For manual input, we'll just pass the address without coordinates
      onLocationSelect({
        address: query.trim(),
        lat: null,
        lng: null,
      })
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleManualSubmit()
    }
  }

  return (
    <div className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>
        </div>
        {isLoading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center space-x-2 text-yellow-800">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
            <span className="text-sm">{error}</span>
          </div>
          <p className="text-yellow-700 text-xs mt-1">You can still type the address manually and press Enter.</p>
        </div>
      )}
    </div>
  )
}

export default MapSearch
