import type { Component } from 'solid-js';

const App: Component = () => {
    return (
        <header class="navbar navbar-expand-md bg-light">
            <div class="container">
                <a class="navbar-brand" href="#">Accounting</a>

                <div class="collapse navbar-collapse">
                    <ul class="navbar-nav ms-auto">
                        <li class="nav-item">
                            <a href="#" class="nav-link">Accounts</a>
                        </li>
                        <li class="nav-item">
                            <a href="#" class="nav-link">Customers</a>
                        </li>
                        <li class="nav-item">
                            <a href="#" class="nav-link">Products</a>
                        </li>
                        <li class="nav-item">
                            <a href="#" class="nav-link">Vendors</a>
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
    );
};

export default App;
