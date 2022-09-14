import axios from "axios";
import { Component, createSignal, Index } from "solid-js";
import { AccountType } from "../../types";

const TYPES = Object.values(AccountType).filter(v => typeof v !== "number");

function useForm<T>(initialData: T) {
    const [data, setData] = createSignal<T>(initialData);

    function handleChange(evt: InputEvent) {
        const input = evt.target as HTMLInputElement
        setData((prev: T) => ({
            ...prev,
            [input.name]: input.value,
        }))
    }

    return { data, handleChange };
}

const Form: Component = () => {
    const { data, handleChange } = useForm({
        name: "",
        type: "",
        parent_id: "",
    });

    async function createAccount(evt: SubmitEvent) {
        evt.preventDefault();
        await axios.post("http://localhost:8080/accounts", {
            name: data().name,
            type: parseInt(data().type),
            parent_id: data().parent_id ? parseInt(data().parent_id) : null,
        }, {
            headers: { "CompanyID": 1 },
        });
    }

    return (
        <div class="container">
            <h1>Create an account</h1>

            <form onSubmit={createAccount}>
                <div class="mb-3">
                    <input name="name" class="form-control" onInput={handleChange} />
                </div>

                <div class="mb-3">
                    <select name="type" class="form-control" onInput={handleChange}>
                        <Index each={TYPES}>{(type, idx) =>
                            <option value={idx}>{type}</option>
                        }</Index>
                    </select>
                </div>

                <button type="submit" class="btn btn-primary">Create</button>
            </form>
        </div>
    );
}

export default Form;
