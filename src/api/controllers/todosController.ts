import { BadRequestError, NotFoundError } from '@api/responses/ApiError';
import {
	SuccessMsgResponse,
	SuccessResponse,
} from '@api/responses/ApiResponse';
import asyncHandler from '@api/middleware/asyncHandler';
import Todo from '@infrastructure/models/Todos';
import TodoService from '@infrastructure/services/TodoService';
import { Router, Request, Response, NextFunction } from 'express';

type RequestBody = { text: string };

type RequestParams = { id: string };

/**
 * @description Get All Todos
 * @route GET api/v1/todos
 * @access Public
 */
exports.getTodos = asyncHandler(async (req: Request, res: Response) => {
	const todos = await TodoService.fetchAll();

	if (!todos) throw new BadRequestError('Not Found');

	new SuccessResponse('success', todos).send(res);
});

export default class TodosController {
	static geTodos = asyncHandler(async (req: Request, res: Response) => {
		const todos = await TodoService.fetchAll();

		if (!todos) throw new BadRequestError('Not Found');

		new SuccessResponse('success', todos).send(res);
	});

	static getTodo = asyncHandler(async (req: Request, res: Response) => {
		const { id } = req.params as RequestParams;
		const todo = await TodoService.findById(id);

		if (!todo) new NotFoundError('Todo does not exist');

		new SuccessResponse('success', todo).send(res);
	});

	static addTodo = asyncHandler(
		async (req: Request, res: Response, next: NextFunction) => {
			const body = req.body as RequestBody;

			const createdTodo = await TodoService.create({
				text: body.text,
			} as Todo);

			new SuccessResponse('Todo successfully created', createdTodo).send(res);
		}
	);

	static updateTodo = asyncHandler(
		async (req: Request, res: Response, next: NextFunction) => {
			const { id } = req.params as RequestParams;

			const body = req.body as RequestBody;

			const todoFromDB = await TodoService.findById(id);

			if (!todoFromDB) throw new NotFoundError('Todo does not exist');

			todoFromDB.text = body.text;

			const todoUpdated = await TodoService.update(todoFromDB);

			new SuccessResponse('Todo successfully updated', todoUpdated).send(res);
		}
	);

	static deleteTodo = asyncHandler(
		async (req: Request, res: Response, next: NextFunction) => {
			const { id } = req.params as RequestParams;

			const todoFromDB = await TodoService.findById(id);

			if (!todoFromDB) throw new NotFoundError('Todo does not exist');

			await TodoService.delete(id);

			return new SuccessMsgResponse('Todo deleted successfully').send(res);
		}
	);
}
