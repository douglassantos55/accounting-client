import { Link } from "@solidjs/router";
import { Component, For } from "solid-js";
import Button from "../../components/Button";
import { useStore } from "../../store";
import { Account, AccountType } from "../../types";

type ListItemProps = {
    account: Account;
    depth: number;
}

const ListItem: Component<ListItemProps> = (props: ListItemProps) => {
    const { accounts } = useStore();

    return (
        <>
            <tr>
                <td style={{ 'padding-left': `${props.depth * 1.5}rem` }}>{props.account.Name}</td>
                <td>{AccountType[props.account.Type]}</td>
                <td>{props.account.Balance}</td>
                <td>
                    <div class="d-flex gap-2 justify-content-end align-items-center">
                        <Link class="btn btn-sm btn-primary" href={`/accounts/edit/${props.account.ID}`}>
                            Edit
                        </Link>

                        <Button
                            type="button"
                            class="btn btn-sm btn-danger"
                            onClick={() => accounts.delete(props.account.ID)}
                        >
                            Delete
                        </Button>
                    </div>
                </td>
            </tr>
            <For each={props.account.Children}>{child =>
                <ListItem account={child} depth={props.depth + 1} />
            }</For>
        </>
    );
}

export default ListItem;
