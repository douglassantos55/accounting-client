import { Route } from "@solidjs/router";
import { Component, lazy } from "solid-js";

const List = lazy(() => import('./accounts/List'));
const Form = lazy(() => import('./accounts/Form'));

const Accounts: Component = () => {
    return (
        <>
            <Route path="/" component={List} />
            <Route path="/create" component={Form} />
        </>
    );
}

export default Accounts;
