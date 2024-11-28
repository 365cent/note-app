
import { getUserCookie } from '../libs/action';
import Header from "../components/dashHeader";
import DashComponents from "./dash";

export default async function Page() {
    const user = await getUserCookie();

    const userNotNull = {
        username: user?.username?.value || '', // Ensure it is a string
        email: user?.email?.value || '', // Ensure it is a string
    };

    return (
        <div>
            <Header user={userNotNull} />
            <DashComponents user={userNotNull} />
        </div>
    );
}
