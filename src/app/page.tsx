import { redirect } from 'next/navigation';
import { APP_ROUTES } from '@/constants/app-constants';

export default function Home() {
  redirect(APP_ROUTES.ITEMS);
}
