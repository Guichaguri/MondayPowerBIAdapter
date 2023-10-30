import express from 'express';
import { connectDatabase } from './database/connectDatabase';
import { getItemsV1Endpoint } from './endpoints/v1/items';
import { generateTokenEndpoint } from './endpoints/generateToken';
import { checkHealth } from './endpoints/checkHealth';
import { environment } from './environment/environment';

export async function initialize() {
  const db = await connectDatabase()
    .catch(error => { console.error(error); return null; });

  const app = express();

  app.use(express.static('public'));
  app.use(express.json());

  app.get('/health', checkHealth);
  app.post('/token', generateTokenEndpoint.bind(null, db));
  app.get('/1/items', getItemsV1Endpoint.bind(null, db));

  app.listen(environment.PORT);
}

initialize();
