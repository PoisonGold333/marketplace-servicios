import express from 'express';
import providerRoutes from './routes/providerRoutes';

const app = express();

app.use('/api/providers', providerRoutes);

export default app;