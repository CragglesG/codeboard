import {
  applyNodeChanges,
  Controls,
  ReactFlow,
  type Node,
  type OnNodesChange,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import React, { useCallback, useMemo, useState, useEffect } from "react";
import "../assets/css/Boards.css";
import Header from "../components/Header";
import ProtectedRoute from "../utils/ProtectedRoute";
import TextBoxPopup from "../components/TextBoxPopup";
import { useLocation } from "react-router";
import useKeyPress from "../utils/useKeyPress";

const defaultNodes = [
  {
    id: "1",
    position: { x: 0, y: 0 },
    data: {
      label:
        "Something went wrong. Please try again later, and if the issue persists, please contact support.",
    },
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
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
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
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>,
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
  const [userId, setUserId] = useState<string>("");
  const { state } = useLocation();

  const onNodesChange: OnNodesChange = useCallback((changes: any) => {
    setNodes((nds: any) => applyNodeChanges(changes, nds));
  }, []);

  const nodeTypes = useMemo(
    () => ({
      basic: BasicNode,
    }),
    []
  );

  const getFile = async () => {
    if (state.file && userId != "") {
      const formData = new FormData();
      const data = await fetch(
        `${import.meta.env.VITE_PROJECT_URL}/api/boards?file=${
          state.file
        }&user=${userId}`
      );
      if (data.ok) {
        const json = await data.text();
        if (json && json != "{}") {
          setNodes(JSON.parse(json));
        }
      }
    }
  };

  useEffect(() => {
    getFile();
  }, [userId]);

  let lastNodes = nodes;

  const saveFile = async () => {
    if (nodes != lastNodes) {
      if (userId && state.file) {
        const formData = new FormData();
        formData.append("user", userId);
        formData.append("id", state.file);
        formData.append("board", JSON.stringify(nodes));
        await fetch(`${import.meta.env.VITE_PROJECT_URL}/api/boards`, {
          method: "PUT",
          body: formData,
        });
      }
      lastNodes = nodes;
    }
  };

  const saveCallback = (e) => {
    e.preventDefault();
    saveFile();
  };

  useEffect(() => {
    document.addEventListener("beforeunload", saveCallback);
    document.addEventListener("pagehide", saveCallback);
    document.addEventListener("visibilitychange", saveCallback);
    return () => {
      document.removeEventListener("beforeunload", saveCallback);
      document.removeEventListener("pagehide", saveCallback);
      document.removeEventListener("visibilitychange", saveCallback);
    };
  });

  useKeyPress(["s"], saveCallback, null, true);

  return (
    <ProtectedRoute
      className="boards-page"
      redirect="/boards"
      setUserId={setUserId}
      navigateState={{ state: state }}
    >
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
