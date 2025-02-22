import {
  applyNodeChanges,
  Controls,
  ReactFlow,
  type Node,
  type OnNodesChange,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useLocation } from "react-router";
import "../assets/css/Boards.css";
import Header from "../components/Header";
import TextBoxPopup from "../components/TextBoxPopup";
import {
  BasicNode,
  defaultNodes,
  DropdownNode,
  HeaderControls,
  textBtnClick,
} from "../utils/BoardsUtils";
import ProtectedRoute from "../utils/ProtectedRoute";
import useKeyPress from "../utils/useKeyPress";
import ChangeLanguage from "../utils/ChangeLanguage";

export default function Boards() {
  const [nodes, setNodes] = useState<Node[]>(defaultNodes);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>("");
  const { state } = useLocation();

  const changeLanguage = useCallback(
    (language: string) => {
      setNodes(
        nodes.map((node) =>
          node.type === "dropdown"
            ? {
                ...node,
                data: {
                  ...node.data,
                  selectedLanguage: language,
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
      dropdown: DropdownNode,
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
        let parsedJson = JSON.parse(json);
        if (parsedJson && json != "{}") {
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
      <ChangeLanguage.Provider value={changeLanguage}>
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
      </ChangeLanguage.Provider>
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
