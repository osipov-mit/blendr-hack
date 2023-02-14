import express, { json, Express } from 'express';
import cors from 'cors';

import config from './config';
import { generate, getTemplateDetails, getTemplateNames } from './services';

export class Server {
  app: Express;

  constructor() {
    this.app = express();
    this.setupMiddleware();
    this.setupRouters();
  }

  public run() {
    this.app.listen(config.port, () => {
      console.log(`Server is running on port ${config.port} 🚀`);
    });
  }

  setupMiddleware() {
    this.app.use(json());
    this.app.use(cors({ origin: '*', credentials: false }));
  }

  setupRouters() {
    this.app.post('/generate', async (req, res) => {
      console.log('/templates/generate -> body:', req.body);
      try {
        const archive = await generate(req.body);
        return res.status(200).json({ path: archive });
      } catch (error) {
        console.log(error);
        return res.status(500).send(error.message);
      }
    });

    this.app.get('/templates/get', async (req, res) => {
      console.log('/templates/get -> body:', req.body);
      try {
        return res.status(200).json(getTemplateNames());
      } catch (error) {
        console.log(error);
        return res.status(500).send(error.message);
      }
    });

    this.app.post('/templates/details', async (req, res) => {
      console.log('/templates/details -> body:', req.body);
      try {
        if (!req.body.template) {
          throw new Error(`Template name isn't provided`);
        }
        return res.status(200).json(getTemplateDetails(req.body.template));
      } catch (error) {
        console.log(error);
        return res.status(400).send(error.message);
      }
    });
  }
}
