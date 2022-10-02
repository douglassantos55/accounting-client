import { Route } from "@solidjs/router";
import { Component, lazy } from "solid-js";

const BalanceSheet = lazy(() => import('./BalanceSheet'));

const Reports: Component = function() {
    return (
        <Route path="/balance-sheet" component={BalanceSheet} />
    );
}

export default Reports;
