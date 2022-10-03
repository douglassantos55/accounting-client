import { Component, createMemo, createSignal, For, onMount, Show } from "solid-js";
import { useStore } from "../../store";
import { Account, AccountType } from "../../types";

type ItemProps = {
    account: Account;
    depth: number;
}

const Item: Component<ItemProps> = (props: ItemProps) => {
    return (
        <>
            <tr>
                <td style={{ 'padding-left': `${props.depth * 1.5}rem` }}>{props.account.Name}</td>
                <td class="text-end">{props.account.Balance}</td>
            </tr>
            <For each={props.account.Children}>{child =>
                <Item account={child} depth={props.depth + 1} />
            }</For>
        </>
    );
}

function formatDate(date: Date): string {
    return date.toISOString().substring(0, 10);
}

const BalanceSheet: Component = function() {
    const { accounts } = useStore();
    const [date, setDate] = createSignal(formatDate(new Date()));

    onMount(accounts.fetchAll);

    const liabilities = createMemo(function() {
        return accounts.balance(accounts.hierarchical().filter(function(account: Account) {
            return [AccountType.Equity, AccountType.Liability].includes(account.Type);
        }), '', date());
    });

    function getBalance(accounts: Account[]): number {
        return accounts.reduce(function(carry: number, account: Account) {
            return carry + account.Balance + getBalance(account.Children as Account[]);
        }, 0);
    }

    const totalLiabilities = createMemo(function() {
        return getBalance(liabilities());
    });

    const assets = createMemo(function() {
        return accounts.balance(accounts.hierarchical().filter(function(account: Account) {
            return account.Type == AccountType.Asset;
        }), '', date());
    });

    const totalAssets = createMemo(function() {
        return getBalance(assets());
    });

    return (
        <div class="container py-4">
            <div class="d-flex align-items-center">
                <h1 class="mb-4">Balance sheet</h1>

                <input
                    type="date"
                    class="ms-auto form-control w-auto"
                    value={date()}
                    onChange={(e: any) => setDate(e.target.value)}
                />
            </div>

            <Show when={accounts.state.fetched} fallback={<p>Loading accounts...</p>}>
                <table class="table">
                    <tbody>
                        <For each={assets()}>{(account: Account) =>
                            <Item account={account} depth={0} />
                        }</For>
                        <tr>
                            <td><strong>Total assets</strong></td>
                            <td class="text-end"><strong>{totalAssets}</strong></td>
                        </tr>

                        <For each={liabilities()}>{(account: Account) =>
                            <Item account={account} depth={0} />
                        }</For>
                        <tr>
                            <td><strong>Total liabilities + equity</strong></td>
                            <td class="text-end"><strong>{totalLiabilities}</strong></td>
                        </tr>
                    </tbody>
                </table>
            </Show>
        </div>
    );
}
export default BalanceSheet;
