import { useNavigate, useParams } from "@solidjs/router";
import { Component, Index, For, onMount } from "solid-js";
import { Field, Form, Input, Select } from "../../components/Form";
import { useStore } from "../../store";
import { Account, TYPES } from "../../types";

const AccountOption: Component<{ account: Account, depth: number }> = (props) => {
    return (
        <>
            <option value={props.account.ID}>
                <Index each={new Array(props.depth)}>{() =>
                    <span>&nbsp;&nbsp;</span>
                }</Index>
                {props.account.Name}
            </option>

            <For each={props.account.Children}>{child =>
                <AccountOption account={child} depth={props.depth + 1} />
            }</For>
        </>
    );
}

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
                                <AccountOption account={account} depth={0} />
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
