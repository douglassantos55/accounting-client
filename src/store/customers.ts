import { normalize, schema } from "normalizr";
import { makeStore, Module } from ".";
import axios from "../axios";
import { Customer } from "../types";

export const CustomerEntity = new schema.Entity('customers', undefined, {
    idAttribute: 'ID',
});

type Entities = {
    customers: Record<number, Customer>;
}

export type CustomerModule = Module<Customer>;

function create(): Module<Customer> {
    const store = makeStore<Customer>();

    async function fetch(id: number) {
        if (!store.state.byId[id]) {
            const response = await axios.get(`/customers/${id}`);
            const { entities } = normalize<Customer, Entities>(response, CustomerEntity);
            store.setEntities(entities.customers);
        }
        return store.state.byId[id];
    }

    async function fetchAll() {
        if (!store.state.fetched) {
            const response = await axios.get('/customers');
            const { result, entities } = normalize<Customer, Entities>(response, [CustomerEntity]);
            store.setAll(result, entities.customers);
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
        setEntities: store.setEntities,
    };
}

export default create();
