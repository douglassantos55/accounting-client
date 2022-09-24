import { Link } from "@solidjs/router";
import { Component, For, Match, onMount, Switch } from "solid-js";
import Button from "../../components/Button";
import { useStore } from "../../store";
import { Service } from "../../types";

const List: Component = function() {
    const { services } = useStore();

    onMount(services.fetchAll);

    return (
        <div class="container py-4">
            <div class="d-flex align-items-center">
                <h1>Services</h1>

                <Link href="/services/create" class="btn btn-primary ms-auto">
                    Create
                </Link>
            </div>

            <table class="table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Revenue account</th>
                        <th>Cost account</th>
                        <th>&nbsp;</th>
                    </tr>
                </thead>
                <tbody>
                    <Switch>
                        <Match when={!services.state.fetched}>
                            <tr><td>Fetching data, please wait...</td></tr>
                        </Match>
                        <Match when={services.state.ids.length == 0}>
                            <tr><td>No services created yet.</td></tr>
                        </Match>
                        <Match when={services.state.ids.length > 0}>
                            <For each={services.all()}>{(service: Service) => (
                                <tr>
                                    <td>{service.Name}</td>
                                    <td>{service.RevenueAccount.Name}</td>
                                    <td>{service.CostOfServiceAccount.Name}</td>
                                    <td>
                                        <div class="d-flex gap-2 justify-content-end align-items-center">
                                            <Link class="btn btn-sm btn-primary" href={`/services/edit/${service.ID}`}>
                                                Edit
                                            </Link>

                                            <Button
                                                type="button"
                                                class="btn btn-sm btn-danger"
                                                onClick={() => services.delete(service.ID)}
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
