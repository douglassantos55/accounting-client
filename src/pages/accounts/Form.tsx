import { useNavigate, useParams } from "@solidjs/router";
import axios from "../../axios";
import { Component, createSignal, Index, For, onMount, Show } from "solid-js";
import { Form, useForm } from "../../components/Form";
import { Account, AccountType } from "../../types";

const TYPES = Object.values(AccountType).filter(v => typeof v !== "number");

const AccountOption: Component<{ account: Account, depth: number }> = (props) => {
    return (
        <>
            <option value={props.account.ID}>
                <Index each={new Array(props.depth)}>{() =>
                    <span>&nbsp;&nbsp;</span>
                }</Index>
                {props.account.name}
            </option>

            <For each={props.account.children}>{child =>
                <AccountOption account={child} depth={props.depth + 1} />
            }</For>
        </>
    );
}

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
                        <AccountOption account={account} depth={0} />
                    }</For>
                </select>
            </div>

            <button type="submit" class="btn btn-primary">
                {data().ID ? 'Save' : 'Create'}
            </button>
        </div>
    );
}

export default function() {
    const params = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = createSignal(!!params.id);
    const [accounts, setAccounts] = createSignal<Account[]>([]);

    const [initialData, setInitialData] = createSignal({
        name: '',
        type: '',
        parent_id: '',
    });

    onMount(async function() {
        setAccounts(await axios.get("/accounts"));
        if (params.id) {
            setInitialData(await axios.get(`/accounts/${params.id}`));
            setLoading(false);
        }
    });

    function normalize(data: Record<string, string>) {
        return {
            name: data.name,
            type: parseInt(data.type),
            parent_id: data.parent_id ? parseInt(data.parent_id) : null,
        };
    }

    async function saveAccount(data: Record<string, string>) {
        if (data.ID) {
            await axios.put(`/accounts/${data.ID}`, normalize(data));
        } else {
            await axios.post("/accounts", normalize(data));
        }
        navigate("/accounts");
    }

    return (
        <Show when={!loading()}>
            <Form handleSubmit={saveAccount} initialData={initialData()}>
                <AccountForm accounts={accounts()} />
            </Form>
        </Show>
    );
}
