import { Accessor, Component, createContext, createMemo, createSignal, For, Match, ParentProps, Show, Switch, useContext } from "solid-js";
import { createStore } from "solid-js/store";

type Form = {
    data: Record<string, any>;
    errors: Accessor<Record<string, string>>;
    handleChange: (evt: InputEvent) => void;
    getValue: (path: string, data: Record<string, any>) => string;
}

type FormProps = {
    initialData: Record<string, any>;
    handleSubmit: (data: Record<string, any>) => Promise<void>;
}

const FormContext = createContext<Form>();

type FieldProps = {
    name: string;
    label?: string;
    options?: Option[];
}

export const Field: Component<ParentProps<FieldProps>> = function(props) {
    const { errors } = useForm();

    const error = createMemo(function() {
        return errors()[props.name];
    });

    return (
        <div class="mb-4">
            <Show when={props.label}>
                <label for={props.name} class="form-label">{props.label}</label>
            </Show>

            <Switch>
                <Match when={props.children}>
                    {props.children}
                </Match>
                <Match when={!props.options}>
                    <Input id={props.name} name={props.name} classList={{ 'is-invalid': error() }} />
                </Match>
                <Match when={props.options}>
                    <Select id={props.name} name={props.name} options={props.options as Option[]} classList={{ 'is-invalid': error() }} />
                </Match>
            </Switch>

            <Show when={error()}>
                <div class="invalid-feedback">{error()}</div>
            </Show>
        </div>
    );
}

type Option = {
    id: number;
    value: string;
}

export const Select: Component<ParentProps<{ name: string; options?: Option[];[K: string]: any }>> = function(props) {
    const { data, getValue, handleChange } = useForm();

    const value = createMemo(function() {
        return getValue(props.name, data);
    });

    return (
        <select name={props.name} class="form-control" value={value()} onInput={handleChange}>
            <Switch>
                <Match when={!props.children}>
                    <option value="">Select an option</option>
                    <For each={props.options}>{(item: Option) =>
                        <option value={item.id}>{item.value}</option>
                    }</For>
                </Match>
                <Match when={props.children}>
                    {props.children}
                </Match>
            </Switch>
        </select>
    );
}

export const Input: Component<{ name: string;[K: string]: any }> = function(props) {
    const { data, getValue, handleChange } = useForm();

    const value = createMemo(function() {
        return getValue(props.name, data);
    });

    return (
        <input
            {...props}
            class="form-control"
            onInput={handleChange}
            value={value()}
        />
    );
}

export const Form: Component<ParentProps<FormProps>> = (props: any) => {
    const [data, setData] = createStore({ ...props.initialData });
    const [errors, setErrors] = createSignal<Record<string, string>>({});

    function handleChange(evt: InputEvent) {
        const input = evt.target as HTMLInputElement
        // @ts-ignore
        setData(...input.name.split("."), input.value);
    }

    async function handleSubmit(evt: SubmitEvent) {
        evt.preventDefault();
        try {
            setErrors({});
            await props.handleSubmit(data);
        } catch (err) {
            setErrors(prev => ({ ...prev, ...(err as Record<string, string>) }));
        }
    }

    function getValue(name: string, object: Record<string, any>): string {
        const [obj, path] = name.split(".", 2);
        if (path) {
            return getValue(path, object[obj]);
        }
        return object[obj];
    }


    const value: Form = {
        data,
        errors,
        handleChange,
        getValue,
    }

    return (
        <FormContext.Provider value={value}>
            <form onSubmit={handleSubmit}>
                {props.children}
            </form>
        </FormContext.Provider>
    );
}

export function useForm() {
    return useContext(FormContext) as Form;
}
