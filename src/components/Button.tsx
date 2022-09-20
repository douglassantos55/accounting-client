import { Component, createSignal, ParentProps } from "solid-js";

type ButtonProps = {
    class?: string;
    onClick?: () => any;
    type?: "button" | "submit" | "reset";
}

const Button: Component<ParentProps<ButtonProps>> = function(props) {
    props.type = props.type || "button";
    props.onClick = process(props.onClick);

    const [loading, setLoading] = createSignal(false);

    function process(callback?: () => Promise<void>) {
        return async function() {
            if (callback) {
                setLoading(true);
                await callback();
                setLoading(false);
            }
        }
    }

    return (
        <button {...props} disabled={loading()}>
            {props.children}
        </button>
    );
}

export default Button;
