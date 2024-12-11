import { invalidateAll } from '$app/navigation';
import { apiFetch, getLogout } from '$lib/api';
import type { Actions } from './$types';
import { redirect } from '@sveltejs/kit';

export const actions = {
  default: async (event) => {
    await getLogout(event.fetch);
    event.cookies.delete('access_token', { path: '/' });
    event.cookies.delete('refresh_token', { path: '/' });
    event.locals.user = null;
    invalidateAll();
    redirect(302, '/');
  },

} satisfies Actions;

