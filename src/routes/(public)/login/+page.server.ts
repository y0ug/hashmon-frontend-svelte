import type { PageServerLoad } from './$types';
import { getLoginProvider } from '$lib/api';

export const load: PageServerLoad = async ({ fetch }) => {
  return { providers: await getLoginProvider(fetch) };
};
