import { Route } from "@solidjs/router";
import { Component, lazy } from "solid-js";

const List = lazy(() => import('./List'));
const Form = lazy(() => import('./Form'));

const Sales: Component = function() {
    return (
        <>
            <Route path="/" component={List} />
            <Route path="/create" component={Form} />

        </>
    );
}

export default Sales;
