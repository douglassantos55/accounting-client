import { Link } from "@solidjs/router";
import { Component, For } from "solid-js";
import { Account } from "../../types";

type ListItemProps = {
    account: Account;
    depth: number;
}

const ListItem: Component<ListItemProps> = (props: ListItemProps) => {
    return (
        <>
            <tr>
                <td style={{ 'padding-left': `${props.depth * 1.5}rem` }}>{props.account.name}</td>
                <td>
                    <div class="d-flex gap-2 justify-content-end align-items-center">
                        <Link class="btn btn-sm btn-primary" href={`/accounts/${props.account.ID}`}>
                            Edit
                        </Link>

                        <button type="button" class="btn btn-sm btn-danger">
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
