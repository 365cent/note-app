import { getUserCookie } from '../signup/action';
import HeaderWrap from './frontheader';

export default async function Header() {
  const user = await getUserCookie();

  const userNotNull = {
    username: user?.username?.value || '', // Ensure it is a string
    email: user?.email?.value || '', // Ensure it is a string
  };

  return <HeaderWrap user={userNotNull} />;
}
