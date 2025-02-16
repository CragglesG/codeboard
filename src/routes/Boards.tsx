import ProtectedRoute from "../utils/ProtectedRoute";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import "@xyflow/react/dist/style.css";
import "../assets/css/Boards.css";

const defaultNodes = [
  {
    id: "1",
    position: { x: 0, y: 0 },
    data: { label: "Board 1" },
  },
];

export default function Boards() {
  const [ReactFlow, setReactFlow] = useState<any>(null);
  const [Controls, setControls] = useState<any>(null);

  useEffect(() => {
    import("@xyflow/react").then((module) => {
      setReactFlow(module.ReactFlow);
      setControls(module.Controls);
    });
  }, []);

  return (
    <ProtectedRoute className="boards-page" redirect="/boards">
      <Header />
      <div className="react-flow-div">
        {ReactFlow && (
          <ReactFlow
            className="react-flow"
            nodes={defaultNodes}
            proOptions={{ hideAttribution: true }}
          >
            {Controls && <Controls />}
          </ReactFlow>
        )}
      </div>
    </ProtectedRoute>
  );
}
