import https from 'https';
import { environment } from '../environment/environment';

export async function fetchMondayQuery<T>(key: string, query: string): Promise<T> {
  const data = JSON.stringify({query: query});

  console.log(data);

  const body = await postMondayRequest(key, data);

  return parseMondayResponse(body);
}

function postMondayRequest(key: string, data: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const req = https.request(environment.MONDAY_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        'Authorization': 'Bearer ' + key,
      }
    }, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.once('end', () => resolve(body));
    });

    req.once('error', (err) => reject(err));
    req.end(data);
  });
}

function parseMondayResponse<T>(body: string): T {
  if (!body)
    throw new Error('Empty monday.com response');

  const response = JSON.parse(body) as { data?: T, errors?: { message: string }[] };

  if (response?.data)
    return response.data;

  console.log(response?.errors);

  if (response?.errors)
    throw new Error(response.errors.map(error => error.message).join('\n'));

  throw new Error('Invalid monday.com response');
}
