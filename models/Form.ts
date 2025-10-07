import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IFormField {
  id: string;
  type: 'text' | 'textarea' | 'radio' | 'checkbox' | 'dropdown' | 'date' | 'rating';
  label: string;
  placeholder?: string;
  options?: string[];
  required?: boolean;
}

export interface IForm extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  template: 'minimal' | 'bordered' | 'modern';
  fields: IFormField[];
  createdAt: Date;
  updatedAt: Date;
}

const FormFieldSchema = new Schema({
  id: { type: String, required: true },
  type: {
    type: String,
    enum: ['text', 'textarea', 'radio', 'checkbox', 'dropdown', 'date', 'rating'],
    required: true,
  },
  label: { type: String, required: true },
  placeholder: { type: String },
  options: [{ type: String }],
  required: { type: Boolean, default: false },
});

const FormSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Form title is required'],
  },
  template: {
    type: String,
    enum: ['minimal', 'bordered', 'modern'],
    default: 'minimal',
  },
  fields: [FormFieldSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

FormSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

const Form: Model<IForm> = mongoose.models.Form || mongoose.model<IForm>('Form', FormSchema);

export default Form;

