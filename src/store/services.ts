import { normalize, schema } from "normalizr";
import { Accessor, createMemo, createRoot } from "solid-js";
import { makeStore, Module } from ".";
import axios from "../axios";
import { Account, Service } from "../types";
import accounts, { AccountEntity } from "./accounts";

const ServiceEntity = new schema.Entity('services', {
    RevenueAccount: AccountEntity,
    CostOfServiceAccount: AccountEntity,
}, { idAttribute: 'ID' });

type Entities = {
    accounts: Record<number, Account>;
    services: Record<number, Service>;
}

type Getters = {
    all: Accessor<Service[]>;
    get: (id: number) => Service;
}

export type ServiceModule = Module<Service> & Getters;

function create(): ServiceModule {
    const store = makeStore<Service>();

    const getters = createRoot(function() {
        function get(id: number): Service {
            return withRelations(store.state.byId[id]);
        }

        function withRelations(item: Service): Service {
            const res = {
                ...item,
                RevenueAccount: accounts.get(item.RevenueAccountID),
                CostOfServiceAccount: accounts.get(item.CostOfServiceAccountID),
            }
            console.log(res);
            return res;
        }

        const all = createMemo(function() {
            return store.state.ids.map(function(id: number) {
                return get(id);
            });
        });

        return { get, all };
    });

    async function fetch(id: number) {
        if (!getters.get(id)) {
            const response = await axios.get(`/services/${id}`);
            const { entities } = normalize<Service, Entities>(response, ServiceEntity);

            accounts.setEntities(entities.accounts);
            store.setEntities(entities.services);
        }
        return getters.get(id);
    }

    async function fetchAll() {
        if (!store.state.fetched) {
            const response = await axios.get('/services');
            const { result, entities } = normalize<Service, Entities>(response, [ServiceEntity]);

            accounts.setEntities(entities.accounts);
            store.setAll(result, entities.services);
        }
    }

    async function save(data: Record<string, string>) {
        let service: Service;
        if (data.ID) {
            service = await axios.put(`/services/${data.ID}`, _normalize(data));
        } else {
            service = await axios.post('/services', _normalize(data));
        }
        store.save(service.ID, service);
    }

    function _normalize(data: Record<string, string>) {
        return {
            Name: data.Name,
            RevenueAccountID: parseInt(data.RevenueAccountID),
            CostOfServiceAccountID: parseInt(data.CostOfServiceAccountID),
        };
    }

    async function deleteService(id: number) {
        await axios.delete(`/services/${id}`);
        store.remove(id);
    }

    return {
        save,
        fetch,
        fetchAll,
        state: store.state,
        delete: deleteService,
        setEntities: store.setEntities,
        ...getters,
    };
}

export default create();
