import express, { Application, NextFunction, Request, Response } from 'express';
import 'module-alias/register';
import morgan from 'morgan';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import xss from 'xss-clean';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';
import cors from 'cors';

import todoRoutes from '@api/routes/v1/todos/todos.routes';

import { environment, port } from '@config';
import connectDB from '@infrastructure/database/db';
import {
	ApiError,
	InternalError,
	NotFoundError,
} from '@api/responses/ApiError';

const app: Application = express();

// Body Parser
app.use(express.json());

// Connect to database
connectDB();

// Dev logging middleware
if (environment === 'development') {
	app.use(morgan('dev'));
}

// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Rate limiting
const limiter = rateLimit({
	windowMs: 10 * 60 * 1000, // 10 mins
	max: 100,
});

app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Enable CORS
app.use(cors());

app.use('/api/v1/todos', todoRoutes);

app.listen(port, () =>
	console.info(`App running in ${environment} on ${port}`)
);

// catch 404 and forward to error handler
app.use((req, res, next) => next(new NotFoundError()));

// Middleware Error Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
	if (err instanceof ApiError) {
		ApiError.handle(err, res);
	} else {
		if (environment === 'development') {
			console.error(err);
			return res.status(500).send(err.message);
		}
		ApiError.handle(new InternalError(), res);
	}
});
