import { useNavigate, useParams } from "@solidjs/router";
import { Component } from "solid-js";
import { Field, Form, Input } from "../../components/Form";
import { useStore } from "../../store";

const VendorForm: Component = function() {
    const params = useParams();
    const navigate = useNavigate();
    const { vendors } = useStore();

    async function save(data: Record<string, string>) {
        await vendors.save(data);
        navigate('/vendors');
    }

    async function initialData() {
        let initialData = {
            Name: '',
            Cnpj: '',
            Address: {
                Postcode: '',
                Street: '',
                Number: '',
                Neighborhood: '',
                City: '',
                State: '',
            },
        };

        if (params.id) {
            const vendor = await vendors.fetch(parseInt(params.id));
            initialData = JSON.parse(JSON.stringify(vendor));
        }

        return initialData;
    }

    return (
        <div class="container">
            <h1 class="mb-4">Create vendor</h1>

            <Form initialData={initialData} handleSubmit={save}>
                <Field label="Name" for="name">
                    <Input name="Name" id="name" />
                </Field>

                <Field label="CPF/CNPJ" for="cnpj">
                    <Input name="Cnpj" id="cpnj" />
                </Field>

                <Field for="postcode" label="Postcode">
                    <Input name="Address.Postcode" id="postcode" />
                </Field>

                <Field for="street" label="Street">
                    <Input name="Address.Street" id="street" />
                </Field>

                <Field for="number" label="Number">
                    <Input name="Address.Number" id="number" />
                </Field>

                <Field for="neighborhood" label="Neighborhood">
                    <Input name="Address.Neighborhood" id="neighborhood" />
                </Field>

                <Field for="city" label="City">
                    <Input name="Address.City" id="city" />
                </Field>

                <Field for="state" label="State">
                    <Input name="Address.State" id="state" />
                </Field>

                <button type="submit" class="btn btn-primary">
                    Save
                </button>
            </Form>
        </div>
    );
}

export default VendorForm;
