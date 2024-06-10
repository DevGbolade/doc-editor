/* eslint-disable @typescript-eslint/no-explicit-any */
// src/App.tsx
// import FileGrid from "@/components/FileGrid";
import FileIcon from "@/components/FileIcon";
import React, { useEffect, useState } from "react";
// import FileGrid from './FileGrid';
import { DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { documentService } from "@/services/auth/document.service";
import useSessionStorage from "@/hooks/useSessionStorage";
import toast from "react-hot-toast";

function formatDateToYMD(dateString: string): string {
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
}

const Files: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [setDocument] = useSessionStorage("doc", "set");
  const getUser = useSessionStorage("user", "get");
  const createNewDocument = async () => {
    setLoading(true);
    try {
      const { data } = await documentService.crateDocument();
      setLoading(false);
      setDocument(data.document);
      toast.success(data?.message);
      navigate(`/dashboard/files/${data.document._id}`);
    } catch (error) {
      console.info(error);
      setLoading(false);
    }
  };

  const getDocumentById = async (id: string) => {
    setLoading(true);
    try {
      const { data } = await documentService.getDocumentById(id);
      setLoading(false);
      setDocument(data.document);
      toast.success(data?.message);
      navigate(`/dashboard/files/${data.document._id}`);
    } catch (error) {
      console.info(error);
      toast.error("Document not found or access denied.");

      setLoading(false);
    }
  };

  const getUserDocumentsById = async (id: string) => {
    setLoading(true);
    try {
      const { data } = await documentService.getDocumentUsersById(id);
      setLoading(false);
      setDocuments(data.documents);
      // toast.success(data?.message);
    } catch (error) {
      console.info(error);
      toast.error("Error fetching documents");

      setLoading(false);
    }
  };

  useEffect(() => {
    getUserDocumentsById(getUser.userId);
  }, []);
  return (
    <main
      className="mx-auto max-w-2xl px-4 py-24 sm:px-6 lg:max-w-7xl lg:px-8"
      aria-labelledby="order-history-heading"
    >
      <div className="w-full lg:flex lg:flex-row flex-col-reverse items-center justify-between">
        <div>
          <h1
            id="order-history-heading"
            className="text-3xl font-bold tracking-tight text-gray-900"
          >
            Recent documents
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Here is a list of your recently edited documents, have fun while at
            it.
          </p>
        </div>
        <div className="flex  flex-col items-center">
          <DocumentDuplicateIcon className="h-10 w-10" />
          <button
            className="bg-blue-400 mt-2  text-white rounded text-sm font-thin px-2"
            onClick={createNewDocument}
            disabled={loading}
          >
            {!loading ? " Add new" : "processing..."}
          </button>
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 sm:gap-y-16 lg:grid-cols-3 lg:gap-x-8 xl:grid-cols-4">
        {documents.map((file: any) => (
          <div
            onClick={() => getDocumentById(file._id)}
            key={file.id}
            className="group relative flex flex-col items-center"
          >
            <FileIcon />

            <h3 className="mt-4 text-sm text-gray-500">
              <span className="absolute inset-0" />
              {file?._id}
            </h3>
            <p className="mt-1 text-lg font-medium">
              <span className="text-gray-900">
                Edited on{" "}
                <time dateTime={formatDateToYMD(file.updatedAt)}>
                  {formatDateToYMD(file.updatedAt)}
                </time>
              </span>
            </p>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Files;
