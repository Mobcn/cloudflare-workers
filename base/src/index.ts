import { Hono } from 'hono';
import d1 from './demo-d1database';
import r2 from './demo-r2';

const app = new Hono<{ Bindings: Env }>();

app.get('/', (c) => {
	return c.text('Hello Hono!');
});

app.route('/d1', d1);
app.route('/r2', r2);

export default app;
