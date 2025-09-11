import React from "react";

const Spinner = () => {
  return (
    <div className="flex justify-center items-center w-full py-10" role="status" >
      <div className="w-10 h-10 border-4 border-t-transparent border-white border-solid rounded-full animate-spin"></div>
    </div>
  );
};

export default Spinner;
