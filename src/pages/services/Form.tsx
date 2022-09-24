import { useNavigate, useParams } from "@solidjs/router";
import { Component, onMount } from "solid-js";
import { Field, Form, Input, Select } from "../../components/Form";
import { useStore } from "../../store";
import { AccountType } from "../../types";

const ServiceForm: Component = function() {
    const { accounts, services } = useStore();
    const navigate = useNavigate();
    const params = useParams();

    onMount(accounts.fetchAll);

    async function initialData() {
        let initialData = {
            Name: '',
            RevenueAccountID: '',
            CostOfServiceAccountID: '',
        };

        if (params.id) {
            const service = await services.fetch(parseInt(params.id));
            console.log(service);
            initialData = JSON.parse(JSON.stringify(service));
        }

        return initialData;
    }

    async function saveService(data: Record<string, string>) {
        await services.save(data);
        navigate('/services');
    }

    return (
        <div class="container py-4">
            <h1 class="mb-4">Create service</h1>

            <Form initialData={initialData} handleSubmit={saveService}>
                <Field for="name" label="Name">
                    <Input id="name" name="Name" />
                </Field>

                <Field for="revenue-account" label="Revenue account">
                    <Select
                        id="revenue-account"
                        name="RevenueAccountID"
                        options={accounts.type(AccountType.Revenue)}
                    />
                </Field>

                <Field for="cost-account" label="Cost account">
                    <Select
                        id="cost-account"
                        name="CostOfServiceAccountID"
                        options={accounts.type(AccountType.Expense)}
                    />
                </Field>

                <button type="submit" class="btn btn-primary">
                    Save
                </button>
            </Form>
        </div>
    );
}

export default ServiceForm;
