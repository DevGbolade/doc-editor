import { documentService } from '@root/shared/services/db/document.service';
import { Request, Response } from 'express';


export class GetUserDocuments {
  public async getUserDocuments(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.userId;

      const documents = await documentService.getUserDocuments(userId);

      res.status(200).json({ message: 'Documents retrieved successfully', documents });
    } catch (error: any) {
      const statusCode = error.message === 'Invalid user ID' ? 400 : 500;
      res.status(statusCode).json({ error: `Unable to retrieve documents: ${error.message}` });
    }
  }
}
