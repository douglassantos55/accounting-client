import { Route } from "@solidjs/router";
import { Component, lazy } from "solid-js";
import Form from "./Form";

const List = lazy(() => import('./List'));

const Vendors: Component = function() {
    return (
        <>
            <Route path="/" component={List} />
            <Route path="/create" component={Form} />
            <Route path="/edit/:id" component={Form} />
        </>
    );
}

export default Vendors;
