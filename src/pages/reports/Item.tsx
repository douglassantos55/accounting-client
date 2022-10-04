import { Component, For, Show } from "solid-js";
import { Account } from "../../types";

type ItemProps = {
    account: Account;
    depth: number;
}

const Item: Component<ItemProps> = (props: ItemProps) => {
    return (
        <>
            <tr>
                <td style={{ 'padding-left': `${props.depth * 1.5}rem` }}>{props.account.Name}</td>
                <td class="text-end">
                    <Show when={props.depth > 0}>
                        {props.account.Balance}
                    </Show>
                </td>
            </tr>
            <For each={props.account.Children}>{(child: Account) =>
                <Item account={child} depth={props.depth + 1} />
            }</For>
        </>
    );
}

export default Item;
