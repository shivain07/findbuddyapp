import React, { useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Type Definitions for Photon API Response
interface PhotonFeature {
  properties: {
    name: string;
    city?: string;
    country?: string;
  };
  geometry: {
    coordinates: [number, number]; // [longitude, latitude]
  };
}

interface SelectedPlace {
  name: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

const PhotonSearchWithMap: React.FC = () => {
  const [query, setQuery] = useState<string>(''); // User's search query
  const [results, setResults] = useState<PhotonFeature[]>([]); // Search results
  const [selectedPlace, setSelectedPlace] = useState<SelectedPlace | null>(null); // Selected place with coordinates

  // Function to handle search
  const handleSearch = async () => {
    try {
      const response = await axios.get('https://photon.komoot.io/api/', {
        params: {
          q: query, // Search query
          lang: 'en', // Optional: Response language
        },
      });
      setResults(response.data.features); // Photon returns results in `features` array
    } catch (error) {
      console.error('Error fetching data from Photon:', error);
    }
  };

  // Function to handle place selection
  const handlePlaceSelect = (place: PhotonFeature) => {
    setSelectedPlace({
      name: place.properties.name,
      coordinates: {
        lat: place.geometry.coordinates[1], // Latitude
        lng: place.geometry.coordinates[0], // Longitude
      },
    });
    setResults([]); // Clear search results after selection
    setQuery(place.properties.name); // Set selected place name as the input
  };

  return (
    <div>
      <h1>Search for a Place</h1>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Type a place name..."
      />
      <button onClick={handleSearch}>Search</button>

      {/* Display search results */}
      {results.length > 0 && (
        <ul>
          {results.map((result, index) => (
            <li
              key={index}
              onClick={() => handlePlaceSelect(result)}
              style={{ cursor: 'pointer', margin: '5px 0' }}
            >
              {result.properties.name}, {result.properties.city || result.properties.country}
            </li>
          ))}
        </ul>
      )}

      {/* Display selected place and map */}
      {selectedPlace && (
        <div>
          <h2>Selected Place:</h2>
          <p>
            <strong>Name:</strong> {selectedPlace.name}
          </p>
          <p>
            <strong>Coordinates:</strong> Latitude: {selectedPlace.coordinates.lat}, Longitude: {selectedPlace.coordinates.lng}
          </p>

          {/* Map Display */}
          <MapContainer
            center={selectedPlace.coordinates} // Center the map on the selected place
            zoom={13}
            style={{ height: '400px', width: '100%' }}
          >
            {/* Tile layer for map */}
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            {/* Marker for the selected place */}
            <Marker position={selectedPlace.coordinates}>
              <Popup>
                {selectedPlace.name} <br />
                Latitude: {selectedPlace.coordinates.lat} <br />
                Longitude: {selectedPlace.coordinates.lng}
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      )}
    </div>
  );
};

export default PhotonSearchWithMap;
