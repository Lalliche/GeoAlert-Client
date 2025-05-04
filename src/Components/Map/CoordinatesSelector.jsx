import { useState } from "react";
import { IoChevronForward } from "react-icons/io5";

const CoordinatesSelector = ({ setCoordinates }) => {
  // Accept the callback to send coordinates data
  const [showCoordinates, setShowCoordinates] = useState(false);
  const [coordinateRows, setCoordinateRows] = useState([
    ["", ""],
    ["", ""],
    ["", ""],
  ]);

  const handleInputChange = (rowIndex, index, value) => {
    const updated = [...coordinateRows];
    updated[rowIndex][index] = value;
    setCoordinateRows(updated);
  };

  const handleAddRow = () => {
    setCoordinateRows([...coordinateRows, ["", ""]]);
  };

  const handleRemoveRow = () => {
    if (coordinateRows.length > 3) {
      setCoordinateRows(coordinateRows.slice(0, -1));
    }
  };

  const handleSubmitCoordinates = () => {
    const validCoordinates = coordinateRows.filter(
      (row) => row[0] !== "" && row[1] !== ""
    );

    if (validCoordinates.length < 3) {
      alert("Please enter at least 3 coordinates.");
      return;
    }

    const coordinates = validCoordinates.map((row) => ({
      latitude: parseFloat(row[1]),
      longitude: parseFloat(row[0]),
    }));

    setCoordinates(coordinates); // Send the coordinates to the parent
  };

  return (
    <div className="w-full p-4 center col gap-4">
      <button
        className="text-sm text-txt font-semibold row gap-2 items-center"
        onClick={() => setShowCoordinates(!showCoordinates)}
      >
        Coordinates
        <IoChevronForward
          className={`transition-transform duration-200 ${
            showCoordinates ? "rotate-90" : ""
          }`}
        />
      </button>

      {showCoordinates && (
        <div className="w-full center flex-col gap-3 text-txt font-space-grotesk ">
          <div className="row gap-2 items-center justify-start w-full text-[#7A7A7A]  ">
            <div className="py-[0.825em] px-[1em] rounded-lg center btn-shadow w-full">
              Longitude
            </div>
            <div className="py-[0.825em] px-[1em] rounded-lg center btn-shadow w-full">
              Latitude
            </div>
          </div>

          {coordinateRows.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className="row gap-2 items-center justify-start w-full"
            >
              <input
                type="number"
                placeholder=""
                className="p-[0.825em] rounded-lg center btn-shadow w-full"
                value={row[0]}
                onChange={(e) => handleInputChange(rowIndex, 0, e.target.value)}
              />
              <input
                type="number"
                placeholder=""
                className="p-[0.825em] rounded-lg center btn-shadow w-full"
                value={row[1]}
                onChange={(e) => handleInputChange(rowIndex, 1, e.target.value)}
              />
            </div>
          ))}

          <div className="row gap-2 text-[1.5em] items-center justify-start w-full">
            <button
              onClick={handleAddRow}
              className="py-[0.5em] px-[0.75em] btn-shadow text-black rounded"
            >
              +
            </button>
            <button
              onClick={handleRemoveRow}
              className="py-[0.5em] px-[0.75em] btn-shadow text-black rounded"
            >
              -
            </button>
          </div>

          <button
            className="btn-primary p-[0.625em]"
            onClick={handleSubmitCoordinates} // Submit coordinates on click
          >
            Confirm Coordinates
          </button>
        </div>
      )}
    </div>
  );
};

export default CoordinatesSelector;
