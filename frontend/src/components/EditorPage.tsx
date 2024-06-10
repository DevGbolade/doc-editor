/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useRef } from "react";
import ReactQuill, { Quill } from "react-quill";
import "quill/dist/quill.snow.css";

import QuillCursors from "quill-cursors";
// import useBearStore from "@/store/state";
import Collaborators from "./Collaborators";
import {
  ClipboardDocumentCheckIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import TextEditor from "./TextEditor";
import Modal from "./Modal";

Quill.register("modules/cursors", QuillCursors);

// Define the modules
const modules = {
  cursors: {
    hideDelayMs: 500,
    hideSpeedMs: 300,
    selectionChangeSource: null,
    transformOnTextChange: true,
  },
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline"],
    ["image", "code-block"],
  ],
};

const EditorPage = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="h-screen">
      <Modal open={open} setOpen={setOpen} />
      <div className="mb-4 flex justify-between">
        <Collaborators />
        <div className="flex gap-5">
          <span className="text-xs">
            <ClipboardDocumentCheckIcon className="h-6 w-6" />
            copy
          </span>
          <span className="text-xs flex flex-col items-center">
            <UserPlusIcon
              className="h-6 w-6 cursor-pointer"
              onClick={() => setOpen(true)}
            />
            Add editor
          </span>
        </div>
      </div>
      <div className="h-screen">
        <TextEditor />
      </div>
    </div>
  );
};

export default EditorPage;
