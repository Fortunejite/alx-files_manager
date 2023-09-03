import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';

const includeRoutes = (app) => {
  app.get('/status', AppController.getStatus);
  app.get('/stats', AppController.getStats);
  app.post('/users', UsersController.postNew);
};
export default includeRoutes;
