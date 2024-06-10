import { documentService } from '@root/shared/services/db/document.service';
import { Request, Response } from 'express';
// import mongoose from 'mongoose';


export class InviteToEditDocument {
  public async inviteUser(req: Request, res: Response): Promise<void> {
    try {
      const documentId = req.params.id;
      const { userId } = req.body;

      const document = await documentService.findOneDocument(documentId)
      if (document?.collaborators?.map(user => user.userId.toString()).includes(userId)) {

        res.status(400).json({ error: 'User is already a collaborator.' });
        return
      }
    

      if (!userId) {
        res.status(400).json({ error: 'User ID is required' });
        return;
      }

      const updatedDocument = await documentService.inviteUserToDocument(documentId, userId);

      res.status(200).json({ message: 'User invited successfully', document: updatedDocument });
    } catch (error: any) {
      const statusCode = error.message === 'Invalid document ID' || error.message === 'Invalid user ID' ? 400 : 500;
      res.status(statusCode).json({ error: `Unable to invite user: ${error.message}` });
    }
  }
}
