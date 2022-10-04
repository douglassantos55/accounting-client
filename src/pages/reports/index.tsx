import { Route } from "@solidjs/router";
import { Component, lazy } from "solid-js";

const BalanceSheet = lazy(() => import('./BalanceSheet'));
const IncomeStatement = lazy(() => import('./IncomeStatement'));

const Reports: Component = function() {
    return (
        <>
            <Route path="/balance-sheet" component={BalanceSheet} />
            <Route path="/income-statement" component={IncomeStatement} />
        </>
    );
}

export default Reports;
