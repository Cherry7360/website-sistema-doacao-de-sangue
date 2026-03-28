import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registarUserSchema } from "../../validations/userSchema.js";
import axios from "axios";
import { HiOutlinePlus ,HiSearch} from "react-icons/hi";
import AlertCard from "../../components/AlertCard";
import ConfirmModal from "../../components/ConfirmModal.jsx";

import Button from "../../components/Button.jsx";
import Input from "../../components/Input.jsx";
import Select from "../../components/Select.jsx";
import Modal from "../../components/Modal.jsx";

const BASE_URL = "http://localhost:5080/usuarios";

// Componente que gerencia a lista de usuários, incluindo busca, ordenação, exibição e registo de novos usuários
const Users = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const token = localStorage.getItem("token");
    const [alert, setAlert] = useState(null);
 
    const [confirmDelete, setConfirmDelete] = useState({
  aberto: false,
  userId: null,
});

  const { register, handleSubmit, formState: { errors }, reset,watch } = useForm({
    resolver: zodResolver(registarUserSchema),
  });
console.log(errors)

  // Função que busca a lista de usuários na API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
      console.log(res.data)
    } catch (err) {
      console.error("Erro ao buscar usuários:", err);
    } finally {
      setLoading(false);
    }
  };

  // Hook que chama fetchUsers ao carregar o componente
  useEffect(() => {
    fetchUsers();
  }, []);

 

   
  const filteredUsers = users.filter(user => {
  const term = searchTerm.toLowerCase();
    return (
      user.nome?.toLowerCase().includes(term) ||
      user.email?.toLowerCase().includes(term) ||
      user.tipo_usuario?.toLowerCase().includes(term)
    );
  });

  
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (a.tipo_usuario === b.tipo_usuario) return 0;
    if (a.tipo_usuario === "doador") return -1;
    return 1;
  });

// Para renderizar campos do doador dinamicamente
  const tipoUsuarioSelecionado = watch("tipo_usuario") || "";
 // Função que registra um novo funcionário via API
  const handleRegistarUser = async (data) => {
    try {
      await axios.post(`${BASE_URL}/registo-usuario`, data);
         
      reset();
      
      fetchUsers();
      setAlert({ type: "success", message: `Registo efetuado com sucesso!` });
 

    } catch (error) {
      console.error(error);
     
    }
  };
const handleConfirmDelete = async () => {
  try {
    await axios.delete(`${BASE_URL}/${confirmDelete.userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setAlert({ type: "success", message: "Usuário removido com sucesso!" });
    fetchUsers();
  } catch (err) {
    console.error(err);
    setAlert({ type: "error", message: "Erro ao remover usuário!" });
  } finally {
    setConfirmDelete({ aberto: false, userId: null });
  }
};

  return (
    <div className="p-6 w-full mx-auto">
     
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">Lista de Usuários</h2>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <HiOutlinePlus size={18} />
          Adicionar
        </Button>
      </div>

<div className="relative mb-4">
    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
      <HiSearch/>
    </span>
      <Input
        type="text"
        placeholder="Pesquisar pelo nome..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
       className="pl-10 w-full border border-gray-300 rounded-lg"
     />
       </div>

 {alert && (
    <div className="fixed top-5 right-5 z-50">
      <AlertCard
        type={alert.type}
        message={alert.message}
        onClose={() => setAlert(null)}
      />
    </div>
  )}

<ConfirmModal
  aberto={confirmDelete.aberto}
  titulo="Confirmação de exclusão"
  mensagem="Tem certeza que deseja remover este usuário?"
  onConfirm={handleConfirmDelete}
  onCancel={() => setConfirmDelete({ aberto: false, userId: null })}
/>
     <div className="relative overflow-x-auto shadow-md rounded-lg flex-1 max-h-[500px]">
            <table className="min-w-full text-sm text-left text-gray-700 border border-gray-300">
              <thead className="bg-gray-100 text-gray-700 uppercase text-xs tracking-wider">
                <tr>
              <th className="px-4 py-3 border-b text-center">Nome</th>
              <th className="px-4 py-3 border-b text-center">Email</th>
              <th className="px-4 py-3 border-b text-center">Tipo</th>
              <th className="px-4 py-3 border-b text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {sortedUsers.map(user => (
              
              <tr
                key={user.id_usuario}
                className="bg-white border-b text-center hover:bg-red-50/50 transition duration-150"
                
              >
               
                <td className="px-4 py-4 text-center">
                  <div className="flex items-center space-x-3">
                    <img
                      src={`http://localhost:5080/${user.foto}`}
                      className="w-10 h-10 rounded-full object-cover border-2 border-gray-300"
                    />
                    <span>{user.nome || "-"}</span>
                  </div>
                </td>
                <td className="px-4 py-4 text-center">{user.email}</td>
              <td className="px-4 py-4 text-center">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-bold ${
                    user.tipo_usuario === "doador"
                      ? "bg-blue-100 text-blue-500"
                      : user.tipo_usuario === "funcionario"
                      ? "bg-green-100 text-green-500"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {user.tipo_usuario}
                </span>
              </td>

                <td className="px-4 py-4 text-center">
                  <Button
                    className="bg-red-500 hover:bg-red-400 text-white px-2 py-1 rounded"
                  onClick={() => setConfirmDelete({ aberto: true, userId: user.id_usuario })} >
                    Remover
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      
      <Modal
        mostrar={isModalOpen}
        fechar={() => setIsModalOpen(false)}
        titulo="Novo Usuário"
      >
        <form
          onSubmit={handleSubmit(handleRegistarUser)}
          className="space-y-4 w-full max-w-2xl mx-auto"
        >
          <div className=" rounded-lg p-6 space-y-4 ">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
              <Input
                type="text"
                label="Nome"
                placeholder="Paula SilVa Mendes"
                className="w-full border p-2 rounded"
                required
                {...register("nome")}
                error={errors.nome?.message}
              />
              <Input required
                type="email"
                label="Email"
                placeholder="paula@gmail.com"
                className="w-full border p-2 rounded"
                {...register("email")}
                error={errors.email?.message}
              />
              <Input required
                type="text"
                label="Telefone"
                placeholder="+382"
                className="w-full border p-2 rounded"
                {...register("telefone")}
                error={errors.telefone?.message}
              />
              <Input required
                type="text"
                label="CNI"
                placeholder="19901212f980c"
                className="w-full border p-2 rounded"
                {...register("cni")}
                error={errors.cni?.message}
              />
              <Input required
                type="text"
                label="Morada"
                placeholder="Bela Vista"
                className="w-full border p-2 rounded"
                {...register("morada")}
                error={errors.morada?.message}
              />

                <Select required
                  label="Género"
                  {...register("genero")}
                  className="w-full border p-2 rounded"
                >
                  <option value="">Selecione o género</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Feminino">Feminino</option>
                </Select>
                {errors.genero && (
                  <p className="text-sm text-red-600 mt-1">{errors.genero.message}</p>
                )}
                <Select required
                  label="Tipo usuário"
                  {...register("tipo_usuario")}
                  onChange={(e) => {
                    
                    register("tipo_usuario").onChange(e); // mantém o registro do react-hook-form
                  }}
                  className="w-full border p-2 rounded"
                >
                  <option value="">Selecione o tipo de usuário</option>
                  <option value="funcionario">Funcionário</option>
                  <option value="doador">Doador</option>
                </Select>
                {errors.tipo_usuario && (
                  <p className="text-sm text-red-600 mt-1">{errors.tipo_usuario.message}</p>
                )}
            {tipoUsuarioSelecionado === "doador" && (
              <>
              
                  <Select required
                    label="Tipo sanguíneo"
                    {...register("tipo_sangue")}
                    className="w-full border p-2 rounded"
                  >
                    <option value="">Selecione o tipo sanguíneo</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </Select>
                  {errors.tipo_sangue && (
                    <p className="text-sm text-red-600 mt-1">{errors.tipo_sangue.message}</p>
                  )}

                <Input required
                  type="text"
                  label="Profissão"
                  placeholder="Ex: Enfermeira"
                  {...register("profissao")}
                  error={errors.profissao?.message}
                />
            </>
          )}
            </div>
             <div>
                <p className="text-sm text-gray-500 text-center mb-4">
                Campos marcados com <span className="text-red-500">*</span> são obrigatórios
                </p>
              </div>
            <Button
              type="submit"
              className=" bg-green-600 mt-4 py-2 px-6 text-white font-semibold transition duration-150 rounded-md max-w-xs mx-auto block"
            >
              Salvar
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Users;
