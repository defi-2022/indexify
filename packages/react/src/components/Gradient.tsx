import React from "react";

interface Gradient {
  children: React.ReactNode;
}
export const Gradient = ({ children }: Gradient) => {
  const styles = {
    backgroundImage:
      "linear-gradient(rgb(255, 28, 247) 25%, rgb(178, 73, 248) 100%)",
    backgroundClip: "text",
    WebkitTextFillColor: "transparent",
    WebkitBackgroundClip: "text",
  };
  return <span style={styles}>{children} </span>;
};
