import { useState } from "react";

function SearchModal({ open, onClose, onSearch }) {

  const [filters, setFilters] = useState({
    location: "",
    min_price: "",
    max_price: "",
    bedrooms: "",
    property_type: ""
  });

  if (!open) return null;

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(filters);
    onClose();
  };

  return (
    <div
      className="
        fixed
        inset-0
        bg-black/50
        flex
        items-center
        justify-center
        z-50
        p-4
      "
    >
      <div
        className="
          bg-white
          rounded-lg
          p-5
          w-full
          max-w-md
        "
      >
        <h2 className="text-lg font-bold mb-4">
          Search Properties
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="location"
            placeholder="Location"
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="grid grid-cols-2 gap-3">
            <input
              name="min_price"
              placeholder="Min Price"
              onChange={handleChange}
              className="border border-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              name="max_price"
              placeholder="Max Price"
              onChange={handleChange}
              className="border border-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <input
            name="bedrooms"
            placeholder="Bedrooms"
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            name="property_type"
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Property Type</option>
            <option value="Apartment">Apartment</option>
            <option value="House">House</option>
            <option value="Studio">Studio</option>
          </select>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="
                flex-1
                bg-blue-600
                hover:bg-blue-700
                text-white
                py-2
                rounded-md
                text-sm
                font-medium
                transition
              "
            >
              Search
            </button>

            <button
              type="button"
              onClick={onClose}
              className="
                flex-1
                bg-gray-200
                hover:bg-gray-300
                text-gray-700
                py-2
                rounded-md
                text-sm
                font-medium
                transition
              "
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SearchModal;