import { Link } from "@solidjs/router";
import { Component, For, Match, onMount, Switch } from "solid-js";
import Button from "../../components/Button";
import { useStore } from "../../store";
import { Entry, Transaction } from "../../types";

const List: Component = function() {
    const { entries } = useStore();

    onMount(entries.fetchAll);

    return (
        <div class="container py-4">
            <div class="d-flex align-items-center mb-4">
                <h1>Accounting entries</h1>

                <Link class="ms-auto btn btn-primary" href="/entries/create">
                    Create
                </Link>
            </div>

            <table class="table">
                <thead>
                    <tr>
                        <th>Description</th>
                        <th>Transactions</th>
                        <th>&nbsp;</th>
                    </tr>
                </thead>

                <tbody>
                    <Switch>
                        <Match when={!entries.state.fetched}>
                            <tr><td colspan="3">Fetching data, please wait...</td></tr>
                        </Match>
                        <Match when={entries.state.ids.length == 0}>
                            <tr><td colspan="3">No entries created yet.</td></tr>
                        </Match>
                        <Match when={entries.state.ids.length > 0}>
                            <For each={entries.all()}>{(entry: Entry) => (
                                <tr>
                                    <td>{entry.Description}</td>
                                    <td>
                                        <table class="table mb-0">
                                            <For each={entry.Transactions as Transaction[]}>{(transaction: Transaction) => (
                                                <tr>
                                                    <td>{transaction.Account.Name}</td>
                                                    <td>{transaction.Value}</td>
                                                </tr>
                                            )}</For>
                                        </table>
                                    </td>
                                    <td>
                                        <div class="d-flex gap-2 justify-content-end align-items-center">
                                            <Link class="btn btn-sm btn-primary" href={`/entries/edit/${entry.ID}`}>
                                                Edit
                                            </Link>

                                            <Button
                                                type="button"
                                                class="btn btn-sm btn-danger"
                                                onClick={() => entries.delete(entry.ID)}
                                            >
                                                Delete
                                            </Button>
                                        </div>

                                    </td>
                                </tr>
                            )}</For>
                        </Match>
                    </Switch>
                </tbody>
            </table>
        </div>
    );
}

export default List;
