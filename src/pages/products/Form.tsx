import { useNavigate, useParams } from "@solidjs/router";
import { Component, createMemo, onMount, Show } from "solid-js";
import { Field, Form, Input, Select, SwitchInput } from "../../components/Form";
import { useStore } from "../../store";
import { Account, AccountType, Vendor } from "../../types";

const ProductForm: Component = function() {
    const params = useParams();
    const navigate = useNavigate();
    const { products, accounts, vendors } = useStore();

    onMount(function() {
        accounts.fetchAll();
        vendors.fetchAll();
    });

    function getAccounts(type: AccountType) {
        return createMemo(function() {
            return accounts.all().filter(function(account: Account) {
                return account.Type == type;
            }).map(function(account: Account) {
                return { id: account.ID, value: account.Name };
            });
        });
    }

    async function initialData() {
        let initialData = {
            Name: '',
            Price: '',
            Purchasable: true,
            RevenueAccountID: '',
            CostOfSaleAccountID: '',
            InventoryAccountID: '',
            VendorID: '',
        };

        if (params.id) {
            const product = await products.fetch(parseInt(params.id))
            initialData = JSON.parse(JSON.stringify(product));
        }

        return initialData;
    }

    async function saveProduct(data: Record<string, string>) {
        await products.save(data);
        navigate('/products');
    }

    return (
        <div class="container py-4">
            <h1>Create product</h1>

            <Form initialData={initialData} handleSubmit={saveProduct}>
                {({ data }) => (
                    <>
                        <Field label="Name" for="name">
                            <Input name="Name" id="name" />
                        </Field>

                        <Field label="Price" for="price">
                            <Input name="Price" id="price" />
                        </Field>

                        <Field label="Vendor" for="vendor">
                            <Select
                                id="vendor"
                                name="VendorID"
                                options={vendors.all().map((vendor: Vendor) => ({ id: vendor.ID, value: vendor.Name }))}
                            />
                        </Field>

                        <Field label="Purchasable" for="purchasable">
                            <SwitchInput
                                label="Enable if you intend to sell this product"
                                name="Purchasable"
                                id="purchasable"
                            />
                        </Field>

                        <Field label="Inventory account" for="inventory">
                            <Select
                                id="inventory"
                                name="InventoryAccountID"
                                options={getAccounts(AccountType.Asset)()}
                            />
                        </Field>

                        <Show when={data.Purchasable}>
                            <Field label="Revenue account" for="revenue">
                                <Select
                                    id="revenue"
                                    name="RevenueAccountID"
                                    options={getAccounts(AccountType.Revenue)()}
                                />
                            </Field>

                            <Field label="Cost of sales account" for="revenue">
                                <Select
                                    id="revenue"
                                    name="CostOfSaleAccountID"
                                    options={getAccounts(AccountType.Expense)()}
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

export default ProductForm;
