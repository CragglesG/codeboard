import {
  applyNodeChanges,
  Controls,
  ReactFlow,
  type Node,
  type OnNodesChange,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import React, { useCallback, useMemo, useState } from "react";
import "../assets/css/Boards.css";
import Header from "../components/Header";
import ProtectedRoute from "../utils/ProtectedRoute";
import TextBoxPopup from "../components/TextBoxPopup";

const defaultNodes = [
  {
    id: "1",
    position: { x: 0, y: 0 },
    data: { label: "Board 1" },
    type: "basic",
  },
];

function BasicNode({ data }: { data: { label: string } }) {
  return <div className="basic-node">{data.label}</div>;
}

// TODO: Implement a dropdown node for selecting a programming language

function HeaderControls({
  nodes,
  setNodes,
  setShowPopup,
}: {
  nodes: Node[];
  setNodes: React.Dispatch<Node[]>;
  setShowPopup: React.Dispatch<boolean>;
}) {
  return (
    <div className="header-controls">
      <button className="header-button" onClick={() => setShowPopup(true)}>
        Add Text Node
      </button>
    </div>
  );
}

function textBtnClick(
  nodes: Node[],
  setNodes: React.Dispatch<Node[]>,
  setShowPopup: React.Dispatch<boolean>,
  text: string
) {
  setNodes([
    ...nodes,
    {
      id: `${nodes.length + 1}`,
      position: { x: 0, y: 0 },
      data: { label: text },
      type: "basic",
    },
  ]);
  setShowPopup(false);
}

export default function Boards() {
  const [nodes, setNodes] = useState<Node[]>(defaultNodes);
  const [showPopup, setShowPopup] = useState<boolean>(false);

  const onNodesChange: OnNodesChange = useCallback((changes: any) => {
    setNodes((nds: any) => applyNodeChanges(changes, nds));
  }, []);

  const nodeTypes = useMemo(
    () => ({
      basic: BasicNode,
    }),
    []
  );

  // TODO: File & user management

  return (
    <ProtectedRoute className="boards-page" redirect="/boards">
      <Header actionLink={false}>
        <HeaderControls
          nodes={nodes}
          setNodes={setNodes}
          setShowPopup={setShowPopup}
        />
      </Header>
      <div className="react-flow-div">
        <ReactFlow
          className="react-flow"
          nodes={nodes}
          onNodesChange={onNodesChange}
          nodeTypes={nodeTypes}
          proOptions={{ hideAttribution: true }}
        >
          <Controls />
        </ReactFlow>
      </div>
      {showPopup && (
        <TextBoxPopup
          optionalMessage="Enter text to be shown on this node:"
          btnOnClick={textBtnClick}
          btnOnClickArgs={[nodes, setNodes, setShowPopup]}
        />
      )}
    </ProtectedRoute>
  );
}
