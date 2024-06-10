// src/FileGrid.tsx
import React from "react";
import FileCard from "./FileCard";

interface File {
  id: number;
  title: string;
  description: string;
  thumbnailUrl: string;
}

interface FileGridProps {
  files: File[];
}

const FileGrid: React.FC<FileGridProps> = ({ files }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {files.map((file) => (
        <FileCard
          key={file.id}
          title={file.title}
          description={file.description}
          thumbnailUrl={file.thumbnailUrl}
        />
      ))}
    </div>
  );
};

export default FileGrid;
