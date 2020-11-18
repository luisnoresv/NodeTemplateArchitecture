import Todo, { TodoModel } from '@infrastructure/models/Todos';
import { Types } from 'mongoose';

export default class TodoService {
	public static fetchAll(): Promise<Todo[] | null> {
		return TodoModel.find().lean<Todo>().exec();
	}

	public static findById(id: string): Promise<Todo | null> {
		return TodoModel.findById(new Types.ObjectId(id)).lean<Todo>().exec();
	}

	public static async create(todo: Todo): Promise<Todo> {
		const createdTodo = await TodoModel.create(todo);
		return createdTodo.toObject();
	}

	public static update(todo: Todo): Promise<Todo | null> {
		return TodoModel.findByIdAndUpdate(todo._id, todo, {
			new: true,
			runValidators: true,
		})
			.lean<Todo>()
			.exec();
	}

	public static delete(id: string): Promise<Todo | null> {
		return TodoModel.findByIdAndRemove(new Types.ObjectId(id))
			.lean<Todo>()
			.exec();
	}
}
