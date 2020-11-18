import { Router } from 'express';

import TodosController from '@api/controllers/todosController';

const router = Router();

router.get('/', TodosController.geTodos);

router.get('/:id', TodosController.getTodo);

router.post('/', TodosController.addTodo);

router.put('/:id', TodosController.updateTodo);

router.delete('/:id', TodosController.deleteTodo);

export default router;
