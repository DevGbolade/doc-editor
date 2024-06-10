import mongoose, { Model, model } from "mongoose";
const { Schema } = mongoose;

interface ICollaborator {
  userId:  mongoose.Types.ObjectId;
  accessLevel: 'owner' | 'editor' | 'viewer';
}

export interface IDocument extends Document {
  [x: string]: any;
  data: Record<string, any>;
  createdBy: mongoose.Types.ObjectId;
  collaborators?: ICollaborator[];
  history?: {
    version: number;
    changes: string;
    changedBy: mongoose.Types.ObjectId;
    changedAt: Date;
  }[];

}

const documentSchema = new Schema({
  data: Object,

  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'Auth',
    required: true
  },

  collaborators: [
    {
        userId: { type: Schema.Types.ObjectId, ref: 'Auth' },
        accessLevel: { type: String, enum: ['owner', 'editor', 'viewer'] }
    },
    
  ],

  history: [
        {
            version: { type: Number, required: true },
            changes: { type: String, required: true },
            changedBy: { type: Schema.Types.ObjectId, ref: 'Auth' },
            changedAt: { type: Date, default: Date.now }
        }
    ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});


const DocumentModel: Model<IDocument> = model<IDocument>('Document', documentSchema, 'Document');
export { DocumentModel };
