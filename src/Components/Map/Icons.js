import { FaMapMarkerAlt } from "react-icons/fa";
import { MdFlood } from "react-icons/md";
import { FaFireFlameSimple, FaVirusCovid } from "react-icons/fa6";
import { GiPistolGun } from "react-icons/gi";
import { RiEarthquakeFill } from "react-icons/ri";

// This maps zone types to icon components
export const iconComponents = {
  flood: MdFlood,
  fire: FaFireFlameSimple,
  covid: FaVirusCovid,
  shooting: GiPistolGun,
  earthquake: RiEarthquakeFill,
  default: FaMapMarkerAlt,
};
