import React from "react";

interface ContainerProps {
  children: React.ReactNode;
}
const Container = ({ children }: ContainerProps) => {
  return (
    <div>
      <div className="mx-auto max-w-7x1">{children}</div>
    </div>
  );
};

export default Container;
