import { useEffect, useRef } from "react";

function UsernameInput({ color }) {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus(); // Auto-focus the input field on load
  }, []);

  return (
    <input 
      ref={inputRef} 
      className={`w-full bg-white text-black px-4 py-3 border focus:ring-0 rounded-lg mb-4 border-${color}-500 focus:ring-${color}-500`}
      type="text"
      placeholder="Business/Org. Name"
    />
  );
}

export default UsernameInput;
