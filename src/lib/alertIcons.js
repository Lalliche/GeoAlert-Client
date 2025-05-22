import { RiEarthquakeFill, RiAlertFill } from "react-icons/ri";
import {
  FaHouseFloodWater,
  FaTornado,
  FaHouseTsunami,
  FaGun,
  FaFireFlameSimple,
  FaVirusCovid,
} from "react-icons/fa6";
import { FaMapMarkerAlt } from "react-icons/fa"; // ✅ correct

import { BsHurricane } from "react-icons/bs";
import { GiWildfires, GiPistolGun } from "react-icons/gi";
import { MdSevereCold, MdFlood } from "react-icons/md";
import { IoIosNuclear } from "react-icons/io";
import { IoAlertCircle } from "react-icons/io5";
import { AiFillAlert } from "react-icons/ai";

export const iconComponents = {
  RiEarthquakeFill: RiEarthquakeFill,
  FaHouseFloodWater: FaHouseFloodWater,
  FaTornado: FaTornado,
  FaHouseTsunami: FaHouseTsunami,
  BsHurricane: BsHurricane,
  GiWildfires: GiWildfires,
  MdSevereCold: MdSevereCold,
  FaGun: FaGun,
  IoIosNuclear: IoIosNuclear,
  IoAlertCircle: IoAlertCircle,
  RiAlertFill: RiAlertFill,
  AiFillAlert: AiFillAlert,
  FaFireFlameSimple: FaFireFlameSimple,
  FaVirusCovid: FaVirusCovid,
  GiPistolGun: GiPistolGun,
  MdFlood: MdFlood,
  FaMapMarkerAlt: FaMapMarkerAlt, // default fallback icon
};

export const icons = {
  RiEarthquakeFill: <RiEarthquakeFill />,
  FaHouseFloodWater: <FaHouseFloodWater />,
  FaTornado: <FaTornado />,
  FaHouseTsunami: <FaHouseTsunami />,
  BsHurricane: <BsHurricane />,
  GiWildfires: <GiWildfires />,
  MdSevereCold: <MdSevereCold />,
  FaGun: <FaGun />,
  IoIosNuclear: <IoIosNuclear />,
  IoAlertCircle: <IoAlertCircle />,
  RiAlertFill: <RiAlertFill />,
  AiFillAlert: <AiFillAlert />,
};
