import { Link } from "@solidjs/router";
import { Component, For, Match, onMount, Switch } from "solid-js";
import Button from "../../components/Button";
import { useStore } from "../../store";
import { Purchase } from "../../types";

const List: Component = function() {
    const { purchases } = useStore();

    onMount(purchases.fetchAll);

    return (
        <div class="container py-4">
            <div class="mb-4 d-flex align-items-center">
                <h1>Purchases</h1>

                <Link href="/purchases/create" class="btn btn-primary ms-auto">
                    Create
                </Link>
            </div>

            <table class="table">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Qty</th>
                        <th>Price</th>
                        <th>Payment date</th>
                        <th>Payment account</th>
                        <th>Payable account</th>
                        <th>&nbsp;</th>
                    </tr>
                </thead>

                <tbody>
                    <Switch>
                        <Match when={!purchases.state.fetched}>
                            <tr><td colspan="7">Fetching data, please wait...</td></tr>
                        </Match>
                        <Match when={purchases.state.ids.length == 0}>
                            <tr><td colspan="7">No purchases created yet.</td></tr>
                        </Match>
                        <Match when={purchases.state.ids.length > 0}>
                            <For each={purchases.all()}>{(purchase: Purchase) => (
                                <tr>
                                    <td>{purchase.Product.Name}</td>
                                    <td>{purchase.Qty}</td>
                                    <td>{purchase.Price}</td>
                                    <td>{purchase.Paid && purchase.PaymentDate}</td>
                                    <td>{purchase.PaymentAccount?.Name}</td>
                                    <td>{purchase.PayableAccount?.Name}</td>
                                    <td>
                                        <div class="d-flex gap-2 justify-content-end align-items-center">
                                            <Link class="btn btn-sm btn-primary" href={`/purchases/edit/${purchase.ID}`}>
                                                Edit
                                            </Link>

                                            <Button
                                                type="button"
                                                class="btn btn-sm btn-danger"
                                                onClick={() => purchases.delete(purchase.ID)}
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
