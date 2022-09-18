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
                    <Switch>
                        <Match when={!customers.state.fetched}>
                            <tr><td>Fetching data, please wait...</td></tr>
                        </Match>
                        <Match when={customers.state.ids.length == 0}>
                            <tr><td>No customers created yet.</td></tr>
                        </Match>
                        <Match when={customers.state.ids.length > 0}>
                            <For each={Object.values(customers.state.byId)}>{customer => (
                                <tr>
                                    <td>{customer.Name}</td>
                                    <td>{customer.Email}</td>
                                    <td>{customer.Cpf}</td>
                                    <td>{customer.Phone}</td>
                                    <td>{customer.Address.Street}, {customer.Address.Number}, {customer.Address.Postcode}</td>
                                    <td>
                                        <div class="d-flex gap-2 justify-content-end align-items-center">
                                            <Link class="btn btn-sm btn-primary" href={`/accounts/edit/${customer.ID}`}>
                                                Edit
                                            </Link>

                                            <button
                                                type="button"
                                                class="btn btn-sm btn-danger"
                                            >
                                                Delete
                                            </button>
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
