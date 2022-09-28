import { Link, Route, Routes } from '@solidjs/router';
import { Component, lazy } from 'solid-js';
import Home from './pages/Home';

const Accounts = lazy(() => import('./pages/accounts'));
const Customers = lazy(() => import('./pages/customers'));
const Vendors = lazy(() => import('./pages/vendors'));
const Products = lazy(() => import('./pages/products'));
const Services = lazy(() => import('./pages/services'));
const Purchases = lazy(() => import('./pages/purchases'));
const Entries = lazy(() => import('./pages/entries'));
const Sales = lazy(() => import('./pages/sales'));

const App: Component = () => {
    return (
        <>
            <header class="navbar navbar-expand-md bg-light">
                <div class="container">
                    <Link class="navbar-brand" href="/">Accounting</Link>

                    <div class="collapse navbar-collapse">
                        <ul class="navbar-nav ms-auto">
                            <li class="nav-item">
                                <Link href="/accounts" class="nav-link">Accounts</Link>
                            </li>
                            <li class="nav-item">
                                <Link href="/customers" class="nav-link">Customers</Link>
                            </li>
                            <li class="nav-item">
                                <Link href="/products" class="nav-link">Products</Link>
                            </li>
                            <li class="nav-item">
                                <Link href="/vendors" class="nav-link">Vendors</Link>
                            </li>
                            <li class="nav-item">
                                <Link href="/services" class="nav-link">Services</Link>
                            </li>
                            <li class="nav-item">
                                <Link href="/purchases" class="nav-link">Purchases</Link>
                            </li>
                            <li class="nav-item">
                                <Link href="/sales" class="nav-link">Sales</Link>
                            </li>
                            <li class="nav-item">
                                <Link href="/entries" class="nav-link">Entries</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </header>

            <main>
                <Routes>
                    <Route path="/" component={Home} />

                    <Route path="/accounts">
                        <Accounts />
                    </Route>

                    <Route path="/customers">
                        <Customers />
                    </Route>

                    <Route path="/vendors">
                        <Vendors />
                    </Route>

                    <Route path="/products">
                        <Products />
                    </Route>

                    <Route path="/services">
                        <Services />
                    </Route>

                    <Route path="/purchases">
                        <Purchases />
                    </Route>

                    <Route path="/entries">
                        <Entries />
                    </Route>

                    <Route path="/sales">
                        <Sales />
                    </Route>
                </Routes>
            </main>
        </>
    );
};

export default App;
