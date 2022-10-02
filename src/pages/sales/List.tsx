import { Link } from "@solidjs/router";
import { Component, For, Match, onMount, Switch } from "solid-js";
import Button from "../../components/Button";
import { useStore } from "../../store";
import { Sale, SaleItem } from "../../types";

const List: Component = function() {
    const { sales } = useStore();

    onMount(sales.fetchAll);

    return (
        <div class="container py-4">
            <div class="d-flex align-items-center">
                <h1>Sales</h1>

                <Link href="/sales/create" class="btn btn-primary ms-auto">
                    Create
                </Link>
            </div>

            <table class="table align-middle">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Customer</th>
                        <th>Paid</th>
                        <th>Payment account</th>
                        <th>Receivable account</th>
                        <th>Items</th>
                        <th>&nbsp;</th>
                    </tr>
                </thead>

                <tbody>
                    <Switch>
                        <Match when={!sales.state.fetched}>
                            <tr><td colspan="6">Fetching data, please wait...</td></tr>
                        </Match>
                        <Match when={sales.state.ids.length == 0}>
                            <tr><td colspan="6">No sales created yet.</td></tr>
                        </Match>
                        <Match when={sales.state.ids.length > 0}>
                            <For each={sales.all()}>{(sale: Sale) => (
                                <tr>
                                    <td>{new Date(sale.CreatedAt).toLocaleString()}</td>
                                    <td>{sale.Customer.Name}</td>
                                    <td>{sale.Paid ? 'Yes' : 'No'}</td>
                                    <td>{sale.PaymentAccount?.Name}</td>
                                    <td>{sale.ReceivableAccount?.Name}</td>
                                    <td>
                                        <table class="table mb-0">
                                            <For each={sale.Items as SaleItem[]}>{(item: SaleItem) => (
                                                <tr>
                                                    <td>{item.Product.Name}</td>
                                                    <td>{item.Qty}x</td>
                                                    <td>{item.Price}</td>
                                                </tr>
                                            )}</For>
                                        </table>
                                    </td>
                                    <td>
                                        <div class="d-flex gap-2 justify-content-end align-items-center">
                                            <Link class="btn btn-sm btn-primary" href={`/sales/edit/${sale.ID}`}>
                                                Edit
                                            </Link>

                                            <Button
                                                type="button"
                                                class="btn btn-sm btn-danger"
                                                onClick={() => sales.delete(sale.ID)}
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
