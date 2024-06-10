/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "../axios";

class DocumentService {
  async getDocumentById(id: string) {
    const response = await axios.get(`/documents/${id}`);
    return response;
  }

  async getDocumentUsersById(id: string) {
    const response = await axios.get(`/users/${id}/documents`);
    return response;
  }

  async crateDocument() {
    const response = await axios.post("/documents");
    return response;
  }
 
  async addCollaboratorToDoc({docId, userId}: {docId: string, userId: string}) {
    const response = await axios.put(`/documents/${docId}/invite`, {userId});
    return response;
  }
}

export const documentService = new DocumentService();
