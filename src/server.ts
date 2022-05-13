import express from 'express';
import cors from 'cors';
import { routes } from './routes/routes';

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

app.listen(process.env.port || 3333, () => {
  console.log('Server started on port 3333');
});