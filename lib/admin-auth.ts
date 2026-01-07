import { auth } from '@/auth';
import { redirect } from 'next/navigation';

const ALLOWED_EMAILS = [
  'nate.sena1@gmail.com',
  'jltk3260@gmail.com',
];

export async function requireAdminAuth() {
  const session = await auth();
  
  if (!session?.user) {
    redirect('/auth/signin?callbackUrl=/admin/products');
  }
  
  if (!ALLOWED_EMAILS.includes(session.user.email?.toLowerCase() ?? '')) {
    redirect('/?unauthorized=true');
  }
  
  return session;
}
