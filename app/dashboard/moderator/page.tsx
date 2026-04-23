// Moderator dashboard - redirects to admin dashboard
// This role has been merged with admin
import { redirect } from 'next/navigation';

export default function ModeratorPage() {
  redirect('/dashboard/admin');
}
