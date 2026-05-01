import React from "react";

export default function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-6xl px-10 md:px-10 lg:px-6">{children}</div>
  );
}
