function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-yellow-50 text-center px-4">
      <h1 className="text-4xl sm:text-5xl font-bold text-brown-800 mb-6">
        Bienvenido a la Panadería Italiana
      </h1>
      <p className="text-lg sm:text-xl text-gray-700 max-w-xl mb-2">
        <span className="font-semibold">Visión:</span> Ser la panadería líder en productos italianos.
      </p>
      <p className="text-lg sm:text-xl text-gray-700 max-w-xl">
        <span className="font-semibold">Misión:</span> Ofrecer panadería artesanal con ingredientes auténticos.
      </p>
    </div>
  );
}

export default Home;
