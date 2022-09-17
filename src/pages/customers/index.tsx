import { Route } from "@solidjs/router";
import { Component, lazy } from "solid-js";

const List = lazy(() => import('./List'));

const Customers: Component = function() {
    return (
        <>
            <Route path="/" component={List} />
        </>
    );
}

export default Customers;
