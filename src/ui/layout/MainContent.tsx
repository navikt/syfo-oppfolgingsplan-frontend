import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export const MainContent = ({ children }: Props) => (
  <div className="flex justify-center px-4 ax-md:px-6">
    <main className="w-full max-w-[730px]">{children}</main>
  </div>
);
