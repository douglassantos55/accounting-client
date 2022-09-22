import { Link } from "@solidjs/router";
import { Component, For, Match, onMount, Switch } from "solid-js";
import Button from "../../components/Button";
import { useStore } from "../../store";

const List: Component = function() {
    const { products } = useStore();

    onMount(products.fetchAll);

    return (
        <div class="container py-4">
            <div class="d-flex align-items-center">
                <h1>Products</h1>

                <Link class="ms-auto btn btn-primary" href="/products/create">
                    Create
                </Link>
            </div>

            <table class="table">
                <thead>
                    <tr>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Purchasable</th>
                        <th>Vendor</th>
                        <th>Inventory account</th>
                        <th>Revenue account</th>
                        <th>COGs account</th>
                        <th>&nbsp;</th>
                    </tr>
                </thead>
                <tbody>
                    <Switch>
                        <Match when={!products.state.fetched}>
                            <tr>
                                <td colspan="8" class="text-center">
                                    Fetching data, please wait...
                                </td>
                            </tr>
                        </Match>
                        <Match when={products.state.ids.length == 0}>
                            <tr>
                                <td colspan="8" class="text-center">
                                    No products created yet.
                                </td>
                            </tr>
                        </Match>
                        <Match when={products.state.ids.length > 0}>
                            <For each={Object.values(products.state.byId)}>{product => (
                                <tr>
                                    <td>{product.Name}</td>
                                    <td>{product.Price}</td>
                                    <td>{product.Purchasable ? 'Yes' : 'No'}</td>
                                    <td>{product.Vendor?.Name}</td>
                                    <td>{product.InventoryAccount.Name}</td>
                                    <td>{product.RevenueAccount?.Name}</td>
                                    <td>{product.CostOfSaleAccount?.Name}</td>
                                    <td>
                                        <div class="d-flex gap-2 justify-content-end align-items-center">
                                            <Link class="btn btn-sm btn-primary" href={`/products/edit/${product.ID}`}>
                                                Edit
                                            </Link>

                                            <Button
                                                type="button"
                                                class="btn btn-sm btn-danger"
                                                onClick={() => products.delete(product.ID)}
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
