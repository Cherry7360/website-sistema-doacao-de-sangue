const Header= ()=>{
   const onLogout = () => {
    console.log("Logout clicado");
  };

  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-gray-900 text-white flex justify-end items-center px-4">
      <button
        className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
        onClick={onLogout}
      >
        Logout
      </button>
    </header>
  );
}

export default Header



