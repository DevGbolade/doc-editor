/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import Quill from "quill";
import "quill/dist/quill.snow.css"; // importing the stylesheet
import { io } from "socket.io-client";
import otclient from "../ot/client-copy";
import useSessionStorage from "@/hooks/useSessionStorage";
import Delta from "quill-delta";
import useBearStore from "@/store/state";
import toast from "react-hot-toast";

const otClient = new otclient(0);

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["bold", "italic", "underline"],
  [{ color: [] }, { background: [] }],
  [{ script: "sub" }, { script: "super" }],
  [{ align: [] }],
  ["image", "blockquote", "code-block"],
  ["clean"],
];

const SAVE_INTERVAL_MS = 2000;

export default function TextEditor() {
  const { id: documentId } = useParams();
  const [socket, setSocket] = useState<any>();
  const [quill, setQuill] = useState<any>();
  const getUser = useSessionStorage("user", "get");
  const getDoc = useSessionStorage("doc", "get");
  // const [undoStack, setUndoStack] = useState<Delta[]>([]);
  // const [redoStack, setRedoStack] = useState<Delta[]>([]);
  const { setClients } = useBearStore();

  // to set up the socket connection which will be done only on the first render
  useEffect(() => {
    const s = io("http://localhost:4004"); //Port on which server is running
    setSocket(s);
    return () => {
      s.disconnect();
    };
  }, []);

  // to get access to a particular document by joining the room corresponding to that document
  useEffect(() => {
    if (socket == null || quill == null) return;

    // document (i.e. is data of the document) is returned by the server along with the 'load-document' event
    socket.once("load-document", (document: any) => {
      quill.setContents(document);
      // console.log(document);
      quill.enable(); // Initally the text editor was disabled. Now as we got access to the document, it is enabled
    });

    // sending the 'get-document' event to the server to ask it to join this user to the room with id = documentId
    const obj = {
      documentId: getDoc?._id,
      userId: getUser?.userId,
      username: getUser.username,
    };
    socket.emit("get-document", obj);
    socket.on("connected-users", (users: string[]) => {
      setClients(users);
    });
    socket.on("user-joined", (user: string) => {
      console.log("User Joined room ---->", user);
      toast.success(`${user} joined the room`);
    });
  }, [socket, quill, documentId]);

  useEffect(() => {
    if (socket == null || quill == null) return;
    const interval = setInterval(() => {
      socket.emit("save-document", quill.getContents());
    }, SAVE_INTERVAL_MS);

    return () => {
      clearInterval(interval);
    };
  }, [socket, quill]);

  //to receive the changes from the server
  useEffect(() => {
    if (socket == null || quill == null) return;

    otClient.applyDelta = function (delta) {
      console.log("applying delta");
      console.log(delta);
      quill.updateContents(delta); //updating the changes received to all the instances of the same doc
    };

    // the delta received by the server is applied to the editor
    const receiveChangeHandler = (delta: Delta) => {
      console.log(otClient.state);
      // quill.updateContents(delta); //updating the changes received to all the instances of the same doc
      otClient.applyFromServer(delta);
    };

    //listening to "receive-changes" event from the server
    socket.on("receive-changes", receiveChangeHandler);

    return () => {
      socket.off("receive-changes", receiveChangeHandler);
    };
  }, [socket, quill]);

  // const undo = useCallback(() => {
  //   // if (!quill || undoStack.length === 0) return;
  //   console.log("fire-------->");

  //   const lastChange = undoStack[undoStack.length - 1];
  //   console.log(lastChange);
  //   setUndoStack(undoStack.slice(0, -1));
  //   setRedoStack((prevStack) => [...prevStack, lastChange]);

  //   quill.updateContents(lastChange.invert(quill.getContents()));
  // }, [quill, undoStack, redoStack]);

  // const redo = useCallback(() => {
  //   if (!quill || redoStack.length === 0) return;

  //   const lastUndo = redoStack[redoStack.length - 1];
  //   console.log("last undo", lastUndo);
  //   setRedoStack(redoStack.slice(0, -1));
  //   setUndoStack((prevStack) => [...prevStack, lastUndo]);

  //   quill.updateContents(lastUndo);
  // }, [quill, undoStack, redoStack]);

  // to detect text changes in the editor and sending those changes to the server
  useEffect(() => {
    if (socket == null || quill == null) return;

    otClient.sendDelta = function (version, delta) {
      socket.emit("send-changes", delta, version);
    };

    const textChangeHandler = (
      delta: Delta,
      _oldDelta: any,
      source: string
    ) => {
      if (source !== "user") return;
      // if (source === "user") {
      //   setUndoStack((prevStack) => [...prevStack, delta]);
      //   setRedoStack([]);
      // }
      otClient.applyFromClient(delta);
    };

    // on "text-change" event of quill
    quill.on("text-change", textChangeHandler);

    return () => {
      quill.off("text-change", textChangeHandler);
    };
  }, [socket, quill]);

  useEffect(() => {
    if (socket == null || quill == null) return;
    function serverAckHandler() {
      otClient.serverAck();
    }
    socket.on("server-ack", serverAckHandler);
  }, [socket]);

  // to display the editor by creating a new Quill instance on first render
  const wrapperRef = useCallback(
    (
      wrapper: {
        innerHTML: string;
        append: (arg0: HTMLDivElement) => void;
      } | null
    ) => {
      if (wrapper == null) return;
      // console.log("Inside Editor");
      wrapper.innerHTML = "";
      const editor = document.createElement("div");
      wrapper.append(editor);
      const q = new Quill(editor, {
        theme: "snow",
        modules: { toolbar: TOOLBAR_OPTIONS },
      });
      q.disable(); // initally the text editor is disabled (not editable) (until the document is not accessed)
      q.setText("Loading the document..."); // the text shown until the document is accessed from the server
      setQuill(q);
    },
    []
  );

  return (
    <div className="h-[80%]">
      {/* <div className="flex gap-2 mb-2">
        <button
          className="p-2 bg-white rounded px-4 text-black border shadow-sm"
          onClick={undo}
        >
          Undo
        </button>
        <button
          className="p-2 bg-indigo-500 rounded px-4 text-white border"
          onClick={redo}
        >
          redo
        </button>
      </div> */}
      <div className="h-[80%]" ref={wrapperRef}></div>;
    </div>
  );
}
