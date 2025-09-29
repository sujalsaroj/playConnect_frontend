import React from "react";

const Sidebar = ({
  stateCityData,
  selectedState,
  setSelectedState,
  selectedCity,
  setSelectedCity,
  isOpen,
  toggleSidebar,
}) => {
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:static top-0 left-0 h-full w-80 bg-gray-100 border-r p-4 z-50 transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <h2 className="text-xl font-bold mb-4 flex justify-between items-center ">
          🌍 States
          {/* Close button only on mobile */}
          <button
            className="lg:hidden text-red-600 font-bold text-xl"
            onClick={toggleSidebar}
          >
            ✕
          </button>
        </h2>

        <div className="flex flex-col gap-2">
          {Object.keys(stateCityData).map((state) => (
            <div key={state}>
              {/* State Button */}
              <button
                className={`w-full px-4 py-3 mb-2 rounded-lg shadow-md text-left font-medium transition
                  ${
                    selectedState === state
                      ? "bg-blue-600 text-white"
                      : "bg-white hover:bg-gray-200"
                  }`}
                onClick={() =>
                  setSelectedState((prev) => (prev === state ? "" : state))
                }
              >
                {state}
              </button>

              {/* City Buttons */}
              {selectedState === state && (
                <div className="ml-2 flex flex-col gap-2  overflow-y-auto">
                  {stateCityData[state].map((city) => (
                    <button
                      key={city}
                      className={`w-full px-4 py-2 rounded-md shadow-sm text-left transition
                        ${
                          selectedCity === city
                            ? "bg-green-500 text-white"
                            : "bg-gray-50 hover:bg-gray-200"
                        }`}
                      onClick={() => setSelectedCity(city)}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
