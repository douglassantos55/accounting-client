import { useNavigate, useParams } from "@solidjs/router";
import { Component, For, onMount } from "solid-js";
import AccountOption from "../../components/AccountOption";
import { Field, Form, Input, Select } from "../../components/Form";
import { useStore } from "../../store";
import { TYPES } from "../../types";

const AccountForm: Component = () => {
    const params = useParams();
    const navigate = useNavigate();
    const { accounts } = useStore();

    async function initialData() {
        let initialData = {
            Name: '',
            Type: '',
            ParentID: '',
        };

        if (params.id) {
            const account = await accounts.fetch(parseInt(params.id));
            initialData = { ...account } as any;
        }

        return initialData;
    }

    onMount(accounts.fetchAll);

    async function save(data: Record<string, string>) {
        await accounts.save(data);
        navigate("/accounts");
    }

    return (
        <div class="container">
            <Form initialData={initialData} handleSubmit={save}>
                <h1>Create an account</h1>

                <Field label="Name" for="name">
                    <Input name="Name" id="name" />
                </Field>

                <Field label="Type" for="type">
                    <Select name="Type" id="type" options={TYPES} />
                </Field>

                <Field label="Parent" for="parent">
                    <Select name="ParentID" id="parent">
                        <>
                            <option value="">Select an option</option>
                            <For each={accounts.hierarchical()}>{account =>
                                <AccountOption account={account} depth={0} name="ParentID" />
                            }</For>
                        </>
                    </Select>
                </Field>

                <button type="submit" class="btn btn-primary">
                    {params.id ? 'Save' : 'Create'}
                </button>
            </Form >
        </div>
    );
}

export default AccountForm;
