import { Link, Route, Routes } from '@solidjs/router';
import { Component, lazy } from 'solid-js';
import Home from './pages/Home';

const Accounts = lazy(() => import('./pages/accounts'));
const Customers = lazy(() => import('./pages/customers'));
const Vendors = lazy(() => import('./pages/vendors'));

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
                                <a href="/customers" class="nav-link">Customers</a>
                            </li>
                            <li class="nav-item">
                                <a href="#" class="nav-link">Products</a>
                            </li>
                            <li class="nav-item">
                                <a href="/vendors" class="nav-link">Vendors</a>
                            </li>
                            <li class="nav-item">
                                <a href="#" class="nav-link">Services</a>
                            </li>
                            <li class="nav-item">
                                <a href="#" class="nav-link">Purchases</a>
                            </li>
                            <li class="nav-item">
                                <a href="#" class="nav-link">Sales</a>
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
                </Routes>
            </main>
        </>
    );
};

export default App;
