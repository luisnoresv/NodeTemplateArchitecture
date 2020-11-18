import mongoose from 'mongoose';
import { db } from '@config';

const dbURI = `mongodb://${db.user}:${db.password}@${db.host}:${db.port}/${db.name}?retryWrites=true&w=majority`;

const connectDB = async () => {
	const mongoCn = await mongoose.connect(dbURI, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false,
		useUnifiedTopology: true,
		autoIndex: true,
		poolSize: 10, // Maintain up to 10 socket connections
		// If not connected, return errors immediately rather than waiting for reconnect
		bufferMaxEntries: 0,
		connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
		socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
	});

	console.log(`MongoDB Connected: ${mongoCn.connection.host}`);
};

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', () => {
	console.info('Mongoose default connection open to ' + db.host);
});

// If the connection throws an error
mongoose.connection.on('error', (err) => {
	console.error('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', () => {
	console.info('Mongoose default connection disconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', () => {
	mongoose.connection.close(() => {
		console.info(
			'Mongoose default connection disconnected through app termination'
		);
		process.exit(0);
	});
});

export default connectDB;
