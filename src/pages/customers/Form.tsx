import { useNavigate, useParams } from "@solidjs/router";
import { Component } from "solid-js";
import { Field, Form, Input } from "../../components/Form";
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

                <Field for="name" label="Name">
                    <Input name="Name" id="name" />
                </Field>

                <Field for="email" label="Email">
                    <Input name="Email" id="email" type="email" />
                </Field>


                <Field for="cpf" label="CPF">
                    <Input name="Cpf" id="cpf" />
                </Field>

                <Field for="phone" label="Phone">
                    <Input name="Phone" id="phone" />
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
                    {params.id ? 'Save' : 'Create'}
                </button>
            </Form>
        </div>
    );
}

export default CustomerForm;
