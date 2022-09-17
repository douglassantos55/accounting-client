import { useNavigate, useParams } from "@solidjs/router";
import { Component, createSignal, Index, For, onMount, Show } from "solid-js";
import { Form, useForm } from "../../components/Form";
import { Account, TYPES } from "../../types";
import { useStore } from "../../components/Store";

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
    const { accounts, fetchAccount, fetchAccounts, saveAccount } = useStore();

    const [loading, setLoading] = createSignal(!!params.id);

    const [initialData, setInitialData] = createSignal({
        name: '',
        type: '',
        parent_id: '',
    });

    onMount(async function() {
        await fetchAccounts();
        if (params.id) {
            const account = await fetchAccount(parseInt(params.id));
            setInitialData({ ...account } as any);
            setLoading(false);
        }
    });

    async function save(data: Record<string, string>) {
        await saveAccount(data);
        navigate("/accounts");
    }

    return (
        <Show when={!loading()}>
            <Form handleSubmit={save} initialData={initialData()}>
                <AccountForm accounts={Object.values(accounts.state.byId)} />
            </Form>
        </Show>
    );
}
