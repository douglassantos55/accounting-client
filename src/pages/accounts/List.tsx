import { Link } from "@solidjs/router";
import { Component, For, Match, onMount, Switch } from "solid-js";
import ListItem from "./ListItem";
import { useStore } from "../../components/Store";

const List: Component = () => {
    const { accounts, fetchAccounts } = useStore();

    onMount(fetchAccounts);

    return (
        <div class="container py-4">
            {JSON.stringify(accounts, null, 2)}
            <div class="d-flex align-items-center mb-4">
                <h1>Accounts</h1>

                <Link
                    href="/accounts/create"
                    class="btn btn-primary ms-auto"
                >
                    Create
                </Link>
            </div>

            <table class="table">
                <tbody>
                    <Switch fallback={<tr><td colspan="2">No accounts created yet.</td></tr>}>
                        <Match when={!accounts.state.fetched}>
                            <tr>
                                <td colspan="2">Fetching data, please wait...</td>
                            </tr>
                        </Match>
                        <Match when={accounts.state.fetched}>
                            <For each={Object.values(accounts.state.byId)}>{account =>
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
