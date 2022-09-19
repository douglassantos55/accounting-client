import { useNavigate, useParams } from "@solidjs/router";
import { Component, createSignal, Index, For, onMount, Show } from "solid-js";
import { Field, Form, Select } from "../../components/Form";
import { useStore } from "../../store";
import { Account, TYPES } from "../../types";

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

const AccountForm: Component<{ accounts: Account[] }> = () => {
    const params = useParams();
    const navigate = useNavigate();
    const { accounts } = useStore();

    const [loading, setLoading] = createSignal(!!params.id);

    let initialData = {
        name: '',
        type: '',
        parent_id: '',
    };

    onMount(async function() {
        await accounts.fetchAll();

        if (params.id) {
            const account = await accounts.fetch(parseInt(params.id));
            initialData = { ...account } as any;
            setLoading(false);
        }
    });

    async function save(data: Record<string, string>) {
        await accounts.save(data);
        navigate("/accounts");
    }

    return (
        <Show when={!loading()} fallback={<p>Fetching data...</p>}>
            <Form initialData={initialData} handleSubmit={save}>
                <div class="container">
                    <h1>Create an account</h1>

                    <Field label="Name" name="name" />

                    <Field label="Type" name="type" options={TYPES} />

                    <Field label="Parent" name="parent_id">
                        <Select name="parent_id">
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
                </div>
            </Form>
        </Show>
    );
}

export default AccountForm;
