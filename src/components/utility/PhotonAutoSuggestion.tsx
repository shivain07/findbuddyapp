import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import axios from "axios";
import Select from "react-select";

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

interface OptionType {
  label: string; // The text shown in the dropdown
  value: PhotonFeature; // The full Photon feature object
}

interface IPhotonAutoSuggestion {
  selectedCoordinates: {
    location: string;
    coordinates: (number | null)[];
  } | null;
  setSelectedCoordinates: Dispatch<
    SetStateAction<{
      location: string;
      coordinates: (number | null)[];
    } | null>
  >;
  placeholder?:string;
  showLabel?:boolean;
}

const PhotonAutoSuggestion = ({
  selectedCoordinates,
  setSelectedCoordinates,
  placeholder="Type a place / location name...",
  showLabel=true
}: IPhotonAutoSuggestion) => {
  const [query, setQuery] = useState<string>(""); // User's search query
  const [options, setOptions] = useState<OptionType[]>([]); // Dropdown options

  // Fetch suggestions from Photon API
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim().length === 0) {
        setOptions([]);
        return;
      }

      try {
        const response = await axios.get("https://photon.komoot.io/api/", {
          params: {
            q: query, // The user's query
            lang: "en",
          },
        });

        // Map API response to React-Select options
        const newOptions = response.data.features.map(
          (feature: PhotonFeature) => ({
            label: `${feature.properties.name}${
              feature.properties.city ? `, ${feature.properties.city}` : ""
            }${
              feature.properties.country
                ? `, ${feature.properties.country}`
                : ""
            }`,
            value: feature,
          })
        );
        setOptions(newOptions);
      } catch (error) {
        console.error("Error fetching suggestions from Photon:", error);
      }
    };

    // Debounce the API call for better performance
    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId); // Cleanup debounce timeout
  }, [query]);

  // Handle suggestion selection
  const handleSelect = (option: OptionType | null) => {
    if (option) {
      const { coordinates } = option.value.geometry;
      setSelectedCoordinates({
        location: option.label,
        coordinates: coordinates,
      });
    } else {
      setSelectedCoordinates(null); // Reset on deselection
    }
  };

  return (
    <div>
      {showLabel&&<label className="block text-sm/6 font-medium text-gray-900 my-1">
        Place / location :
      </label>}
      <Select
        options={options} // Dynamic options
        onInputChange={(value) => setQuery(value)} // Update query on input change
        onChange={handleSelect} // Handle selection
        placeholder={placeholder}
        isClearable
        className="text-gray-700"
      />

      {/* <small className="block text-xs font-light text-grey-300 my-1">
        This field is required
      </small> */}
    </div>
  );
};

export default PhotonAutoSuggestion;
