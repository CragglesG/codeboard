import React, { useContext } from "react";
import { type Node, Handle, Position } from "@xyflow/react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import {
  CurrentLanguage,
  ChangeLanguage,
  ChangeFramework,
} from "./BoardsContexts";
import { Button } from "@/components/ui/button";

const languages = ["JavaScript", "TypeScript", "Python", "Rust", "C++"];

export const allFrameworks = {
  JavaScript: ["React", "Vue", "Angular", "Svelte"],
  TypeScript: ["React", "Vue", "Angular", "Svelte"],
  Python: ["Django", "Flask"],
  Rust: ["Actix", "Rocket"],
  "C++": ["Qt", "SFML"],
};

export const defaultNodes = [
  {
    id: "1",
    position: { x: 0, y: 0 },
    data: {
      label: "",
    },
    type: "basic",
  },
  {
    id: "2",
    position: { x: 50, y: 50 },
    data: {
      selectedLanguage: "JavaScript",
      recommendedLanguage: "JavaScript",
    },
    type: "languageDropdown",
  },
  {
    id: "3",
    position: { x: 100, y: 100 },
    data: {
      selectedFramework: "React",
      recommendedFramework: "React",
    },
    type: "frameworkDropdown",
  },
];

export function BasicNode({ data }: { data: { label: string } }) {
  return (
    <>
      <Handle type="target" position={Position.Top} id="a" />
      <Handle type="source" position={Position.Right} id="b" />
      <Handle type="source" position={Position.Bottom} id="c" />
      <Handle type="target" position={Position.Left} id="d" />
      <div className="basic-node">{data.label}</div>
    </>
  );
}

export function FrameworkDropdownNode({
  data,
}: {
  data: { selectedFramework: string; recommendedFramework: string };
}) {
  let frameworkId = 0;
  const changeFramework = useContext(ChangeFramework);
  const currentLanguage = useContext(CurrentLanguage);
  const frameworks: string[] =
    allFrameworks[currentLanguage] || allFrameworks.JavaScript;

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <MenuButton className="menu-btn inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50">
          {data.selectedFramework}
          <ChevronDownIcon
            aria-hidden="true"
            className="-mr-1 size-5 text-gray-400"
          />
        </MenuButton>
      </div>

      <MenuItems
        transition
        className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white ring-1 shadow-lg ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
      >
        <div className="py-1">
          {frameworks.map((framework: string) => (
            <MenuItem key={frameworkId++}>
              <a
                onClick={() => changeFramework(framework)}
                className="menu-link block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
              >
                {framework}
              </a>
            </MenuItem>
          ))}
        </div>
      </MenuItems>
    </Menu>
  );
}

export function LanguageDropdownNode({
  data,
}: {
  data: {
    selectedLanguage: string;
    recommendedLanguage: string;
  };
}) {
  const changeLanguage = useContext(ChangeLanguage);
  let languageId = 0;
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <MenuButton className="menu-btn inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50">
          {data.selectedLanguage}
          <ChevronDownIcon
            aria-hidden="true"
            className="-mr-1 size-5 text-gray-400"
          />
        </MenuButton>
      </div>

      <MenuItems
        transition
        className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white ring-1 shadow-lg ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
      >
        <div className="py-1">
          {languages.map((language) => (
            <MenuItem key={languageId++}>
              <a
                onClick={() => {
                  changeLanguage(language);
                }}
                className="menu-link block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
              >
                {language}
              </a>
            </MenuItem>
          ))}
        </div>
      </MenuItems>
    </Menu>
  );
}

export function HeaderControls({
  setShowPopup,
}: {
  setShowPopup: React.Dispatch<boolean>;
}) {
  return (
    <div className="header-controls">
      <Button className="header-button" onClick={() => setShowPopup(true)}>
        Add Text Node
      </Button>
    </div>
  );
}

export function textBtnClick(
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
