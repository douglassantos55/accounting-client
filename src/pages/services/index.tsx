import { Route } from "@solidjs/router";
import { Component, lazy } from "solid-js";

const List = lazy(() => import('./List'));

const Services: Component = function() {
    return (
        <>
            <Route path="/create" component={Form} />
        </>
    );
}

export default Services;