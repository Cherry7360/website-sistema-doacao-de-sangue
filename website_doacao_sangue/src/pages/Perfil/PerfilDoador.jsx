import { useEffect, useState } from "react";
import axios from "axios";
import {  HiArrowsExpand, HiScale, HiHeart ,HiPencil,HiBriefcase, HiMail, HiPhone, HiLocationMarker, HiLockClosed,HiUser } from "react-icons/hi";
import Modal from "../../components/Modal";
import Button from "../../components/Button"
import Input from "../../components/Input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {AtualizarFotoPerfil,AtualizarDadosPerfil, AtualizarPalavraPasseShema } from "../../validations/userSchema.js";
import { useDropzone } from "react-dropzone";


const base= "http://localhost:5080/doadores"

 const  PerfilDoador= () =>  {
    const [updatePalavraPasse, setUpdatePalavrapasse ] = useState(false);
    const [updateDados, setUpdateDados] = useState(false);
    const [updateFoto,setUpdateFoto]=useState(false);

   const [erro, setErro] = useState("");
    const [mostrar, setMostrar] = useState(false);
 
  const [perfil, setPerfil] = useState(null);
   const [file, setFile] = useState(null); 
    const [preview, setPreview] = useState(null);
     
  const { register, handleSubmit: handleSubmitDados, formState: { errors }, reset: resetDados } = useForm({
    resolver: zodResolver(AtualizarDadosPerfil),
  });

const {  handleSubmit,  reset } = useForm({
    resolver: zodResolver(AtualizarFotoPerfil),
  });
  
 const { 
  register: registerPass,
  handleSubmit: handleSubmitPass,
  formState: { errors: errorsPass }
} = useForm({
  resolver: zodResolver( AtualizarPalavraPasseShema ),
});



  const token = localStorage.getItem("token"); 


  
  useEffect(() => {
    axios.get(`${base}/meu-perfil`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setPerfil(res.data))
    .catch(err => console.error(err));
 
  }, []);
 

    const { getRootProps, getInputProps } = useDropzone({
        accept: { "image/*": [] },
        onDrop: (acceptedFiles) => {
          const file = acceptedFiles[0];
          setFile(file);
          setPreview(URL.createObjectURL(file));
        },
      });

  const onSubmitDados = async (data) => {
    try {
      const res = await axios.put(`${base}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPerfil(prev => ({
        ...prev,
        Usuario: { ...prev.Usuario, telefone: data.telefone, profissao: data.profissao,email: data.email, morada: data.morada ,nome: data.nome},
        profissao: data.profissao,
      }));

      resetDados();
      setUpdateDados(false);
    } catch (err) {
      console.error("Erro ao atualizar dados:", err);
    }
  };
const onSubmit = async () => {
  try {
    const formData = new FormData(); 
    if (file) formData.append("foto", file);

    const res = await axios.post(`${base}/meu-perfil/foto`, formData, {
      headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data"  
      }
    });

    setPerfil(prev => ({
      ...prev,
      Usuario: {
        ...prev.Usuario,
        foto: res.data.foto || URL.createObjectURL(file) 
      }
    }));

    reset();
    setFile(null);
    setPreview(null);
    setMostrar(false);
  } catch (error) {
    console.error("ERRO AO ATUALIZAR FOTO DE PERFIL:", error);
  }
};


const onSubmitPalavraPasse = async (data) => {
  try {
    await axios.put(`${base}/palavra-passe`,data,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    alert("Palavra-passe alterada com sucesso!");
    setUpdatePalavrapasse(false);
  } catch (err) {
    console.error(err);
  }
};


 if (!perfil) return <div className="flex flex-col items-center justify-center h-screen text-center space-y-3">
      <div className="flex flex-col items-center justify-center h-screen text-center space-y-3">
      <h4 className="text-4xl font-bold  mb-4">Carregando ...</h4>
    </div> 
    </div>



  return (
    <div className="px-4 sm:px-6 lg:px-20 mt-6">
      <div className="bg-white rounded-2xl p-8 space-y-10">

        {/* Título */}
        <div className="flex items-center gap-3">
         <h1 className="text-2xl font-semibold text-gray-800">Meu Perfil</h1>
        </div>

        {/* Card Principal do Usuário */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-6">
          <img
            src={`http://localhost:5080/${perfil?.Usuario?.foto || ''}`}
            className="w-28 h-28 rounded-full object-cover border-2 border-gray-300"
            alt="Foto de perfil"
          />
          <div className="flex-1">
            <h2 className="text-2xl font-semibold text-gray-800">{perfil.Usuario.nome}</h2>
            <p className="text-gray-600 mt-1">
              Tipo Sanguíneo: <span className="font-medium">{perfil.tipo_sangue}</span>
            </p>
          </div>
          <Button
            onClick={() => setUpdateFoto(true)}
            className="bg-blue-500 hover:bg-blue-400 text-white px-6 py-2.5 text-sm font-medium rounded-xl flex items-center gap-2"
          >
            Alterar foto
          </Button>
        </div>

        {/* Informações Pessoais */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-semibold text-gray-800">Informações Pessoais</h2>
            <Button
              onClick={() => setUpdateDados(true)}
              className="bg-blue-500 hover:bg-blue-400 text-white px-6 py-2 text-sm font-medium rounded-xl"
            >
              Editar
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-7">
            <div className="flex items-center gap-3">
              <HiBriefcase className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Profissão</p>
                <p className="font-medium text-gray-800">{perfil.profissao || "—"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <HiMail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-800">{perfil.Usuario.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <HiPhone className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Telefone</p>
                <p className="font-medium text-gray-800">{perfil.Usuario.telefone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <HiLocationMarker className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Morada</p>
                <p className="font-medium text-gray-800">{perfil.Usuario.morada}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <HiLockClosed className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Senha</p>
                <Button
                  onClick={() => setUpdatePalavraPasse(true)}
                  className="text-blue-600 hover:underline text-sm mt-1 p-0"
                >
                  Alterar senha
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Informações de Saúde */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-8">Informações de Saúde</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-3">
              <HiArrowsExpand className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Altura</p>
                <p className="text-2xl font-semibold text-gray-800">{perfil.altura_cm} cm</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <HiScale className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Peso</p>
                <p className="text-2xl font-semibold text-gray-800">{perfil.peso_kg} Kg</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <HiHeart className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Tensão Arterial</p>
                <p className="font-medium text-gray-800">{perfil.tensao_arterial || "—"}</p>
              </div>
            </div>
          </div>
        </div>

  
    

     
      <Modal mostrar={updateDados} fechar={() => setUpdateDados(false)} titulo="Alterar Perfil">
        <form onSubmit={handleSubmitDados(onSubmitDados)} className="space-y-4 w-full max-w-2xl mx-auto">
            <div className=" rounded-lg p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <Input
                  type="text"
                  label="Nome "
                  placeholder="Paula Lima Mendes"
                  className="w-full border rounded p-2"
                  {...register("nome")}
                  error={errors.nome?.message}      
                />
                <Input
                  type="email"
                  label="Email"
                  placeholder="exemplo@email.com"
                  className="w-full border rounded p-2"
                  {...register("email")}
                
                  error={errors.email?.message}
                />
                <Input
                  type="text"
                  label="Telefone"
                  placeholder="+382"
                  className="w-full border rounded p-2"
                  {...register("telefone")}
                  
                  error={errors.telefone?.message}
                />
                <Input
                  type="text"
                  label="Morada"
                  placeholder="Bela Vista"
                  className="w-full border rounded p-2"
                  {...register("morada")}
                  
                  error={errors.morada?.message}
                />
                  <Input
                  type="text"
                  label="Profissão"
                  placeholder="Cozinheira"
                  className="w-full border rounded p-2"
                  {...register("profissao")}
                
                  error={errors.profissao?.message}
                />
          </div>
            <div className="flex justify-center gap-4  pt-6">
                  
            <Button type="submit" className=" bg-green-600 px-6 py-2 text-white font-semibold rounded-md">
              Guardar
            </Button>  
          </div>
          </div>
        </form>

        </Modal>
  


        <Modal mostrar={updateFoto} fechar={() => setUpdateFoto(false)} titulo="Alterar foto de perfil">
              
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full max-w-2xl mx-auto">
              <div className=" rounded-lg p-5 space-y-4">
              
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
                <div className="flex justify-center gap-4  pt-6">
                    
                    <Button type="submit" className=" bg-green-600 px-6 py-2 text-white font-semibold rounded-md">
                      Guardar
                    </Button>  
                  </div>
                  </div> 
                </form>
        </Modal>

        <Modal mostrar={updatePalavraPasse} fechar={() => setUpdatePalavrapasse(false)} titulo="Alterar alavra-passe">
          <form onSubmit={handleSubmitPass(onSubmitPalavraPasse)} className="space-y-4 w-full max-w-2xl mx-auto">
              <div className=" rounded-lg p-5 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  <Input
                    {...registerPass("palavra_passe_atual")}
                    label="Palavra-passe anterior"
                    type="password"
                    placeholder=""
                  />
                  {errorsPass.palavra_passe_atual && (
                    <p className="text-red-600">{errorsPass.palavra_passe_atual.message}</p>
                  )}

                  <Input
                    {...registerPass("palavra_passe_nova")}
                    label="Nova palavra-passe"
                    type="password"
                    placeholder=""
                  />
                  {errorsPass.palavra_passe_nova && (
                    <p className="text-red-600">{errorsPass.palavra_passe_nova.message}</p>
                  )}
                  <Input
                    {...registerPass("confirmar")}
                    label="Confirmar Palavra-passe"
                    type="password"
                    placeholder=""
                  />
                  {errorsPass.confirmar && (
                    <p className="text-red-600">{errorsPass.confirmar.message}</p>
                  )}
                  </div>
                  <div className="flex justify-center gap-4  pt-6">
                              
                        <Button type="submit" className=" bg-green-600 px-6 py-2 text-white font-semibold rounded-md">
                          Guardar
                        </Button>  
                  </div>
            </div>
          </form>
        </Modal>

       </div> 
    </div>
  );
};

export default PerfilDoador;
