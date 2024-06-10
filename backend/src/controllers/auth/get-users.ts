import { authService } from '@root/shared/services/db/auth.service';
import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';
// import mongoose from 'mongoose';

function convertMongoDocument(doc: any) {
  return {
    _id: doc._id.toString(),
    username: doc.username,
    email: doc.email,
    password: doc.password,
    passwordResetToken: doc.passwordResetToken,
    createdAt: doc.createdAt.toISOString(),
    __v: doc.__v,
    documents: doc.documents,
  };
}

function convertMongoDocuments(docs: any[]) {
  return docs.map(convertMongoDocument);
}

export class GetUsers {
  public async read(req: Request, res: Response): Promise<void> {
    try {
      const currentUserId = req.currentUser;
      const users = await authService.getAllUsers();

      if (!users) {
        res.status(404).json({ error: 'users not found or access denied' });
        return;
      }
      const convertedUsers = convertMongoDocuments(users);
      const filteredUsers = convertedUsers.filter(user => user._id !== currentUserId);

      


      res.status(200).json({ message: 'Users retrieved successfully', users: filteredUsers });
    } catch (error: any) {
      const statusCode = error.message === 'Invalid document ID' ? HTTP_STATUS.NOT_FOUND : HTTP_STATUS.INTERNAL_SERVER_ERROR;
      res.status(statusCode).json({ error: `Unable to retrieve document: ${error.message}` });
    }
  }
}
