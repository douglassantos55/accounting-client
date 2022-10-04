import { Component, createMemo, createSignal, For, onMount, Show } from "solid-js";
import { useStore } from "../../store";
import { Account, AccountType } from "../../types";
import Item from "./Item";

const IncomeStatement: Component = function() {
    const { accounts } = useStore();
    const [date, setDate] = createSignal('');

    onMount(accounts.fetchAll);

    const revenue = createMemo(function() {
        return accounts.balance(accounts.hierarchical().filter(function(account: Account) {
            return account.Type == AccountType.Revenue;
        }), '', '');
    });

    const expenses = createMemo(function() {
        return accounts.balance(accounts.hierarchical().filter(function(account: Account) {
            return account.Type == AccountType.Expense;
        }), '', '');
    });

    const totalRevenue = createMemo(function() {
        return revenue().reduce(function(total: number, account: Account) {
            return total + account.Balance;
        }, 0);
    });

    const totalExpenses = createMemo(function() {
        return expenses().reduce(function(total: number, account: Account) {
            return total + account.Balance;
        }, 0);
    });

    const profit = createMemo(function() {
        return totalRevenue() - totalExpenses();
    });

    return (
        <div class="container py-4">
            <div class="d-flex align-items-center">
                <h1 class="mb-4">Income Statement</h1>

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
                        <For each={revenue()}>{(account: Account) =>
                            <Item account={account} depth={0} />
                        }</For>
                        <tr>
                            <td><strong>Total revenue</strong></td>
                            <td class="text-end"><strong>{totalRevenue}</strong></td>
                        </tr>

                        <For each={expenses()}>{(account: Account) =>
                            <Item account={account} depth={0} />
                        }</For>
                        <tr>
                            <td><strong>Total expenses</strong></td>
                            <td class="text-end"><strong>{totalExpenses}</strong></td>
                        </tr>
                        <tr>
                            <td><strong>Profit for period</strong></td>
                            <td class="text-end"><strong>{profit}</strong></td>
                        </tr>
                    </tbody>
                </table>
            </Show>
        </div>
    );
}

export default IncomeStatement;

