import { Accessor, Component, createContext, createEffect, createMemo, createSignal, For, JSXElement, Match, onMount, ParentProps, Show, Switch, useContext } from "solid-js";
import { createStore } from "solid-js/store";

type Form = {
    data: Record<string, any>;
    errors: Accessor<Record<string, string>>;
    handleChange: (evt: InputEvent) => void;
    getValue: (path: string, data: Record<string, any>) => string;
}

type FormProps = {
    initialData: () => Promise<Record<string, any>>;
    handleSubmit: (data: Record<string, any>) => Promise<void>;
    children?: JSXElement | ((value: Form) => JSXElement);
}

const FormContext = createContext<Form>();

type FieldProps = {
    for?: string;
    label?: string;
}

export const Field: Component<ParentProps<FieldProps>> = function(props) {
    return (
        <div class="mb-4">
            <Show when={props.label}>
                <label for={props.for} class="form-label">{props.label}</label>
            </Show>

            {props.children}
        </div>
    );
}

type Option = {
    id: number;
    value: string;
}

export const Select: Component<ParentProps<{ options?: Option[];[K: string]: any }>> = function(props) {
    const { data, getValue, handleChange } = useForm();

    const value = createMemo(function() {
        return getValue(props.name, data);
    });

    return withError(
        <select {...props} class="form-control" value={value()} onInput={handleChange}>
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

type InputProps = {
    name: string;
    type?: string;
    [K: string]: any;
}

export const Input: Component<InputProps> = function(props) {
    const { data, getValue, handleChange } = useForm();

    const value = createMemo(function() {
        return getValue(props.name, data);
    });

    return withError(
        <input
            {...props}
            class="form-control"
            onInput={handleChange}
            value={value()}
        />
    );
}

export const SwitchInput: Component<InputProps> = function(props) {
    const { data, getValue, handleChange } = useForm();

    const value = createMemo(function() {
        return !!getValue(props.name, data);
    });

    return withError(
        <div class="form-check form-switch">
            <input
                {...props}
                name={props.name}
                class="form-check-input"
                type="checkbox"
                role="switch"
                checked={value()}
                onInput={handleChange}
            />
            <label class="form-check-label" for={props.id}>
                {props.label}
            </label>
        </div>
    );
}

const withError = function(component: JSXElement) {
    const { errors } = useForm();

    const error = createMemo(function() {
        const name = (component as HTMLInputElement).name;
        return errors()[name];
    });

    createEffect(function() {
        const field = component as HTMLElement;
        if (error()) {
            field.classList.add('is-invalid');
        } else {
            field.classList.remove('is-invalid');
        }
    });

    return (
        <>
            {component}
            <Show when={error()}>
                <div class="invalid-feedback">
                    {error()}
                </div>
            </Show>
        </>
    );
}

export const Form: Component<FormProps> = (props) => {
    const [data, setData] = createStore();
    const [loading, setLoading] = createSignal(true);
    const [errors, setErrors] = createSignal<Record<string, string>>({});

    onMount(async function() {
        setData(await props.initialData());
        setLoading(false);
    });

    function handleChange(evt: InputEvent) {
        const input = evt.target as HTMLInputElement
        let value: boolean | string = input.value;
        if (['checkbox', 'radio'].includes(input.type)) {
            value = input.checked;
        }
        // @ts-ignore
        setData(...input.name.split("."), value);
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
            <Show when={!loading()} fallback={<p>Fetching data...</p>}>
                <form onSubmit={handleSubmit}>
                    {typeof props.children == "function"
                        ? props.children(value)
                        : props.children}
                </form>
            </Show>
        </FormContext.Provider>
    );
}

export function useForm() {
    return useContext(FormContext) as Form;
}
