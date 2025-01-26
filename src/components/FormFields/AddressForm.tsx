import React, { useEffect, useState } from "react";
import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

interface AddressFormProps {
  values: {
    street_address: string;
    city: string;
    state: string;
    zip: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

interface State {
  id: number;
  name: string;
  abbreviation: string;
}

const AddressForm: React.FC<AddressFormProps> = ({ values, onChange }) => {
  const [states, setStates] = useState<State[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/states`);
        setStates(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching states:", error);
        setError("Failed to load states. Please try again later.");
        setLoading(false);
      }
    };

    fetchStates();
  }, []);

  const handleZipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    // Allow only numeric input for the ZIP field
    if (/^\d*$/.test(value)) {
      onChange(e);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Address Form</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input
          type="text"
          name="street_address"
          placeholder="Street Address"
          className="input border border-gray-500 p-2 rounded-lg placeholder-gray-500 text-xl"
          value={values.street_address}
          onChange={onChange}
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          className="input border border-gray-500 p-2 rounded-lg placeholder-gray-500 text-xl"
          value={values.city}
          onChange={onChange}
        />
        <select
          name="state"
          className="input border border-gray-500 p-2 rounded-lg placeholder-gray-500 text-xl"
          value={values.state}
          onChange={onChange}
        >
          <option value="">Select a state</option>
          {loading ? (
            <option disabled>Loading...</option>
          ) : error ? (
            <option disabled>{error}</option>
          ) : (
            states.map((state) => (
              <option key={state.id} value={state.abbreviation}>
                {state.name}
              </option>
            ))
          )}
        </select>
        <input
          type="text"
          name="zip"
          placeholder="Zip Code"
          className="input border border-gray-500 p-2 rounded-lg placeholder-gray-500 text-xl"
          value={values.zip}
          onChange={handleZipChange}
        />
      </div>
      {error && (
        <p className="text-red-500 mt-4">
          {error} Refresh the page to try again.
        </p>
      )}
    </div>
  );
};

export default AddressForm;
