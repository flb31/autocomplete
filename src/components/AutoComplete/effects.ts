import { useEffect } from "react";

const Effects = ({ handleScroll, options }) => {
  useEffect(() => {
    handleScroll();
  }, [options]);

  return null;
};

export default Effects;
