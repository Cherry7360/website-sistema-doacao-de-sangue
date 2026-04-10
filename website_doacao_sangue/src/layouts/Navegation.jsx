import {
  HiHome,
  HiHeart,
  HiSpeakerphone,
  HiCalendar,
  HiBell,
  HiUsers,HiArchive
} from "react-icons/hi";

export const NavItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: <HiHome />,
    roles: ["admin","funcionario"],
  },
   {
    name: "Usuários",
    path: "/usuarios",
    icon: <HiUsers />,
    roles: ["admin"],
  },
  {
    name: "Doadores",
    path: "/doadores",
    icon: <HiUsers />,
    roles: ["funcionario"],
  },
  {
    name: "Agendamento",
    path: "/agendamentos",
    icon: <HiCalendar />,
    roles: ["admin", "funcionario"],
  },
  {
    name: "Doação",
    path: "/doacoes",
    icon: <HiHeart />,
    roles: ["admin", "funcionario"],
  },
  {
    name: "Campanhas",
    path: "/campanhas",
    icon: <HiSpeakerphone />,
    roles: ["admin", "funcionario"],
  },
 {
    name: "Estoque",
    path: "/estoque",
    icon:<HiArchive/>,
    roles: ["admin", "funcionario"],
  },

  {
    name: "Notificações",
    path: "/notificacoes/funcionario",
    icon: <HiBell />,
    roles: ["admin", "funcionario"],
  },
 
];
