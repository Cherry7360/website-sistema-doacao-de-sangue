//import { FaHome, FaHeart, FaBullhorn, FaWarehouse, FaUserFriends } from "react-icons/fa";
import { IoMdCalendar, IoMdNotifications } from "react-icons/io";
import {  HiOutlineHome,
  
  HiOutlineHeart,
  HiOutlineSpeakerphone,
  HiOutlineCalendar,
  HiOutlineBell,
  HiOutlineUsers
} from "react-icons/hi";

export const NavItems = [
  {
    name: "Dashboard",
    path: "/dash",
    icon: <HiOutlineHome />
  },
  {
    name: "Agendamento",
    path: "/agendamentos/gerir_agendamentos",
    icon: < HiOutlineCalendar /> 
  },
  {
    name: "Doacao",
    path: "/doacoes/gerir_doacoes",
    icon: < HiOutlineHeart /> 
  },
  {
    name: "Campanhas",
    path: "/campanhas/gerir_campanhas",
    icon:   <HiOutlineSpeakerphone /> 
  },
  {
    name: "Notificações",
    path: "/notificacoes/gerir_notificacoes",
    icon: < HiOutlineBell /> 
  },
  {
    name: "Doadores",
    path: "/gerir_doadores",
    icon: <  HiOutlineUsers /> 
  }
];

