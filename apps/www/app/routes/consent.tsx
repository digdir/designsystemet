import { redirect } from 'react-router';
import { CONSENT_VERSION, userConsent } from '~/_utils/cookies';
import type { Route } from './+types/consent';

export async function action({ request }: Route.ActionArgs) {
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const formData = await request.formData();
  const choice = formData.get('action');
  const referrer = request.headers.get('referer') || '/';

  let cookieHeader: string;
  if (choice === 'delete') {
    cookieHeader = await userConsent.serialize('', {
      maxAge: 0,
    });
  } else {
    cookieHeader = await userConsent.serialize({
      choice,
      version: CONSENT_VERSION,
    });
  }

  return redirect(referrer, {
    headers: {
      'Set-Cookie': cookieHeader,
    },
  });
}
