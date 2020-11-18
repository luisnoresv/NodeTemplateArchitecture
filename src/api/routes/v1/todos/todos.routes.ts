import { Router, Request, Response, NextFunction } from 'express';

import { BadRequestError, NotFoundError } from '@api/responses/ApiError';
import {
	SuccessMsgResponse,
	SuccessResponse,
} from '@api/responses/ApiResponse';
import asyncHandler from '@api/middleware/asyncHandler';
import Todo from '@infrastructure/models/Todos';
import TodoService from '@infrastructure/services/TodoService';
import TodosController from '@api/controllers/todosController';

const router = Router();

router.get('/', TodosController.geTodos);

router.get('/:id', TodosController.getTodo);

router.post('/', TodosController.addTodo);

router.put('/:id', TodosController.updateTodo);

router.delete('/:id', TodosController.deleteTodo);

export default router;
