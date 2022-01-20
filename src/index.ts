import express from 'express';
import { connectDatabase } from './database/connectDatabase';
import { getItemsV1Endpoint } from './endpoints/v1/items';
import { generateTokenEndpoint } from './endpoints/generateToken';
import { environment } from './environment/environment';

export async function initialize() {
  const db = await connectDatabase();

  app.post('/token', generateTokenEndpoint.bind(null, db));
  app.get('/1/items', getItemsV1Endpoint.bind(null, db));
}

const app = express();

app.use(express.static('public'));
app.use(express.json());

initialize();

app.listen(environment.PORT);
