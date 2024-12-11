import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ fetch, parent, locals }) => {
  if (!locals.user) {
    redirect(303, '/login')
  }
}
