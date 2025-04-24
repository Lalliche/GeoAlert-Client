import { FaMapMarkerAlt } from "react-icons/fa";
import { MdFlood, MdOutlineAddLocation } from "react-icons/md";
import { FaFireFlameSimple, FaVirusCovid } from "react-icons/fa6";
import { GiPistolGun } from "react-icons/gi";
import { FiArrowLeft } from "react-icons/fi";
import { ImCancelCircle } from "react-icons/im";
import { IoChevronForward, IoChevronDownSharp } from "react-icons/io5";
import { GiAlgeria } from "react-icons/gi";

import { RiEarthquakeFill } from "react-icons/ri";

const iconComponents = {
  default: FaMapMarkerAlt,
  flood: MdFlood,
  fire: FaFireFlameSimple,
  gun: GiPistolGun,
  earthquake: RiEarthquakeFill,
  covid: FaVirusCovid,
};

const IconSelector = ({ selectedIcon, setSelectedIcon }) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm">Select Icon</label>
      <div className="flex flex-wrap gap-2">
        {Object.entries(iconComponents).map(([key, Icon]) => (
          <div
            key={key}
            onClick={() => setSelectedIcon(key)}
            className={`p-1 rounded cursor-pointer border ${
              selectedIcon === key ? "border-black" : "border-transparent"
            }`}
          >
            <Icon size={20} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default IconSelector;
