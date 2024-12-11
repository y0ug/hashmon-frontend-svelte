import { getAuthStatus } from '$lib/api';
import type { LayoutLoad } from './$types';

// export const ssr = false;

export const load: LayoutLoad = async ({ fetch }) => {
  try {
    const user = await getAuthStatus(fetch);
    if (user) {
      return { user: user.user }
    }
  } catch (e) {
  }
  return { user: null }
};
