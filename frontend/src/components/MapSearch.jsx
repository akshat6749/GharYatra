import { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";

// Global variable to track if Google Maps is loaded/loading
let googleMapsPromise = null;

/**
 * A single‑input Places Autocomplete field.
 */
export default function MapSearch({
  onLocationSelect,
  placeholder = "Search for a location…",
}) {
  const [query, setQuery] = useState("");
  const [isLoading, setLoad] = useState(true);
  const [error, setError] = useState(null);

  const inputRef = useRef(null);
  const autocomplete = useRef(null);

  /*  Load the Maps JS API + Places library once  */
  useEffect(() => {
    const initializeGoogleMaps = async () => {
      try {
        // Check if Google Maps is already loaded
        if (window.google && window.google.maps && window.google.maps.places) {
          // Google Maps is already loaded, initialize autocomplete directly
          initializeAutocomplete();
          setLoad(false);
          return;
        }

        // If already loading, wait for the existing promise
        if (googleMapsPromise) {
          await googleMapsPromise;
          initializeAutocomplete();
          setLoad(false);
          return;
        }

        // Create new loader only if not already loaded/loading
        const loader = new Loader({
          apiKey:
            import.meta.env.VITE_GOOGLE_MAPS_API_KEY ||
            process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
          version: "weekly",
          libraries: ["places"],
          region: "IN",
        });

        // Store the loading promise globally
        googleMapsPromise = loader.load();
        
        await googleMapsPromise;
        initializeAutocomplete();
      } catch (err) {
        console.error("Google Maps loading error:", err);
        setError(
          "Google Maps SDK failed to load. Check your API key, billing and CSP."
        );
      } finally {
        setLoad(false);
      }
    };

    const initializeAutocomplete = () => {
      if (!inputRef.current || !window.google?.maps?.places) return;

      // Clean up existing autocomplete if it exists
      if (autocomplete.current) {
        window.google.maps.event.clearInstanceListeners(autocomplete.current);
      }

      autocomplete.current = new window.google.maps.places.Autocomplete(
        inputRef.current,
        {
          types: ["address"],
          fields: ["formatted_address", "geometry"],
          componentRestrictions: { country: "in" },
        }
      );

      autocomplete.current.addListener("place_changed", () => {
        const place = autocomplete.current.getPlace();
        if (!place.geometry) {
          setError("That address has no geometry data.");
          return;
        }

        onLocationSelect({
          address: place.formatted_address,
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        });
        setQuery(place.formatted_address);
        setError(null);
      });
    };

    initializeGoogleMaps();

    // Cleanup function
    return () => {
      if (autocomplete.current) {
        window.google?.maps?.event?.clearInstanceListeners(autocomplete.current);
      }
    };
  }, [onLocationSelect]);

  /*  Manual submit when user presses ⏎ without picking a suggestion  */
  const submitManual = () => {
    if (!query.trim()) return;
    onLocationSelect({ address: query.trim(), lat: null, lng: null });
    setError(null);
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          if (error) setError(null);
        }}
        onKeyDown={(e) => e.key === "Enter" && submitManual()}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400 bg-gray-50 focus:bg-white"
        disabled={isLoading}
      />

      {/* Search icon */}
      <div className="absolute left-3 top-1/2 -translate-y-1/2">
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {isLoading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full" />
        </div>
      )}

      {error && (
        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm">
          <div className="flex items-start">
            <svg className="w-4 h-4 mr-2 mt-0.5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <div className="font-medium">{error}</div>
              <div className="text-xs mt-1">
                You can still type an address and press Enter.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}