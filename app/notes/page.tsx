
import { getUser } from "../libs/action";
import Notes from "./notes";

export default async function Page() {
    const user = await getUser();

    return (
        <div>
            <Notes user={user} />
        </div>
    );
}
