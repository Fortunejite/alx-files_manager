import includeRoutes from './routes/index';

const express = require('express');

const app = express();
app.use(express.json());

includeRoutes(app);

app.listen(process.env.PORT || 5000);
export default app;
