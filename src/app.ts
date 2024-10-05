import { ExpressService } from './services/express.services';

const app = ExpressService.getInstance();
app.start()