import { documentService } from '@root/shared/services/db/document.service';
import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';


export class GetDocument {
  public async read(req: Request, res: Response): Promise<void> {
    try {
      const documentId = req.params.id;
      const userId = req.currentUser?.userId as string
      
      const document = await documentService.getDocumentById(documentId, userId);

      if (!document) {
        res.status(404).json({ error: 'Document not found or access denied' });
        return;
      }

      res.status(200).json({ message: 'Document retrieved successfully', document });
    } catch (error: any) {
      const statusCode = error.message === 'Invalid document ID' ? HTTP_STATUS.NOT_FOUND : HTTP_STATUS.INTERNAL_SERVER_ERROR;
      res.status(statusCode).json({ error: `Unable to retrieve document: ${error.message}` });
    }
  }
}
