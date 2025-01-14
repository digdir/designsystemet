import { redirect } from 'next/navigation';

export default function Page() {
  redirect(process.env.SLACK_INVITE_URL ?? 'https://designsystemet.no');
}
