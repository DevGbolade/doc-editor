import {documentService} from '@root/shared/services/db/document.service';
import { Request, Response } from 'express';

export class UpdateDocument {
    public async update(req: Request, res: Response): Promise<void> {
        try {
          const documentId = req.params.id;
          const { data } = req.body;
    
          const updatedDocument = await documentService.updateDocument(documentId, data);
    
          res.status(200).json({ message: 'Document updated successfully', document: updatedDocument });
        } catch (error: any) {
          const statusCode = error.message === 'Invalid document ID' || error.message === 'Invalid user IDs' ? 400 : error.message === 'Document not found' ? 404 : 500;
          res.status(statusCode).json({ error: error.message });
        }
      }
}
