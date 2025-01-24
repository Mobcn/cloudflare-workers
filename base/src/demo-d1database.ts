import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client';
import { PrismaD1 } from '@prisma/adapter-d1';

declare module 'hono' {
	interface ContextVariableMap {
		prisma: PrismaClient<{ adapter: PrismaD1 }>;
	}
}

const d1 = new Hono<{ Bindings: Env }>();

d1.use('*', async (c, next) => {
	const adapter = new PrismaD1(c.env.DB);
	const prisma = new PrismaClient({ adapter, log: ['query', 'info', 'warn'] });
	c.set('prisma', prisma);
	await next();
});

d1.get('/api/customer/search', async (c) => {
	const name = c.req.query('name');
	if (!name) {
		return c.text('no param [name]!');
	}
	const prisma = c.get('prisma');
	const findList = await prisma.customers.findMany({ where: { CompanyName: { contains: name } } });
	return c.json(findList);
});
d1.get('*', (c) => c.text('Call /d1/api/customer/search to see everyone who works at Bs Beverages'));

export default d1;
