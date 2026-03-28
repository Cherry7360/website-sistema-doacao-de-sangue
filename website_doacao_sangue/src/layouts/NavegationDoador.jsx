import { HiCalendar, HiBell, HiUser ,HiHeart } from "react-icons/hi";

export const NavItemsDoador = [
  {
    name: "Agendamento",
    path: "/agendamentos/doador",
    icon: <HiCalendar />,
       roles: ["doador"]
  },
 {
    name: "Doação",
    path: "/doacoes/doador",
    icon: <HiHeart  />
    ,   roles: ["doador"]
  }, 
  
  
  {
    name: "Perfil",
    path: "/doadores/meu-perfil",
    icon: <HiUser/>,
       roles: ["doador"]
  },
  {
    name: "Notificações",
    path: "/notificacoes",
    icon: <HiBell />,
       roles: ["doador"]
  }

];
