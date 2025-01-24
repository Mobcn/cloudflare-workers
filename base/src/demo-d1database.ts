import { Hono } from 'hono';

const d1 = new Hono<{ Bindings: Env }>();

d1.get('/api/customer/search', async (c) => {
	const name = c.req.query('name');
	if (!name) {
		return c.text('no param [name]!');
	}
	const { results } = await c.env.DB.prepare('SELECT * FROM Customers WHERE CompanyName = ?').bind(name).all();
	return c.json(results);
});
d1.get('*', (c) => c.text('Call /d1/api/customer/search to see everyone who works at Bs Beverages'));

export default d1;
