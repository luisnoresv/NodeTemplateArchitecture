import { Schema, model, Document } from 'mongoose';

export const DOCUMENT_NAME = 'Todo';
export const COLLECTION_NAME = 'todos';

export default interface Todo extends Document {
	text: string;
}

const schema = new Schema({
	text: {
		type: String,
		required: true,
	},
});

export const TodoModel = model<Todo>(DOCUMENT_NAME, schema, COLLECTION_NAME);
