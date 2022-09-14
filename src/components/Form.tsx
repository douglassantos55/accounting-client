import { Accessor, Component, createContext, createSignal, ParentProps, useContext } from "solid-js";

type Error = {
    error: string;
}

type Form = {
    errors: Accessor<string[]>;
    data: Accessor<Record<string, any>>;
    handleChange: (evt: InputEvent) => void;
}

type FormProps = {
    initialData: Record<string, any>;
    handleSubmit: (data: Record<string, any>) => Promise<void>;
}

const FormContext = createContext<Form>();

export const Form: Component<ParentProps<FormProps>> = (props: any) => {
    const [data, setData] = createSignal(props.initialData);
    const [errors, setErrors] = createSignal<string[]>([]);

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
            setErrors([]);
            await props.handleSubmit(data());
        } catch (err) {
            setErrors(prev => ([...prev, (err as Error).error]));
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
