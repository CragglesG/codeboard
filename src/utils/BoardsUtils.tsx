import React from "react";
import { type Node } from "@xyflow/react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

const languages = ["JavaScript", "TypeScript", "Python", "Rust", "C++"];

export const defaultNodes = [
  {
    id: "1",
    position: { x: 0, y: 0 },
    data: {
      label: "",
    },
    type: "basic",
  },
];

export function BasicNode({ data }: { data: { label: string } }) {
  return <div className="basic-node">{data.label}</div>;
}

export function DropdownNode({
  data,
}: {
  data: {
    selectedLanguage: string;
    recommendedLanguage: string;
    changeLanguage: (language: string) => void;
  };
}) {
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
                onClick={() => data.changeLanguage(language)}
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
