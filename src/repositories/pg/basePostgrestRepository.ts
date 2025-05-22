export async function fetchFromPostgrest<T>(endpoint: string, params?: Record<string, string | number>): Promise<T[]> {
  const baseUrl = process.env.REACT_APP_POSTGREST_URL || '';
  const url = new URL(`${baseUrl}/${endpoint}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, 'eq.' + String(value));
    });
  }

  const response = await fetch(url.toString(), {
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`PostgREST fetch error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function postToPostgrest<T>(endpoint: string, data: T): Promise<any> {

  let cleanData = data;
  let filter = '';
  let prefer = '';
  if ((data as any)['id'] != null) {
    const { id, ...rest } = data as any;
    cleanData = id != null ? { ...rest, id } : rest;
    filter = `id=eq.${id}`;
    prefer = 'resolution=merge-duplicates';
  }
  else{
    prefer = 'return=representation';
  }

  const baseUrl = process.env.REACT_APP_POSTGREST_URL || '';
  const url = `${baseUrl}/${endpoint}?${filter}`;
  console.log(JSON.stringify(cleanData));
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Prefer': prefer,
    },
    body: JSON.stringify(cleanData),
  });
  if (!response.ok) {
    throw new Error(`PostgREST POST error: ${response.status} ${response.statusText}`);
  }
  console.log("OK");
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return response.json();
  }
  return Promise.resolve([data]);
} 