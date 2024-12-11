import { getAllHashes, deleteHash, apiFetch, getAllHashesPagination } from '$lib/api';
import type { NewHash, HttpResp } from '$lib/types';
import type { PageServerLoad, Actions } from './$types';

// export const load: PageServerLoad = async ({ params, fetch, url }) => {
//   const pageParam = url.searchParams.get('page');
//   const perPageParam = url.searchParams.get('per_page');
//   const page = pageParam ? parseInt(pageParam, 10) : 1;
//   const perPage = perPageParam ? parseInt(perPageParam, 10) : 10;
//
//   return { data: await getAllHashesPagination(fetch, page, perPage) };
// }

export const actions = {
  create: async ({ request, fetch }) => {
    // Create a new hash entry
    const data = await request.formData();
    const newHash: NewHash = {
      "sha256": data.get("sha256") as string,
      "filename": data.get("filename") as string,
      "build_id": data.get("build_id") as string,
    }

    // Inject the cookie of the user
    // const cookie = event.request.headers.get("cookie") as string || "";

    const res = await apiFetch<HttpResp<null>>(fetch, "/api/hashes", {
      method: "PUT",
      // headers: { "Content-Type": "application/json", "Cookie": cookie },
      body: JSON.stringify(newHash),
      credentials: "include",

    });
    if (res.status !== "success") {
      return { success: false, error: res.message };
    }
    return { success: true }
  },
  delete: async ({ request, fetch }) => {
    const data = await request.formData();
    const sha256 = data.get("sha256") as string;
    const res = await deleteHash(fetch, sha256);
    return { success: true }
  }
} satisfies Actions;
