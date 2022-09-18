import { useNavigate } from "@solidjs/router";
import { Component } from "solid-js";
import { Field, Form } from "../../components/Form";
import { useStore } from "../../store";

const CustomerForm: Component = function() {
    const navigate = useNavigate();
    const { customers } = useStore();

    async function saveCustomer(data: Record<string, string>) {
        await customers.save(data);
        navigate('/customers');
    }

    return (
        <Form initialData={{ name: '', email: '', cpf: '', phone: '' }} handleSubmit={saveCustomer}>
            <div class="container py-4">
                <h1 class="mb-4">Create a customer</h1>

                <Field name="name" label="Name" />

                <Field name="email" label="Email" />

                <Field name="cpf" label="CPF" />

                <Field name="phone" label="Phone" />

                <button type="submit" class="btn btn-primary">
                    Create
                </button>
            </div>
        </Form>
    );
}

export default CustomerForm;
