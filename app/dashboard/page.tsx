
import { getUserCookie } from '../libs/action';
import Dashboard from "./dash";

export default async function Page() {
    const userCookie = await getUserCookie();
    const user = userCookie ? {
        username: userCookie.username?.value || '',
        email: userCookie.email?.value || ''
    } : null;

    return (
        <div>
            <Dashboard user={user} />
        </div>
    );
}
