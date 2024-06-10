import { Request, Response } from 'express';
import { documentService } from '@root/shared/services/db/document.service';
import HTTP_STATUS from 'http-status-codes';


export class CreateDocument {
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const createdBy = req.currentUser?.userId;

      if (!createdBy) {
        res.status(HTTP_STATUS.OK).json({ error: 'User not authenticated' });
        return;
      }

      const savedDocument = await documentService.createDocument(createdBy);

      res.status(HTTP_STATUS.CREATED).json({ message: 'Document created successfully', document: savedDocument });
    } catch (error: any) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: `Unable to create document: ${error.message}` });
    }
  }
}
