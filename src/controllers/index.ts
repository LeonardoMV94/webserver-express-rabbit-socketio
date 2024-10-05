import { Router } from 'express';
import type { Application, Response, Request } from 'express';
import UserController from './user.controller';

export class RoutesExpress {
    private router: Router;
    private app: Application;
    private static instance: RoutesExpress;

    constructor(app: Application) {
        this.app = app;
        this.router = Router();
        this.configurarRutas();
        this.app.use(this.router);
    }


    public static getInstance(app: Application): RoutesExpress {
        if (!RoutesExpress.instance) {
            RoutesExpress.instance = new RoutesExpress(app);
        }
        return RoutesExpress.instance;
    }

    private configurarRutas(): void {
        this.app.use('/api/v1', this.router);
        this.router.get('/health', this.healthCheck);
        // Aquí se añadirán las rutas específicas
        // this.app.use('/api/v1', UserRouter)
        this.router.use('/users', UserController);
    }

    private healthCheck(req: Request, res: Response): void {
        res.status(200).json({
            status: 'ok',
            message: 'Server is running'
        });
    }

    public obtenerRouter(): Router {
        return this.router;
    }
}
