import { Hono } from 'hono';

const r2 = new Hono<{ Bindings: Env }>();

r2.on(['GET', 'PUT', 'DELETE'], '*', async (c) => {
	const key = c.req.path.substring(c.req.routePath.length - 1);
	if (!key) {
		return c.text('no file name', 500);
	}
	switch (c.req.method) {
		case 'GET':
			const object = await c.env.BUCKET.get(key);
			if (object === null) {
				return c.text('Object Not Found', 404);
			}
			const headers = new Headers();
			object.writeHttpMetadata(headers);
			headers.set('etag', object.httpEtag);
			return c.body(object.body, { headers });
		case 'PUT':
			await c.env.BUCKET.put(key, (await c.req.formData()).get('file'));
			return c.text(`Put ${key} successfully!`);
		case 'DELETE':
			await c.env.BUCKET.delete(key);
			return c.text('Deleted!');
		default:
			return c.text('Method Not Allowed', {
				status: 405,
				headers: {
					Allow: 'PUT, GET, DELETE',
				},
			});
	}
});

export default r2;
