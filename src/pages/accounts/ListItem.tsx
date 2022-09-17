import { Link } from "@solidjs/router";
import { Component, createSignal, For } from "solid-js";
import { useStore } from "../../store";
import { Account, AccountType } from "../../types";

type ListItemProps = {
    account: Account;
    depth: number;
}

const ListItem: Component<ListItemProps> = (props: ListItemProps) => {
    const { accounts } = useStore();
    const [loading, setLoading] = createSignal(false);

    async function remove() {
        setLoading(true);
        accounts.delete(props.account.ID);
    }

    return (
        <>
            <tr>
                <td style={{ 'padding-left': `${props.depth * 1.5}rem` }}>{props.account.name}</td>
                <td>{AccountType[props.account.type]}</td>
                <td>
                    <div class="d-flex gap-2 justify-content-end align-items-center">
                        <Link class="btn btn-sm btn-primary" href={`/accounts/edit/${props.account.ID}`}>
                            Edit
                        </Link>

                        <button
                            type="button"
                            class="btn btn-sm btn-danger"
                            disabled={loading()}
                            onClick={remove}
                        >
                            Delete
                        </button>
                    </div>
                </td>
            </tr>
            <For each={props.account.children}>{child =>
                <ListItem account={child} depth={props.depth + 1} />
            }</For>
        </>
    );
}

export default ListItem;
