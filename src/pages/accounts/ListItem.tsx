import { Link } from "@solidjs/router";
import { Component, createSignal, For } from "solid-js";
import { Account } from "../../types";

type ListItemProps = {
    account: Account;
    depth: number;
    delete: (id: number) => Promise<void>;
}

const ListItem: Component<ListItemProps> = (props: ListItemProps) => {
    const [loading, setLoading] = createSignal(false);

    async function deleteAccount() {
        setLoading(true);
        props.delete(props.account.ID);
    }

    return (
        <>
            <tr>
                <td style={{ 'padding-left': `${props.depth * 1.5}rem` }}>{props.account.name}</td>
                <td>
                    <div class="d-flex gap-2 justify-content-end align-items-center">
                        <Link class="btn btn-sm btn-primary" href={`/accounts/edit/${props.account.ID}`}>
                            Edit
                        </Link>

                        <button
                            type="button"
                            class="btn btn-sm btn-danger"
                            disabled={loading()}
                            onClick={deleteAccount}
                        >
                            Delete
                        </button>
                    </div>
                </td>
            </tr>
            <For each={props.account.children}>{child =>
                <ListItem account={child} depth={props.depth + 1} delete={props.delete} />
            }</For>
        </>
    );
}

export default ListItem;
