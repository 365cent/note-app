import { getUserCookie } from '../signup/action';
import Header from '../components/header';

export default async function HeaderWrapper() {
  const user = await getUserCookie();

  const userNotNull = {
    username: user?.username?.value || '', // Ensure it is a string
    email: user?.email?.value || '', // Ensure it is a string
  };

  return <Header user={userNotNull} />;
}
