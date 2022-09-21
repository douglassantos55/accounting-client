import { Component } from "solid-js";
import { Field, Form } from "../../components/Form";

const ProductForm: Component = function() {
    async function initialData() {
        return {
            Name: '',
            Price: '',
            Purchasable: '',
            RevenueAccountID: '',
            CostOfSaleAccountID: '',
            InventoryAccountID: '',
            VendorID: '',
        };
    }

    async function saveProduct(data: Record<string, string>) {
        console.log(data);
    }

    return (
        <div class="container py-4">
            <h1>Create product</h1>

            <Form initialData={initialData} handleSubmit={saveProduct}>
                <Field name="Name" label="Name" />
                <Field name="Price" label="Price" />
            </Form>
        </div>
    );
}

export default ProductForm;
