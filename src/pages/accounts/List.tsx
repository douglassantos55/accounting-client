import { Link } from "@solidjs/router";
import axios from "../../axios";
import { Component, createSignal, For, Match, onMount, Switch } from "solid-js";
import { Account } from "../../types";

const List: Component = () => {
    const [loading, setLoading] = createSignal<boolean>(true);
    const [accounts, setAccounts] = createSignal<Account[]>([]);

    onMount(async () => {
        setLoading(false);
        setAccounts(await axios.get('/accounts'));
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

            <Switch fallback={<p>No accounts created yet.</p>}>
                <Match when={loading()}>
                    <p>Fetching data, please wait...</p>
                </Match>
                <Match when={accounts().length > 0}>
                    <For each={accounts()}>{account => <p>{account.name}</p>}</For>
                </Match>
            </Switch>
        </div >
    );
}

export default List;
