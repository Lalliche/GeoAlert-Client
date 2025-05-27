import { RiEarthquakeFill, RiAlertFill } from "react-icons/ri";
import {
  FaHouseFloodWater,
  FaTornado,
  FaHouseTsunami,
  FaGun,
  FaFireFlameSimple,
  FaVirusCovid,
  FaPersonMilitaryRifle,
} from "react-icons/fa6";
import { FaMapMarkerAlt, FaFire } from "react-icons/fa"; // FaFire from fa6 added above, keep fallback if needed

import { BsHurricane } from "react-icons/bs";
import { GiWildfires, GiPistolGun, GiFireAxe } from "react-icons/gi";
import {
  MdSevereCold,
  MdFlood,
  MdBusAlert,
  MdFireHydrantAlt,
  MdForest,
} from "react-icons/md";
import { IoIosNuclear, IoIosAirplane } from "react-icons/io";
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

  // New additions:
  MdBusAlert: MdBusAlert,
  FaFire: FaFire,
  MdFireHydrantAlt: MdFireHydrantAlt,
  GiFireAxe: GiFireAxe,
  MdForest: MdForest,
  IoIosAirplane: IoIosAirplane,
  FaPersonMilitaryRifle: FaPersonMilitaryRifle,
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
  FaFireFlameSimple: <FaFireFlameSimple />,
  FaVirusCovid: <FaVirusCovid />,
  GiPistolGun: <GiPistolGun />,
  MdFlood: <MdFlood />,
  FaMapMarkerAlt: <FaMapMarkerAlt />,

  // New additions:
  MdBusAlert: <MdBusAlert />,
  FaFire: <FaFire />,
  MdFireHydrantAlt: <MdFireHydrantAlt />,
  GiFireAxe: <GiFireAxe />,
  MdForest: <MdForest />,
  IoIosAirplane: <IoIosAirplane />,
  FaPersonMilitaryRifle: <FaPersonMilitaryRifle />,
};
