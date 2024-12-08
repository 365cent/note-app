import { getUserCookie } from '../libs/action';
import Settings from "./settings";

export default async function Page() {
    const userCookie = await getUserCookie();
    const user = userCookie ? {
        username: userCookie.username?.value || '',
        email: userCookie.email?.value || ''
    } : null;

    return (
        <div>
            <Settings user={user} />
        </div>
    );
}
