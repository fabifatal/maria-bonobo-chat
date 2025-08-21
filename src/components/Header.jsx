import React from "react";

const Header = () => {
  return (
    <header className="bg-pink-400 py-6 px-6 shadow-2xl">
      <div className="container mx-auto">
        <h1 className="text-4xl md:text-6xl font-black text-center text-white drop-shadow-lg">
          MARÍA BONOBO
        </h1>
        <p className="text-center text-lg md:text-xl mt-3 text-white font-bold opacity-90">
          La virgen más salvaje del reino animal
        </p>
      </div>
    </header>
  );
};

export default Header;
