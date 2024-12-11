import { error, type Handle } from '@sveltejs/kit';
import type { AuthStatusData, RefreshTokenData, User, HttpResp } from '$lib/types';
import { jwtDecode, type JwtPayload } from 'jwt-decode'

interface jwt extends JwtPayload {
  name: string
  email: string
  picture: string
  provider: string
}

export const handle: Handle = async ({ event, resolve }) => {
  const accessToken = event.cookies.get('access_token');
  const refreshToken = event.cookies.get('refresh_token');

  // console.log('handle accessToken', accessToken);
  // console.log('handle refreshToken', refreshToken);

  let user: User | null = null;
  if (!accessToken && !refreshToken) {
    // console.log('no tokens');
    event.locals.user = null;
    return await resolve(event);
  }

  if (!accessToken && refreshToken) {
    console.log('no accessToken try to refresh token');
    const refreshDecoded = jwtDecode<JwtPayload>(refreshToken);
    if (refreshDecoded && refreshDecoded.exp && refreshDecoded.exp > Date.now() / 1000) {
      console.log('refreshToken valid');

      // refresh the tokens and set the response-cookie on the response
      const res = await fetch('http://127.0.0.1:8808/auth/refresh', {
        method: 'GET',
        headers: { Authorization: `Bearer ${refreshToken}` }
      });

      if (res.ok) {
        let data = await res.json() as HttpResp<RefreshTokenData>;
        if (data.status === 'success' && data.data) {
          const accessDecoded = jwtDecode<jwt>(data.data.access_token);
          if (accessDecoded && accessDecoded.exp && accessDecoded.exp < Date.now() / 1000) {
            error(401, "received an expired access token")
          }

          // update event cookies
          // TODO:
          event.cookies.set('access_token', data.data.access_token, {
            httpOnly: true,
            secure: true,
            path: '/',
            sameSite: 'strict',
            // Add other cookie options as needed
          });
          user = {
            name: accessDecoded.name,
            email: accessDecoded.email,
            sub: accessDecoded.sub || '',
            picture: accessDecoded.picture,
          }
        }

        const resp = await resolve(event);
        try {
          const newCookies = res.headers.get('set-cookie') || '';
          resp.headers.set('Set-Cookie', newCookies);
          console.log('Set new cookies:', newCookies);

        } catch {
          console.error('Failed to set new cookies');
        }
        event.locals.user = user;
        return resp;
      } else {
        console.log('refresh failed');
        event.locals.user = null;
        // reset the cookies
        const resp = await resolve(event);
        resp.headers.set('Set-Cookie', 'access_token=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0, refresh_token=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0');
        return resp;
      }
    }
  }
  if (accessToken) {
    try {
      let accessDecoded = jwtDecode<jwt>(accessToken);
      if (accessDecoded && accessDecoded.exp && accessDecoded.exp < Date.now() / 1000) {
        console.log('accessToken expired');
      } else {
        user = {
          name: accessDecoded.name,
          email: accessDecoded.email,
          sub: accessDecoded.sub || '',
          picture: accessDecoded.picture,
        }
      }
    } catch (error) {
      console.error('Failed to decode JWT:', error)
    }
    // const res = await fetch('http://127.0.0.1:8808/auth/status', {
    //   headers: { Authorization: `Bearer ${accessToken}` }
    // });
    //
    // if (res.ok) {
    //   let data = await res.json() as HttpResp<AuthStatusData>;
    //   if (data.status === 'success' && data.data) {
    //     user = data.data.user;
    //   }
    // }
    event.locals.user = user;


  }
  return await resolve(event);
};
//
// export const handleFetch: HandleFetch = async ({ event, request, fetch }) => {
//   console.log('handleFetch', event.request.url);
//   console.log('handleFetch', event.request.headers.get('cookie'));
//
//
//   if (request.url.startsWith('https://127.0.0.1')) {
//     request.headers.set('cookie', event.request.headers.get('cookie') || "");
//   }
//
//   return fetch(request);
// };

