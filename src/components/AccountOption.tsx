import { Component, For, Index } from "solid-js";
import { Account } from "../types";

const AccountOption: Component<{ account: Account, depth: number }> = (props) => {
    return (
        <>
            <option value={props.account.ID}>
                <Index each={new Array(props.depth)}>{() =>
                    <span>&nbsp;&nbsp;</span>
                }</Index>
                {props.account.Name}
            </option>

            <For each={props.account.Children}>{(child: Account) =>
                <AccountOption account={child} depth={props.depth + 1} />
            }</For>
        </>
    );
}

export default AccountOption;
