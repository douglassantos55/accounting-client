import { useNavigate } from "@solidjs/router";
import axios from "axios";
import { Component, createSignal, Index, For, onMount } from "solid-js";
import { Form, useForm } from "../../components/Form";
import { Account, AccountType } from "../../types";

const TYPES = Object.values(AccountType).filter(v => typeof v !== "number");

const AccountForm: Component<{ accounts: Account[] }> = (props) => {
    const { data, errors, handleChange } = useForm();

    return (
        <div class="container">
            <h1>Create an account</h1>

            <For each={errors()}>{error => <p>{error}</p>}</For>

            <div class="mb-3">
                <input name="name" class="form-control" value={data().name} onInput={handleChange} />
            </div>

            <div class="mb-3">
                <select name="type" class="form-control" value={data().type} onInput={handleChange}>
                    <option value="">Select an option</option>
                    <Index each={TYPES}>{(type, idx) =>
                        <option value={idx}>{type}</option>
                    }</Index>
                </select>
            </div>

            <div class="mb-3">
                <select name="parent_id" class="form-control" value={data().parent_id} onInput={handleChange}>
                    <option value="">Select an option</option>
                    <For each={props.accounts}>{account =>
                        <option value={account.ID}>{account.name}</option>
                    }</For>
                </select>
            </div>

            <button type="submit" class="btn btn-primary">Create</button>
        </div>
    );
}

export default function() {
    const navigate = useNavigate();
    const [accounts, setAccounts] = createSignal<Account[]>([]);

    onMount(async () => {
        const res = await axios.get("http://localhost:8080/accounts", {
            headers: { CompanyID: 1 },
        })
        setAccounts(res.data);
    })

    async function createAccount(data: Record<string, any>) {
        await axios.post("http://localhost:8080/accounts", {
            name: data.name,
            type: parseInt(data.type),
            parent_id: data.parent_id ? parseInt(data.parent_id) : null,
        }, { headers: { CompanyID: 1 } });

        navigate("/accounts");
    }

    const initialData = {
        name: '',
        type: '',
        parent_id: '',
    };

    return (
        <Form handleSubmit={createAccount} initialData={initialData}>
            <AccountForm accounts={accounts()} />
        </Form>
    );
}
