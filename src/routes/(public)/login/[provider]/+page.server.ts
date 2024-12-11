import type { Actions } from './$types';
import { redirect } from '@sveltejs/kit';

export const actions = {
  default: async (event) => {
    const encodedRedirect = encodeURIComponent("http://127.0.0.1:5173");
    const loginURL = `http://127.0.0.1:8808/auth/login/${event.params.provider}?rd=${encodedRedirect}`;
    console.log('loginURL', loginURL);
    redirect(302, loginURL);
  }
} satisfies Actions;
