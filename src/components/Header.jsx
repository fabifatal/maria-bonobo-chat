import React from "react";

const Header = () => {
  return (
    <header className="bg-pink-500 py-6 px-6 shadow-2xl" role="banner">
      <div className="container mx-auto">
        <h1 className="text-4xl md:text-6xl font-black text-center text-white drop-shadow-lg">
          MARÍA BONOBO
        </h1>
        <p className="text-center text-lg md:text-xl mt-3 font-bold text-white">
          La virgen más salvaje del reino animal
        </p>
      </div>
    </header>
  );
};

export default Header;
