import express,{ Express, type Application, Router } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from '../config/env.config';
import { RoutesExpress } from '../controllers';
import { loggerRequestMiddleware } from '../middlewares/log.middleware';

export class ExpressService {
  private static instance: ExpressService;
  private app: Application;
  private router: Router;

  private constructor() {
    this.app = express();
    this.configureMiddlewares();
    this.router = RoutesExpress.getInstance(this.app).obtenerRouter();
    this.app.use(this.router);
  }

  public static getInstance(): ExpressService {
    if (!ExpressService.instance) {
      ExpressService.instance = new ExpressService();
    }
    return ExpressService.instance;
  }

  private configureMiddlewares(): void {
    this.app.use(cors());
    this.app.use(helmet());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }))
    this.app.use(loggerRequestMiddleware);
  }

  public getApp(): Application {
    return this.app;
  }

  public start(): void {
    this.app.listen(env.PORT, () => {
      console.log(`Express server listening on port http://localhost:${env.PORT}`);
    });
  }
}


