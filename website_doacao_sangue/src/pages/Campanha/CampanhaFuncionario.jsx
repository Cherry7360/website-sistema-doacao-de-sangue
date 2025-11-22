
import { useState,useEffect  } from "react";
import axios from "axios";
import Button from "../../components/Button";
import Input from "../../components/Input";

import Textarea from"../../components/Textarea";
import Modal from "../../components/Modal";

import {  HiOutlinePlus  } from "react-icons/hi";
import { useDropzone } from "react-dropzone";

import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import { campanhaSchema } from "../../validations/campanhaSchema";


const base = "http://localhost:5080/campanhas"; 

const CampanhaFuncionario = () => {
  const [search, setSearch] = useState("");
  const [campanhas, setCampanhas] = useState([]);
  const [mostrar, setMostrar] = useState(false);
 
  const [loading, setLoading] = useState(true);
   const [file, setFile] = useState(null); 
  const [preview, setPreview] = useState(null);
   

const token = localStorage.getItem("token");

const { register, handleSubmit, formState: { errors }, reset } = useForm({
     resolver: zodResolver(campanhaSchema),
   });
 
   
   const fetchCampanhas = async () => {
      try {
        const res = await axios.get(`${base}/gerir_campanhas`);
        setCampanhas(res.data);
      } catch (error) {
        console.error("Erro ao buscar campanhas:", error);
      } finally {
      setLoading(false); 
    }
    };

  useEffect(() => {
    fetchCampanhas();
  }, []);

   const campanhasFiltradas = campanhas.filter((c) => {
    const termo = search.toLowerCase();
  const nomeCampanha = c.Campanha?.descricao?.toLowerCase() || "";

    return (
    nomeCampanha.includes(termo)||
     String(c.id_campanha).includes(termo)   
    );
  });

    const { getRootProps, getInputProps } = useDropzone({
        accept: { "image/*": [] },
        onDrop: (acceptedFiles) => {
          const file = acceptedFiles[0];
          setFile(file);
          setPreview(URL.createObjectURL(file));
        },
      });

const onSubmit = async (data) => {
  try {
    const formData = new FormData();

   
    formData.append("descricao", data.descricao);
    formData.append("data_campanha", data.data_campanha);
    formData.append("horario", data.horario);
    formData.append("local", data.local);
    formData.append("id_funcionario", data.id_funcionario);

 
    if (file) formData.append("foto", file);
for (let [key, value] of formData.entries()) {
  console.log(key, value);
}


const fotoFile = formData.get("foto");
if (fotoFile instanceof File) {
  console.log("Arquivo:", fotoFile);
  console.log("Nome:", fotoFile.name);
  console.log("Tipo:", fotoFile.type);
  console.log("Tamanho:", fotoFile.size);
}



    await axios.post(`${base}/gerir_campanhas`, formData, {
      headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data"  
      }
    });

    alert("Campanha adicionada com sucesso!");


    const res = await axios.get(`${base}/gerir_campanhas`);
    setCampanhas(res.data);


    reset();
    setFile(null);
    setPreview(null);
    setMostrar(false);

  } catch (error) {
    console.error("Erro ao adicionar campanha:", error);
   
    alert("Erro ao adicionar campanha.");
  }
};

  const atualizarEstado = async (id, estado) => {
      console.log("Enviando:", { id, estado, token }); 
    await axios.put(`${base}/gerir_campanhas/${id}`, { estado},
      {headers: { Authorization: `Bearer ${token}` },}
    );
  const res = await axios.get(`${base}/gerir_campanhas`);
    setCampanhas(res.data);
    };


  const removerCampanha = async (id) => {
    await axios.delete(`${base}/gerir_campanhas/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    const res = await axios.get(`${base}/gerir_campanhas`);
    setCampanhas(res.data);
    };


  return (
    <div>
<div className="p-6 flex flex-col h-full">

  <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
    <h2 className="text-xl font-bold">Lista campanhas</h2>
    <Button
      onClick={() => setMostrar(true)}
      className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
    >
      < HiOutlinePlus  size={18} />
      Adicionar
    </Button>
  </div>


    <Input
        type="text"
        placeholder="Pesquisar Id campanha" 
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-6 w-full border border-gray-300 p-2 rounded-lg" 
      />

  {loading ? (
    <p>Carregando...</p>
  ) : campanhas.length === 0 ? (
    <p>Nenhuma campanha encontrada.</p>
  ) : (
    <div className="relative overflow-x-auto shadow-md rounded-lg flex-1">
      <table className="min-w-full text-sm text-left text-gray-700 border border-gray-300">
        <thead className="bg-gray-100 text-gray-700 uppercase text-xs tracking-wider">
          <tr>
            <th className="px-6 py-3 border-b">ID</th>
            <th className="px-6 py-3 border-b">Descrição</th>
            <th className="px-6 py-3 border-b">Local</th>
            <th className="px-6 py-3 border-b">Data</th>
            <th className="px-6 py-3 border-b">Horário</th>
            <th className="px-6 py-3 border-b">Ações</th>
          </tr>
        </thead>

        <tbody>
          {campanhasFiltradas.map((c) => (
            <tr key={c.id_campanha} className="bg-white border-b hover:bg-gray-50 transition">
              <td className="px-6 py-4 font-medium text-gray-900">{c.id_campanha}</td>
              <td className="px-6 py-4 font-medium text-gray-900">{c.descricao}</td>
              <td className="px-6 py-4 font-medium text-gray-900">{c.local}</td>
              <td className="px-6 py-4 font-medium text-gray-900">{c.data_campanha}</td>
              <td className="px-6 py-4 font-medium text-gray-900">{c.horario}</td>
              <td className="px-6 py-4 font-medium text-gray-900 flex gap-2 flex-wrap">
                {!c.estado ? (
                  <>
                    <button
                      onClick={() => atualizarEstado(c.id_campanha, true)}
                      className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                    >
                      Ativar
                    </button>
                    <button
                      onClick={() => removerCampanha(c.id_campanha)}
                      className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                    >
                      Remover
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => atualizarEstado(c.id_campanha, false)}
                      className="bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600"
                    >
                      Inativar
                    </button>
                    <button
                      onClick={() => removerCampanha(c.id_campanha)}
                      className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                    >
                      Remover
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
</div>



   <Modal mostrar={mostrar} fechar={() => setMostrar(false)} titulo="Nova Campanha">
  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full max-w-2xl mx-auto">
    <div className="border border-gray-100 rounded-lg p-6 space-y-4 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

    
        <div className="space-y-4">
          <Input
            type="number"
            placeholder="ID Funcionário"
            className="w-full border p-2 rounded"
            {...register("id_funcionario")}
            error={errors.id_funcionario?.message}
          />
          <Textarea
            placeholder="Descrição da campanha"
            className="w-full border p-2 rounded"
            {...register("descricao")}
            error={errors.descricao?.message}
          />
          <Input
            type="date"
            className="w-full border p-2 rounded"
            {...register("data_campanha")}
            error={errors.data_campanha?.message}
          />
          <Input
            type="time"
            className="w-full border p-2 rounded"
            {...register("horario")}
            error={errors.horario?.message}
          />
          <Input
            type="text"
            placeholder="Local da campanha"
            className="w-full border p-2 rounded"
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

   
      <Button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-lg mt-4 w-full md:w-auto">
        Salvar
      </Button>
    </div>
  </form>
</Modal>


    </div>
  );
};

export default CampanhaFuncionario;
