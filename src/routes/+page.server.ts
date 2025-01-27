import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';


export const load: PageServerLoad = async ({ locals }) => {
  if (locals.user) {
    throw redirect(307, '/hash');
  } else {
    throw redirect(307, '/login');
  }
}
