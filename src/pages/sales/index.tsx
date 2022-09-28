import { Route } from "@solidjs/router";
import { Component, lazy } from "solid-js";

const Form = lazy(() => import('./Form'));

const Sales: Component = function() {
    return (
        <>
            <Route path="/create" component={Form} />

        </>
    );
}

export default Sales;
