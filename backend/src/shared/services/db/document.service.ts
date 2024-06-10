
import { DocumentModel, IDocument } from '@root/models/document';
import mongoose from 'mongoose';
import Delta from 'quill-delta';

const defaultContent = new Delta().insert('Welcome to the collaborative editor!\n');



class DocumentService {
  public async updateDocument(documentId: string, data: Record<string, any>): Promise<any> {
    if (!mongoose.Types.ObjectId.isValid(documentId)) {
      throw new Error('Invalid document ID');
    }

    const objectIdDocumentId = new mongoose.Types.ObjectId(documentId);
    const updatedDocument = await DocumentModel.findByIdAndUpdate(
      objectIdDocumentId,
      { data },
      { new: true, runValidators: true }
    ).populate('collaborators').populate('createdBy').exec();

    if (!updatedDocument) {
      throw new Error('Document not found');
    }

    return updatedDocument;
  }


  public async getDocumentById(documentId: string, userId: string): Promise<IDocument | null> {
    if (!mongoose.Types.ObjectId.isValid(documentId)) {
      throw new Error('Invalid document ID');
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid user ID');
    }

    const objectIdDocumentId = new mongoose.Types.ObjectId(documentId);
    const objectIdUserId = new mongoose.Types.ObjectId(userId);

    const document = await DocumentModel.findOne({
      _id: objectIdDocumentId,
      $or: [
        { createdBy: objectIdUserId },
        { 'collaborators.userId': objectIdUserId, 'collaborators.accessLevel': 'editor' }
      ]
    }).populate('collaborators.userId').exec();

    return document;
  }

  public async findOneDocument(documentId: string): Promise<IDocument | null> {
    if (!mongoose.Types.ObjectId.isValid(documentId)) {
      throw new Error('Invalid document ID');
    }
  

    const objectIdDocumentId = new mongoose.Types.ObjectId(documentId);

    const document = await DocumentModel.findOne({
      _id: objectIdDocumentId,
    }).populate('collaborators').exec();

    return document;
  }

  public async createDocument(createdBy: string, data?: string): Promise<IDocument> {
    const document = new DocumentModel({
      createdBy: new mongoose.Types.ObjectId(createdBy),
      data: data ?? defaultContent,
      collaborators: [{ userId: new mongoose.Types.ObjectId(createdBy), accessLevel: 'owner' }],
    });
    return document.save();
  }

  public async inviteUserToDocument(documentId: string, userId: string): Promise<IDocument | null> {
    if (!mongoose.Types.ObjectId.isValid(documentId)) {
      throw new Error('Invalid document ID');
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid user ID');
    }

    const objectIdDocumentId = new mongoose.Types.ObjectId(documentId);
    const objectIdUserId = new mongoose.Types.ObjectId(userId);

    const updatedDocument = await DocumentModel.findByIdAndUpdate(
      objectIdDocumentId,
      { $addToSet: { collaborators: { userId: objectIdUserId, accessLevel: 'editor' } } },
      { new: true, runValidators: true }
    ).populate('collaborators.userId').exec();

    if (!updatedDocument) {
      throw new Error('Document not found');
    }

    return updatedDocument;
  }   
  
  public async getUserDocuments(userId: string): Promise<IDocument[]> {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid user ID');
    }

    const objectIdUserId = new mongoose.Types.ObjectId(userId);

    return DocumentModel.find({ 'collaborators.userId': objectIdUserId }).exec();
  }
}

export const documentService = new DocumentService();
