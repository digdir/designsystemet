import { redirect } from 'react-router';

export default function SlackRedirect() {
  return redirect(process.env.SLACK_INVITE_URL ?? 'https://designsystemet.no');
}
