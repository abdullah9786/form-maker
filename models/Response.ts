import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IResponse extends Document {
  formId: mongoose.Types.ObjectId;
  answers: Record<string, any>;
  createdAt: Date;
}

const ResponseSchema: Schema = new Schema({
  formId: {
    type: Schema.Types.ObjectId,
    ref: 'Form',
    required: true,
  },
  answers: {
    type: Schema.Types.Mixed,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Response: Model<IResponse> = mongoose.models.Response || mongoose.model<IResponse>('Response', ResponseSchema);

export default Response;

