import React from "react";

interface AddressFormProps {
  values: {
    street_address: string;
    city: string;
    state: string;
    zip: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AddressForm: React.FC<AddressFormProps> = ({ values, onChange }) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Address Form</h2>
      <div className="grid grid-cols-2 gap-6">
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
        <input
          type="text"
          name="state"
          placeholder="State"
          className="input border border-gray-500 p-2 rounded-lg placeholder-gray-500 text-xl"
          value={values.state}
          onChange={onChange}
        />
        <input
          type="text"
          name="zip"
          placeholder="Zip Code"
          className="input border border-gray-500 p-2 rounded-lg placeholder-gray-500 text-xl"
          value={values.zip}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export default AddressForm;
