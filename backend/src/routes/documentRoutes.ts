
import { CreateDocument } from "@root/controllers/documents/create-document";
import { GetDocument } from "@root/controllers/documents/get-document";
import { GetUserDocuments } from "@root/controllers/documents/get-user-documents";
import { InviteToEditDocument } from "@root/controllers/documents/invite-to-edit-document";
import { UpdateDocument } from "@root/controllers/documents/update-document";
import express, { Router } from "express";


class DocumentRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.post('/documents', CreateDocument.prototype.create);
    this.router.get('/documents/:id', GetDocument.prototype.read);
    this.router.put('/documents/:id', UpdateDocument.prototype.update);
    this.router.put('/documents/:id/invite', InviteToEditDocument.prototype.inviteUser);
    this.router.get('/users/:userId/documents', GetUserDocuments.prototype.getUserDocuments);
    return this.router;
  }

}

export const documentRoutes: DocumentRoutes = new DocumentRoutes();
