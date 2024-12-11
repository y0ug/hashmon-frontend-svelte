import { getHashDetail, deleteHash } from '$lib/api';
import type { PageServerLoad, Actions } from './$types';


export const load: PageServerLoad = async ({ params, fetch }) => {
  return await getHashDetail(fetch, params.sha256);
};


