import { useNavigate, useParams } from "@solidjs/router";
import { Component, onMount, Show } from "solid-js";
import { Field, Form, Input, Select, SwitchInput } from "../../components/Form";
import { useStore } from "../../store";
import { AccountType } from "../../types";

const PurchaseForm: Component = function() {
    const params = useParams();
    const navigate = useNavigate();
    const { purchases, products, accounts } = useStore();

    onMount(function() {
        products.fetchAll();
        accounts.fetchAll();
    });

    async function initialData() {
        let initialData = {
            Qty: '',
            Price: '',
            Paid: false,
            PaymentDate: '',
            PayableAccountID: '',
            PaymentAccountID: '',
            ProductID: '',
        };

        if (params.id) {
            const purchase = await purchases.fetch(parseInt(params.id));
            initialData = JSON.parse(JSON.stringify(purchase));
        }

        return initialData;
    }

    async function savePurchase(data: Record<string, string>) {
        await purchases.save(data);
        navigate('/purchases');
    }

    return (
        <div class="container py-4">
            <h1 class="mb-4">Create purchase</h1>

            <Form initialData={initialData} handleSubmit={savePurchase}>
                {({ data }) => (
                    <>
                        <Field label="Product" for="product">
                            <Select options={products.all()} id="product" name="ProductID" />
                        </Field>

                        <Field label="Qty" for="qty">
                            <Input id="qty" name="Qty" />
                        </Field>

                        <Field label="Price" for="price">
                            <Input id="price" name="Price" />
                        </Field>

                        <Field label="Paid" for="paid">
                            <SwitchInput id="paid" name="Paid" label="Enable if the purchase was already paid" />
                        </Field>

                        <Show when={data.PayableAccountID || !data.Paid}>
                            <Field label="Payable account" for="payable-account">
                                <Select
                                    options={accounts.type(AccountType.Liability)}
                                    name="PayableAccountID"
                                />
                            </Field>
                        </Show>

                        <Show when={data.Paid}>
                            <Field label="Payment date" for="payment-date">
                                <Input id="payment-date" name="PaymentDate" type="date" />
                            </Field>

                            <Field label="Payment account" for="payment-account">
                                <Select
                                    options={accounts.type(AccountType.Asset)}
                                    name="PaymentAccountID"
                                />
                            </Field>
                        </Show>

                        <button type="submit" class="btn btn-primary">
                            Save
                        </button>
                    </>
                )}
            </Form>
        </div>
    );
}

export default PurchaseForm;
