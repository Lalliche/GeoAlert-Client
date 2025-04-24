import { useState } from "react";
import { IoChevronForward } from "react-icons/io5";
import { RiRectangleLine } from "react-icons/ri";
import { FaDrawPolygon } from "react-icons/fa";

const DrawButtons = ({ activeTool, enableTool }) => {
  const [showTools, setShowTools] = useState(false);

  const handleToggleTool = (tool) => {
    if (activeTool === tool) {
      console.log("Disabling tool");
      enableTool(null);
    } else {
      console.log("Enabling tool:", tool);
      enableTool(tool);
    }
  };

  return (
    <div className="w-full p-4 center col gap-4">
      <button
        className="text-sm text-txt font-semibold row gap-2 items-center"
        onClick={() => setShowTools(!showTools)}
      >
        Tools
        <IoChevronForward
          className={`transition-transform duration-200 ${
            showTools ? "rotate-90" : ""
          }`}
        />
      </button>

      {showTools && (
        <div className="w-full center row gap-3 text-txt font-space-grotesk">
          <button
            onClick={() => handleToggleTool("polygon")}
            className={`p-[0.825em]  rounded-lg center btn-shadow w-full ${
              activeTool === "polygon" ? "border-2 border-black" : ""
            }`}
          >
            <FaDrawPolygon className="text-[1.25em]" />
          </button>
          <button
            onClick={() => handleToggleTool("rectangle")}
            className={`p-[0.825em]  rounded-lg center btn-shadow w-full ${
              activeTool === "rectangle" ? "border-2 border-black" : ""
            }`}
          >
            <RiRectangleLine className="text-[1.25em]" />
          </button>
        </div>
      )}
    </div>
  );
};

export default DrawButtons;
