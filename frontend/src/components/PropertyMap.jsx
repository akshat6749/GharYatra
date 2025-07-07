"use client"

import GoogleMap from "./GoogleMap"

const PropertyMap = ({
  properties = [],
  selectedProperty = null,
  onPropertySelect,
  height = "500px",
  showControls = true,
}) => {
  const handleMarkerClick = (property) => {
    if (onPropertySelect) {
      onPropertySelect(property)
    }
  }

  const getCoordinatesForLocation = (location) => {
    const locationMap = {
      "Mumbai, Maharashtra": { lat: 19.076, lng: 72.8777 },
      "Delhi, Delhi": { lat: 28.7041, lng: 77.1025 },
      "Bangalore, Karnataka": { lat: 12.9716, lng: 77.5946 },
      "Hyderabad, Telangana": { lat: 17.385, lng: 78.4867 },
      "Chennai, Tamil Nadu": { lat: 13.0827, lng: 80.2707 },
      "Kolkata, West Bengal": { lat: 22.5726, lng: 88.3639 },
      "Pune, Maharashtra": { lat: 18.5204, lng: 73.8567 },
      "Ahmedabad, Gujarat": { lat: 23.0225, lng: 72.5714 },
      "Jaipur, Rajasthan": { lat: 26.9124, lng: 75.7873 },
      "Surat, Gujarat": { lat: 21.1702, lng: 72.8311 },
      "Lucknow, Uttar Pradesh": { lat: 26.8467, lng: 80.9462 },
      "Kanpur, Uttar Pradesh": { lat: 26.4499, lng: 80.3319 },
      "Nagpur, Maharashtra": { lat: 21.1458, lng: 79.0882 },
      "Indore, Madhya Pradesh": { lat: 22.7196, lng: 75.8577 },
      "Thane, Maharashtra": { lat: 19.2183, lng: 72.9781 },
      "Bhopal, Madhya Pradesh": { lat: 23.2599, lng: 77.4126 },
      "Visakhapatnam, Andhra Pradesh": { lat: 17.6868, lng: 83.2185 },
      "Pimpri-Chinchwad, Maharashtra": { lat: 18.6298, lng: 73.7997 },
      "Patna, Bihar": { lat: 25.5941, lng: 85.1376 },
      "Vadodara, Gujarat": { lat: 22.3072, lng: 73.1812 },
      "Ghaziabad, Uttar Pradesh": { lat: 28.6692, lng: 77.4538 },
      "Ludhiana, Punjab": { lat: 30.901, lng: 75.8573 },
      "Agra, Uttar Pradesh": { lat: 27.1767, lng: 78.0081 },
      "Nashik, Maharashtra": { lat: 19.9975, lng: 73.7898 },
      "Faridabad, Haryana": { lat: 28.4089, lng: 77.3178 },
      "Meerut, Uttar Pradesh": { lat: 28.9845, lng: 77.7064 },
      "Rajkot, Gujarat": { lat: 22.3039, lng: 70.8022 },
      "Kalyan-Dombivli, Maharashtra": { lat: 19.2403, lng: 73.1305 },
      "Vasai-Virar, Maharashtra": { lat: 19.4912, lng: 72.8054 },
      "Varanasi, Uttar Pradesh": { lat: 25.3176, lng: 82.9739 },
      "Srinagar, Jammu and Kashmir": { lat: 34.0837, lng: 74.7973 },
      "Aurangabad, Maharashtra": { lat: 19.8762, lng: 75.3433 },
      "Dhanbad, Jharkhand": { lat: 23.7957, lng: 86.4304 },
      "Amritsar, Punjab": { lat: 31.634, lng: 74.8723 },
      "Navi Mumbai, Maharashtra": { lat: 19.033, lng: 73.0297 },
      "Allahabad, Uttar Pradesh": { lat: 25.4358, lng: 81.8463 },
      "Ranchi, Jharkhand": { lat: 23.3441, lng: 85.3096 },
      "Howrah, West Bengal": { lat: 22.5958, lng: 88.2636 },
      "Coimbatore, Tamil Nadu": { lat: 11.0168, lng: 76.9558 },
      "Jabalpur, Madhya Pradesh": { lat: 23.1815, lng: 79.9864 },
      "Gwalior, Madhya Pradesh": { lat: 26.2183, lng: 78.1828 },
    }

    if (locationMap[location]) {
      return locationMap[location]
    }

    for (const [key, coords] of Object.entries(locationMap)) {
      const cityName = key.split(",")[0].trim()
      const inputCity = location.split(",")[0].trim()
      if (
        cityName.toLowerCase().includes(inputCity.toLowerCase()) ||
        inputCity.toLowerCase().includes(cityName.toLowerCase())
      ) {
        return {
          lat: coords.lat + (Math.random() - 0.5) * 0.02,
          lng: coords.lng + (Math.random() - 0.5) * 0.02,
        }
      }
    }

    return { lat: 19.076, lng: 72.8777 }
  }

  // Calculate center based on properties
  const getMapCenter = () => {
    if (properties.length === 0) {
      return { lat: 19.076, lng: 72.8777 } // Default to Mumbai
    }

    if (properties.length === 1) {
      // For single property, use its location
      const location = properties[0].location
      return getCoordinatesForLocation(location)
    }

    // For multiple properties, calculate center
    const coords = properties.map((p) => getCoordinatesForLocation(p.location))
    const avgLat = coords.reduce((sum, coord) => sum + coord.lat, 0) / coords.length
    const avgLng = coords.reduce((sum, coord) => sum + coord.lng, 0) / coords.length

    return { lat: avgLat, lng: avgLng }
  }

  return (
    <div className="relative">
      <GoogleMap
        properties={properties}
        center={getMapCenter()}
        zoom={properties.length === 1 ? 14 : 10}
        onMarkerClick={handleMarkerClick}
        height={height}
        showInfoWindows={true}
      />

      {showControls && properties.length > 0 && (
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3">
          <div className="text-sm text-gray-600">
            <div className="font-semibold">{properties.length} Properties</div>
            <div>{properties.filter((p) => !p.is_sold).length} Available</div>
            <div>{properties.filter((p) => p.is_sold).length} Sold</div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PropertyMap
