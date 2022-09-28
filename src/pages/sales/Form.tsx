import { useNavigate } from "@solidjs/router";
import { Component, For, onMount } from "solid-js";
import { Field, Form, Input, Select, SwitchInput } from "../../components/Form";
import { useStore } from "../../store";
import { AccountType } from "../../types";

const SaleForm: Component = function() {
    const navigate = useNavigate();
    const { sales, accounts, customers, products } = useStore();

    onMount(function() {
        customers.fetchAll();
        accounts.fetchAll();
        products.fetchAll();
    });

    async function initialData() {
        return {
            Paid: false,
            Items: [
                { Qty: '', Price: '', ProductID: '' },
            ],
            CustomerID: '',
            PaymentAccountID: '',
            ReceivabelAccountID: '',
        };
    }

    async function saveSale(data: Record<string, any>) {
        await sales.save(data);
        navigate('/sales');
    }

    return (
        <div class="container py-4">
            <h1 class="mb-4">Create sale</h1>

            <Form initialData={initialData} handleSubmit={saveSale}>
                {({ data, add, remove }) =>
                    <>
                        <div class="row">
                            <div class="col-8">
                                <Field for="customer" label="Customer">
                                    <Select
                                        id="customer"
                                        name="CustomerID"
                                        options={Object.values(customers.state.byId)}
                                    />
                                </Field>
                            </div>

                            <div class="col">
                                <Field for="paid" label="Paid">
                                    <SwitchInput
                                        id="paid"
                                        name="Paid"
                                        label="Enable if the sale was already paid"
                                    />
                                </Field>
                            </div>
                        </div>

                        <Field for="payment-account" label="Payment account">
                            <Select
                                id="payment-account"
                                name="PaymentAccountID"
                                options={accounts.type(AccountType.Asset)}
                            />
                        </Field>

                        <Field for="receivable-account" label="Receivable account">
                            <Select
                                id="receivable-account"
                                name="ReceivableAccountID"
                                options={accounts.type(AccountType.Asset)}
                            />
                        </Field>

                        <For each={data.Items}>{(_, i) =>
                            <div class="row">
                                <div class="col-2">
                                    <label class="form-label d-block">&nbsp;</label>
                                    <button
                                        type="button"
                                        class="btn btn-danger"
                                        onClick={() => remove('Items', i())}
                                    >
                                        Remove
                                    </button>
                                </div>
                                <div class="col-4">
                                    <Field label="Product">
                                        <Select
                                            name={`Items.${i()}.ProductID`}
                                            options={products.all()}
                                        />
                                    </Field>
                                </div>
                                <div class="col-3">

                                    <Field label="Qty">
                                        <Input name={`Items.${i()}.Qty`} />
                                    </Field>

                                </div>
                                <div class="col-3">
                                    <Field label="Price">
                                        <Input name={`Items.${i()}.Price`} />
                                    </Field>
                                </div>
                            </div>
                        }</For>

                        <button
                            type="button"
                            class="btn btn-secondary"
                            onClick={() => add('Items', {
                                Qty: '',
                                Price: '',
                                ProductID: ''
                            })}
                        >
                            Add item
                        </button>

                        <button type="submit" class="btn btn-primary">
                            Save
                        </button>
                    </>
                }
            </Form>
        </div>
    );
}

export default SaleForm;
