import { useNavigate, useParams } from "@solidjs/router";
import { Component } from "solid-js";
import { Field, Form } from "../../components/Form";
import { useStore } from "../../store";

const CustomerForm: Component = function() {
    const params = useParams();
    const navigate = useNavigate();
    const { customers } = useStore();

    async function saveCustomer(data: Record<string, string>) {
        await customers.save(data);
        navigate('/customers');
    }

    async function initialData() {
        let initialData = {
            Name: '',
            Email: '',
            Cpf: '',
            Phone: '',
            Address: {
                Postcode: '',
                Street: '',
                Number: '',
                Neighborhood: '',
                City: '',
                State: '',
            },
        }

        if (params.id) {
            const customer = await customers.fetch(parseInt(params.id));
            initialData = JSON.parse(JSON.stringify(customer));
        }

        return initialData;
    }

    return (
        <div class="container py-4">
            <Form initialData={initialData} handleSubmit={saveCustomer}>
                <h1 class="mb-4">Create a customer</h1>

                <Field name="Name" label="Name" />

                <Field name="Email" label="Email" />

                <Field name="Cpf" label="CPF" />

                <Field name="Phone" label="Phone" />

                <Field name="Address.Postcode" label="Postcode" />
                <Field name="Address.Street" label="Street" />
                <Field name="Address.Number" label="Number" />
                <Field name="Address.Neighborhood" label="Neighborhood" />
                <Field name="Address.City" label="City" />
                <Field name="Address.State" label="State" />

                <button type="submit" class="btn btn-primary">
                    {params.id ? 'Save' : 'Create'}
                </button>
            </Form>
        </div>
    );
}

export default CustomerForm;
