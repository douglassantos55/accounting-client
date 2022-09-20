import { Link } from "@solidjs/router";
import { Component, For, Match, onMount, Switch } from "solid-js";
import Button from "../../components/Button";
import { useStore } from "../../store";

const List: Component = function() {
    const { vendors } = useStore();

    onMount(vendors.fetchAll);

    return (
        <div class="container py-4">
            <div class="d-flex align-items-center">
                <h1>Vendors</h1>

                <Link class="ms-auto btn btn-primary" href="/vendors/create">
                    Create
                </Link>
            </div>

            <table class="table">
                <tbody>
                    <Switch>
                        <Match when={!vendors.state.fetched}>
                            <tr><td>Fetching data, please wait...</td></tr>
                        </Match>
                        <Match when={vendors.state.ids.length == 0}>
                            <tr><td>No customers created yet.</td></tr>
                        </Match>
                        <Match when={vendors.state.ids.length > 0}>
                            <For each={Object.values(vendors.state.byId)}>{vendor => (
                                <tr>
                                    <td>{vendor.Name}</td>
                                    <td>{vendor.Cnpj}</td>
                                    <td>{vendor.Address.Street}, {vendor.Address.Number}, {vendor.Address.Postcode}</td>
                                    <td>
                                        <div class="d-flex gap-2 justify-content-end align-items-center">
                                            <Link class="btn btn-sm btn-primary" href={`/customers/edit/${vendor.ID}`}>
                                                Edit
                                            </Link>

                                            <Button
                                                type="button"
                                                class="btn btn-sm btn-danger"
                                                onClick={() => vendors.delete(vendor.ID)}
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
