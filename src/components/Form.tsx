import { Accessor, Component, createContext, createMemo, createSignal, ParentProps, Show, useContext } from "solid-js";

type Form = {
    errors: Accessor<Record<string, string>>;
    data: Accessor<Record<string, any>>;
    handleChange: (evt: InputEvent) => void;
}

type FormProps = {
    initialData: Record<string, any>;
    handleSubmit: (data: Record<string, any>) => Promise<void>;
}

const FormContext = createContext<Form>();

type FieldProps = {
    name: string;
    label?: string;
}

export const Field: Component<FieldProps> = function(props) {
    const { errors } = useForm();

    const error = createMemo(function() {
        return errors()[props.name];
    });

    return (
        <div class="mb-4">
            <Show when={props.label}>
                <label for={props.name} class="form-label">{props.label}</label>
            </Show>

            <Input id={props.name} name={props.name} classList={{ 'is-invalid': error() }} />

            <Show when={error()}>
                <div class="invalid-feedback">{error()}</div>
            </Show>
        </div>
    );
}

export const Input: Component<{ name: string;[K: string]: any }> = function(props) {
    const { data, handleChange } = useForm();
    return (
        <input
            {...props}
            class="form-control"
            onInput={handleChange}
            value={data()[props.name]}
        />
    );
}

export const Form: Component<ParentProps<FormProps>> = (props: any) => {
    const [data, setData] = createSignal(props.initialData);
    const [errors, setErrors] = createSignal<Record<string, string>>({});

    function handleChange(evt: InputEvent) {
        const input = evt.target as HTMLInputElement
        setData(prev => ({
            ...prev,
            [input.name]: input.value,
        }))
    }

    async function handleSubmit(evt: SubmitEvent) {
        evt.preventDefault();
        try {
            setErrors({});
            await props.handleSubmit(data());
        } catch (err) {
            setErrors(prev => ({ ...prev, ...(err as Record<string, string>) }));
        }
    }

    const value: Form = {
        data,
        errors,
        handleChange,
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
