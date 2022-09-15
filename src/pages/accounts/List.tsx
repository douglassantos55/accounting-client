import { Link } from "@solidjs/router";
import axios from "../../axios";
import { Component, createSignal, For, Match, onMount, Switch } from "solid-js";
import { Account } from "../../types";
import ListItem from "./ListItem";

const List: Component = () => {
    const [loading, setLoading] = createSignal<boolean>(true);
    const [accounts, setAccounts] = createSignal<Account[]>([]);

    onMount(async () => {
        setAccounts(await axios.get('/accounts'));
        setLoading(false);
    })

    return (
        <div class="container">
            <div class="d-flex align-items-center">
                <h1>Accounts</h1>

                <Link
                    href="/accounts/create"
                    class="btn btn-primary ms-auto"
                >
                    Create
                </Link>
            </div>

            <table class="table">
                <thead>
                    <tr>
                        <th>Account</th>
                        <th class="text-end">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    <Switch fallback={<tr><td colspan="2">No accounts created yet.</td></tr>}>
                        <Match when={loading()}>
                            <tr>
                                <td colspan="2">Fetching data, please wait...</td>
                            </tr>
                        </Match>
                        <Match when={accounts().length > 0}>
                            <For each={accounts()}>{account =>
                                <ListItem account={account} depth={0} />
                            }</For>
                        </Match>
                    </Switch>
                </tbody>
            </table>
        </div >
    );
}

export default List;
