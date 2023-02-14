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
    this.app.use(cors());
    this.app.use(function (req, res, next) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Access-Control-Allow-Methods', 'GET,POST');
      next();
    });
  }

  setupRouters() {
    this.app.post('/generate', async (req, res) => {
      try {
        const archive = await generate(req.body);
        return res.status(200).json({ path: archive });
      } catch (error) {
        console.log(error);
        return res.status(500).send(error.message);
      }
    });

    this.app.get('/templates/get', async (req, res) => {
      try {
        return res.status(200).json(getTemplateNames());
      } catch (error) {
        console.log(error);
        return res.status(500).send(error.message);
      }
    });

    this.app.post('/templates/details', async (req, res) => {
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
