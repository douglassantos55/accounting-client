import { Component, For, Index } from "solid-js";
import { Account } from "../types";

type Props = {
    account: Account;
    depth: number;
    selected?: number;
}

const AccountOption: Component<Props> = (props) => {
    return (
        <>
            <option value={props.account.ID} selected={props.account.ID == props.selected}>
                <Index each={new Array(props.depth)}>{() =>
                    <span>&nbsp;&nbsp;</span>
                }</Index>
                {props.account.Name}
            </option>

            <For each={props.account.Children}>{(child: Account) =>
                <AccountOption account={child} depth={props.depth + 1} selected={props.selected} />
            }</For>
        </>
    );
}

export default AccountOption;
