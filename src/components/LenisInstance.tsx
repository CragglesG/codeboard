import Lenis from "lenis";
import { createContext, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";

const LenisContext = createContext(null);

export function LenisProvider({ children }) {
  const [lenis, setLenis] = useState(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
    });

    setLenis(lenis);

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
  );
}

LenisProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useLenis() {
  const lenis = useContext(LenisContext);
  if (lenis === undefined) {
    throw new Error("useLenis must be used within a LenisProvider");
  }
  return lenis;
}
