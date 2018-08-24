import 'dotenv/config';
import express from 'express';
import next from 'next';

// Process Environments
const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = express();

    server.get('/:listType(vergangen|in-vorbereitung|whats-hot)?/', (req, res) => {
      const actualPage = '/';
      const queryParams = { listType: req.params.listType || 'in-abstimmung' };
      app.render(req, res, actualPage, queryParams);
    });

    server.get('/:type(gesetzgebung|antrag)/:id/:title', (req, res) => {
      const actualPage = '/details';
      const queryParams = { id: req.params.id, title: req.params.title };
      app.render(req, res, actualPage, queryParams);
    });

    server.get('*', (req, res) => {
      return handle(req, res);
    });

    server.listen(PORT, err => {
      if (err) throw err;
      console.log(`> Ready on http://localhost:${PORT}`);
    });
  })
  .catch(ex => {
    console.error(ex.stack);
    process.exit(1);
  });
