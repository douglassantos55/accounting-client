import { Link } from "@solidjs/router";
import { For, Component, Switch, Match, onMount } from "solid-js";
import { useStore } from "../../store";

const List: Component = function() {
    const { customers } = useStore();

    onMount(customers.fetchAll);

    return (
        <div class="container py-4">
            <div class="d-flex align-items-center mb-4">
                <h1>Customers</h1>

                <Link
                    href="/customers/create"
                    class="btn btn-primary ms-auto"
                >
                    Create
                </Link>
            </div>

            <table class="table">
                <tbody>
                    <tr>
                        <Switch>
                            <Match when={!customers.state.fetched}>
                                <td>Fetching data, please wait...</td>
                            </Match>
                            <Match when={customers.state.ids.length == 0}>
                                <td>No customers created yet.</td>
                            </Match>
                            <Match when={customers.state.ids.length > 0}>
                                <For each={Object.values(customers.state.byId)}>{customer => (
                                    <>
                                        <td>{customer.Name}</td>
                                        <td>{customer.Email}</td>
                                        <td>{customer.Cpf}</td>
                                        <td>{customer.Phone}</td>
                                        <td>{customer.Address}</td>
                                    </>
                                )}</For>
                            </Match>
                        </Switch>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default List;
