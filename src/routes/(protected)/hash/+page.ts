import { getAllHashesPagination, getStats } from '$lib/api';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, fetch, url, depends }) => {
  const pageParam = url.searchParams.get('page');
  const perPageParam = url.searchParams.get('per_page');
  const filterParam = url.searchParams.get('filter');
  const page = pageParam ? parseInt(pageParam, 10) : 1;
  const perPage = perPageParam ? parseInt(perPageParam, 10) : 10;
  const filter = filterParam ? filterParam : '';

  depends('app:hashes');
  return {
    data: await getAllHashesPagination(fetch, page, perPage, filter),
    stats: await getStats(fetch),
    currentFilter: filter,
  };
}
