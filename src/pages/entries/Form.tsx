import { useNavigate, useParams } from "@solidjs/router";
import { Component, For, onMount } from "solid-js";
import AccountOption from "../../components/AccountOption";
import { Field, Form, Input, Select } from "../../components/Form";
import { useStore } from "../../store";
import { Account } from "../../types";

const EntryForm: Component = function() {
    const params = useParams();
    const navigate = useNavigate();
    const { entries, accounts } = useStore();

    onMount(accounts.fetchAll);

    async function initialData() {
        let initialData = {
            Description: '',
            Transactions: [
                { Value: '', AccountID: '' },
                { Value: '', AccountID: '' },
            ],
        };
        if (params.id) {
            const entry = await entries.fetch(parseInt(params.id));
            initialData = JSON.parse(JSON.stringify(entry));
        }
        return initialData;
    }

    async function saveEntry(data: Record<string, string>) {
        await entries.save(data);
        navigate('/entries');
    }

    return (
        <div class="container py-4">
            <h1 class="mb-4">Create accounting entry</h1>

            <Form initialData={initialData} handleSubmit={saveEntry}>
                {({ data }) => (
                    <>
                        <Field for="description" label="Description">
                            <Input id="description" name="Description" />
                        </Field>

                        <For each={data.Transactions}>{(_, i) =>
                            <div class="gap-4 d-flex align-items-center">
                                <Field label="Account">
                                    <Select name={`Transactions.${i()}.AccountID`}>
                                        <>
                                            <option value="">Select an option</option>
                                            <For each={accounts.hierarchical()}>{(account: Account) =>
                                                <AccountOption account={account} depth={0} selected={data.Transactions[i()].AccountID} />
                                            }</For>
                                        </>
                                    </Select>

                                </Field>

                                <Field label="Value">
                                    <Input name={`Transactions.${i()}.Value`} />
                                </Field>
                            </div>
                        }</For>

                        <button type="submit" class="btn btn-primary">
                            Save
                        </button>
                    </>
                )}
            </Form>
        </div>
    );
}

export default EntryForm;
