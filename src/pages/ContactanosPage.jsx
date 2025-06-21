import React from "react";
import { useEffect } from "react";

const ContactanosPage = () => {
  useEffect(() => {
    document.title = "GotFix | Contáctanos";
  }, []);
  return <div>ContactanosPage</div>;
};

export default ContactanosPage;
