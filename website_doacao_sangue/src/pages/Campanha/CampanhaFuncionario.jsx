import { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { campanhaSchema } from "../../validations/campanhaSchema";

import axios from "axios";
import AlertCard from "../../components/AlertCard";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Textarea from "../../components/Textarea";
import Modal from "../../components/Modal";
import { HiOutlinePlus , HiSearch} from "react-icons/hi";

const BASE_URL = "http://localhost:5080/campanhas";

// Componente que gerencia campanhas para funcionários, incluindo busca, criação, atualização de estado e remoção
const CampanhaFuncionario = () => {
  const [search, setSearch] = useState(""); 
  const [campanhas, setCampanhas] = useState([]); 
  const [mostrar, setMostrar] = useState(false);
  const [loading, setLoading] = useState(true); 
  const [file, setFile] = useState(null); 
  const [preview, setPreview] = useState(null); 
  const [alert, setAlert] = useState(null);
  const token = localStorage.getItem("token");

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(campanhaSchema),
  });

  // Função que busca todas as campanhas da API
  const fetchCampanhas = async () => {
    try {
      const res = await axios.get(`${BASE_URL}`);
      setCampanhas(res.data);
    } catch (error) {
      console.error("Erro ao buscar campanhas:", error);
    } finally {
      setLoading(false);
    }
  };

 // Hook que chama fetchCampanhas ao carregar o componente
  useEffect(() => {
    fetchCampanhas();
  }, []);

   // Função que filtra as campanhas com base no termo de busca
  const campanhasFiltradas = campanhas.filter((c) => {
    const termo = search.toLowerCase();
    const nomeCampanha = c.Campanha?.descricao?.toLowerCase() || "";
    return nomeCampanha.includes(termo) || String(c.id_campanha).includes(termo);
  });

 
  // Configuração do Dropzone para upload de imagens
  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      setFile(file);
      setPreview(URL.createObjectURL(file));
    },
  });

 // Função que envia uma nova campanha para a API
  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("descricao", data.descricao);
       formData.append("titulo", data.titulo);
      formData.append("data_campanha", data.data_campanha);
      formData.append("horario", data.horario);
      formData.append("local", data.local);
      formData.append("id_funcionario", data.id_funcionario);
      if (file) formData.append("foto", file);

      await axios.post(`${BASE_URL}`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"  
        }
      });

       setAlert({ type: "success", message: "Campanha criado com sucesso!" });


     
      const res = await axios.get(`${BASE_URL}`);
      setCampanhas(res.data);

      reset();
      setFile(null);
      setPreview(null);
      setMostrar(false);
    } catch (error) {
      console.error("Erro ao adicionar campanha:", error);
      setAlert({ type: "error", message: "Erro ao criar campanha."});

    }
  };
  // Função que atualiza o estado de uma campanha (ativo/inativo)
  const atualizarEstado = async (id, estado) => {
    try {
      await axios.put(`${BASE_URL}/${id}`, { estado }, {
        headers: { Authorization: `Bearer ${token}` },
      });
       setAlert({type:"success", message:"Campanha atualizada!"});
   
        setCampanhas(prev =>
      prev.map(c =>
        c.id_campanha === id ? { ...c, estado } : c
      )
    );
    } catch (error) {
      console.error("Erro ao atualizar estado:", error);
      setAlert({type:"error", message:"Erro ao atualizada campanha!"});
   
    }
  };

  // Função que remove uma campanha da API
  const removerCampanha = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const res = await axios.get(`${BASE_URL}`);
      setCampanhas(res.data);
      setAlert({type:"success", message:"Campanha removida!"});
   
    } catch (error) {
      console.error("Erro ao remover campanha:", error);
       setAlert({type:"error", message:"Erro ao remover campanha!"});
   
    }
  };


  return (
  <div className="px-4 sm:px-6 lg:px-20 py-8">
    <div className="bg-white rounded-2xl shadow-sm p-8 min-h-[calc(100vh-100px)] flex flex-col">

      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800">Lista de Campanhas</h2>
        
        <Button
          onClick={() => setMostrar(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-medium"
        >
          <HiOutlinePlus size={20} />
          Nova Campanha
        </Button>
      </div>

      {/* Barra de Pesquisa */}
      <div className="relative mb-8">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          <HiSearch className="text-xl" />
        </span>
        <Input
          type="text"
          placeholder="Pesquisar campanhas..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-12 py-3.5 w-full border border-gray-300 rounded-2xl"
        />
      </div>

      {/* Alert */}
      {alert && (
        <div className="fixed top-6 right-6 z-50">
          <AlertCard
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        </div>
      )}

      {/* Conteúdo Principal */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-lg text-gray-600">Carregando campanhas...</p>
        </div>
      ) : campanhas.length === 0 ? (
        <div className="flex-1 flex items-center justify-center py-20">
          <div className="text-center">
            <h3 className="text-2xl font-medium text-gray-700 mb-3">Nenhuma campanha encontrada</h3>
            <p className="text-gray-500">Ainda não existem campanhas cadastradas.</p>
          </div>
        </div>
      ) : (
        /* Tabela com melhor espaçamento */
        <div className="flex-1 overflow-hidden border border-gray-200 rounded-2xl shadow-sm">
          <div className="overflow-x-auto max-h-[calc(100vh-280px)]">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 sticky top-0 z-20 border-b">
                <tr>
                  <th className="px-6 py-4 font-medium text-gray-600">ID</th>
                  <th className="px-6 py-4 font-medium text-gray-600">Título</th>
                  <th className="px-6 py-4 font-medium text-gray-600">Descrição</th>
                  <th className="px-6 py-4 font-medium text-gray-600">Local</th>
                  <th className="px-6 py-4 font-medium text-gray-600">Data</th>
                  <th className="px-6 py-4 font-medium text-gray-600">Horário</th>
                  <th className="px-6 py-4 text-center font-medium text-gray-600">Ações</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {campanhasFiltradas.map((c) => (
                  <tr key={c.id_campanha} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-5 font-medium">{c.id_campanha}</td>
                    <td className="px-6 py-5 font-medium text-gray-900">{c.titulo ?? "—"}</td>
                    <td className="px-6 py-5 text-gray-700">{c.descricao}</td>
                    <td className="px-6 py-5">{c.local}</td>
                    <td className="px-6 py-5">{c.data_campanha}</td>
                    <td className="px-6 py-5">{c.horario}</td>
                    <td className="px-6 py-5">
                      <div className="flex gap-2 justify-center flex-wrap">
                        {!c.estado ? (
                          <>
                            <Button
                              onClick={() => atualizarEstado(c.id_campanha, true)}
                              className="bg-green-600 hover:bg-green-700 text-white  px-2 py-1 rounded"
                            >
                              Ativar
                            </Button>
                            <Button
                              onClick={() => removerCampanha(c.id_campanha)}
                              className="bg-red-600 hover:bg-red-700 text-white  px-2 py-1 rounded"
                            >
                              Remover
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              onClick={() => atualizarEstado(c.id_campanha, false)}
                              className="bg-gray-500 hover:bg-gray-400 text-white  px-2 py-1 rounded"
                            >
                              Inativar
                            </Button>
                            <Button
                              onClick={() => removerCampanha(c.id_campanha)}
                              className="bg-red-600 hover:bg-red-700 text-white  px-2 py-1 rounded"
                            >
                              Remover
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal - Nova Campanha */}
       <Modal mostrar={mostrar} fechar={() => setMostrar(false)} titulo="Nova Campanha">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full max-w-2xl mx-auto">
          <div className="rounded-lg p-4 space-y-4 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
             
                  <Input
                    type="number"
                    label="ID Funcionário"
                   {...register("id_funcionario")}
                    error={errors.id_funcionario?.message}
                  />

                  <Input
                    type="text"
                    label="Título da Campanha"
                    {...register("titulo")}
                    error={errors.titulo?.message}
                  />

                  <Textarea
                    label="Descrição da Campanha"
                    {...register("descricao")}
                    error={errors.descricao?.message}
                  />

                  <Input
                    type="date"
                    label="Data da Campanha"
                    className="w-full border p-2 rounded"
                    {...register("data_campanha")}
                    error={errors.data_campanha?.message}
                  />

                  <Input
                    type="time"
                    label="Horário"
                    {...register("horario")}
                    error={errors.horario?.message}
                  />

                  <Input
                    type="text"
                    label="Local da Campanha"
                    {...register("local")}
                    error={errors.local?.message}
                  />
              
              </div>
            
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50 hover:border-red-500 transition">
                <div
                  {...getRootProps()}
                  className="w-full h-64 flex flex-col items-center justify-center cursor-pointer"
                >
                  <input {...getInputProps()} />
                  {preview ? (
                    <img src={preview} alt="Pré-visualização" className="h-full w-full object-contain rounded-lg" />
                  ) : (
                    <p className="text-gray-500 text-center">Arraste a imagem ou clique para selecionar</p>
                  )}
                </div>
              </div>
            </div>
           <div className="flex justify-center pt-6">
            <Button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-10 py-3 rounded-xl font-medium"
            >
              Salvar Campanha
            </Button>
          </div>

          </div>
        </form>
      </Modal>
    </div>
  </div>

  );
};

export default CampanhaFuncionario;
