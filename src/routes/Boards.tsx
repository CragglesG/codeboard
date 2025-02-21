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
import {
  HeaderControls,
  textBtnClick,
  defaultNodes,
  BasicNode,
  DropdownNode,
} from "../utils/BoardsUtils";
import { changeWith } from "@mdxeditor/editor";

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
      dropdown: DropdownNode,
    }),
    []
  );

  const changeLanguage = useCallback((language: string) => {
    setNodes(
      nodes.map((node) =>
        node.type === "dropdown"
          ? {
              ...node,
              data: {
                ...node.data,
                selectedLanguage: language,
                changeLanguage,
              },
            }
          : node
      )
    );
  }, []);

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
        let parsedJson = JSON.parse(json);
        if (parsedJson && json != "{}") {
          parsedJson = parsedJson.map((node: Node) =>
            node.type === "dropdown"
              ? { ...node, data: { ...node.data, changeLanguage } }
              : node
          );
          setNodes(parsedJson);
        } else {
          const nodes = [
            ...defaultNodes,
            {
              id: "2",
              position: { x: 50, y: 50 },
              data: {
                selectedLanguage: "JavaScript",
                recommendedLanguage: "JavaScript",
                changeLanguage: changeLanguage,
              },
              type: "dropdown",
            },
          ];
          setNodes(nodes);
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
