import { ReactNode } from "react";
import "./WhiteStage.css";

interface WhiteStageProps {
  children: ReactNode;
}

export default function WhiteStage({ children }: WhiteStageProps) {
  return (
    <div className="white-stage">
      {children}
    </div>
  );
}
