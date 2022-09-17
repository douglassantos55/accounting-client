import { makeStore, Module } from ".";
import axios from "../axios";
import { Customer } from "../types";

export type CustomerModule = Module<Customer>;

function create(): Module<Customer> {
    const store = makeStore<Customer>();

    async function fetch(id: number) {
        if (!store.state.byId[id]) {
            store.save(id, await axios.get(`/customers/${id}`));
        }
        return store.state.byId[id];
    }

    async function fetchAll() {
        if (!store.state.fetched) {
            store.set(await axios.get('/customers'));
        }
    }

    async function save(data: Record<string, string>) {
        let customer: Customer;
        if (data.ID) {
            customer = await axios.put(`/customers/${data.ID}`, data);
        } else {
            customer = await axios.post('/customers', data);
        }
        store.save(customer.ID, customer);
    }

    async function deleteCustomer(id: number) {
        await axios.delete(`/customers/${id}`);
        store.remove(id);
    }

    return {
        state: store.state,
        fetch,
        fetchAll,
        save,
        delete: deleteCustomer,
    };
}

export default create();
