import { useNavigate, useParams } from "@solidjs/router";
import { Component } from "solid-js";
import { Field, Form } from "../../components/Form";
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
                <Field name="Name" label="Name" />
                <Field name="Cnpj" label="CPF/CNPJ" />

                <Field name="Address.Postcode" label="Postcode" />
                <Field name="Address.Street" label="Street" />
                <Field name="Address.Number" label="Number" />
                <Field name="Address.Neighborhood" label="Neighborhood" />
                <Field name="Address.City" label="City" />
                <Field name="Address.State" label="State" />

                <button type="submit" class="btn btn-primary">
                    Save
                </button>
            </Form>
        </div>
    );
}

export default VendorForm;
