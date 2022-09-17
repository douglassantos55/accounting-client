import { Link } from "@solidjs/router";
import { Component, For, Match, onMount, Switch } from "solid-js";
import { useStore } from "../../store";
import ListItem from "./ListItem";

const List: Component = () => {
    const { accounts } = useStore();

    onMount(accounts.fetchAll);

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
                            <For each={accounts.hierarchical()}>{account =>
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
