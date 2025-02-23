import {
  applyNodeChanges,
  Controls,
  ReactFlow,
  type Node,
  type OnNodesChange,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router";
import "../assets/css/Boards.css";
import Header from "../components/Header";
import TextBoxPopup from "../components/TextBoxPopup";
import {
  BasicNode,
  defaultNodes,
  allFrameworks,
  LanguageDropdownNode,
  FrameworkDropdownNode,
  HeaderControls,
  textBtnClick,
} from "../utils/BoardsUtils";
import ProtectedRoute from "../utils/ProtectedRoute";
import useKeyPress from "../utils/useKeyPress";
import {
  CurrentLanguage,
  ChangeLanguage,
  ChangeFramework,
} from "../utils/BoardsContexts";

export default function Boards() {
  const [nodes, setNodes] = useState<Node[]>(defaultNodes);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>("");
  const [language, setLanguage] = useState<string>("JavaScript");
  const { state } = useLocation();

  const changeLanguage = useCallback(
    (newLanguage: string) => {
      setLanguage(newLanguage);
      setNodes(
        nodes.map((node) =>
          node.type === "languageDropdown"
            ? {
                ...node,
                data: {
                  ...node.data,
                  selectedLanguage: newLanguage,
                },
              }
            : node.type === "frameworkDropdown"
            ? {
                ...node,
                data: {
                  ...node.data,
                  selectedFramework: allFrameworks[newLanguage][0],
                },
              }
            : node
        )
      );
    },
    [nodes]
  );

  const changeFramework = useCallback(
    (framework: string) => {
      setNodes(
        nodes.map((node) =>
          node.type === "frameworkDropdown"
            ? {
                ...node,
                data: {
                  ...node.data,
                  selectedFramework: framework,
                },
              }
            : node
        )
      );
    },
    [nodes]
  );

  const onNodesChange: OnNodesChange = useCallback((changes: any) => {
    setNodes((nds: any) => applyNodeChanges(changes, nds));
  }, []);

  const nodeTypes = useMemo(
    () => ({
      basic: BasicNode,
      languageDropdown: LanguageDropdownNode,
      frameworkDropdown: FrameworkDropdownNode,
    }),
    []
  );

  const getFile = async () => {
    if (state.file && userId != "") {
      const data = await fetch(
        `${import.meta.env.VITE_PROJECT_URL}/api/boards?file=${
          state.file
        }&user=${userId}`
      );
      if (data.ok) {
        const json = await data.text();
        const parsedJson = JSON.parse(json);
        if (parsedJson && json != "{}") {
          const nodes = [];
          const dims = { width: window.innerWidth, height: window.innerHeight };
          for (let i = 0; i < parsedJson.length; i++) {
            const node = parsedJson[i];
            if (
              node.type === "basic" &&
              node.position.x === 0 &&
              node.position.y === 0
            ) {
              node.position.x = dims.width / 2;
              node.position.y = (dims.height * 0.9) / 2;
            } else if (
              node.type === "languageDropdown" &&
              node.position.x === 50 &&
              node.position.y === 50
            ) {
              node.position.x = dims.width / 2 - 100;
              node.position.y = 100;
            } else if (
              node.type === "frameworkDropdown" &&
              node.position.x === 100 &&
              node.position.y === 100
            ) {
              node.position.x = dims.width / 2 + 100;
              node.position.y = 100;
            }
            nodes.push(node);
          }
          setNodes(nodes);
        } else {
          const nodes = [];
          const dims = { width: window.innerWidth, height: window.innerHeight };
          for (let i = 0; i < defaultNodes.length; i++) {
            const node = defaultNodes[i];
            if (node.type === "basic") {
              node.position.x = dims.width / 2;
              node.position.y = (dims.height * 0.9) / 2;
            } else if (node.type === "languageDropdown") {
              node.position.x = dims.width / 2 - 100;
              node.position.y = 100;
            } else if (node.type === "frameworkDropdown") {
              node.position.x = dims.width / 2 + 100;
              node.position.y = 100;
            }
            nodes.push(node);
          }
          setNodes(nodes);
        }
      }
    }
  };

  useEffect(() => {
    getFile();
  }, [userId]);

  const saveFile = useCallback(
    async (e?: any) => {
      e?.preventDefault();
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
    },
    [nodes]
  );

  useEffect(() => {
    document.addEventListener("beforeunload", saveFile);
    document.addEventListener("pagehide", saveFile);
    document.addEventListener("visibilitychange", saveFile);
    return () => {
      document.removeEventListener("beforeunload", saveFile);
      document.removeEventListener("pagehide", saveFile);
      document.removeEventListener("visibilitychange", saveFile);
    };
  });

  useKeyPress(["s"], saveFile, null, true);

  useEffect(() => {
    const saveInterval = setInterval(saveFile, 10000);
    return () => clearInterval(saveInterval);
  }, [saveFile]);

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
      <CurrentLanguage.Provider value={language}>
        <ChangeLanguage.Provider value={changeLanguage}>
          <ChangeFramework.Provider value={changeFramework}>
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
          </ChangeFramework.Provider>
        </ChangeLanguage.Provider>
      </CurrentLanguage.Provider>
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
