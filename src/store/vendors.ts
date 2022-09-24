import { normalize, schema } from "normalizr";
import { Accessor, createMemo, createRoot } from "solid-js";
import { makeStore, Module } from ".";
import axios from "../axios";
import { Vendor } from "../types";

export const VendorEntity = new schema.Entity('vendors', undefined, {
    idAttribute: 'ID',
});


type Getters = {
    all: Accessor<Vendor[]>;
    get: (id: number) => Vendor;
}

type Entities = {
    vendors: Record<number, Vendor>;
}

export type VendorModule = Module<Vendor> & Getters;

function create(): VendorModule {
    const store = makeStore<Vendor>();

    const getters = createRoot(function() {
        const get = function(id: number) {
            return store.state.byId[id];
        }

        const all = createMemo(function() {
            return store.state.ids.map(function(id: number) {
                return get(id);
            });
        });

        return { all, get };
    });

    async function fetch(id: number) {
        if (!store.state.byId[id]) {
            const response = await axios.get(`/vendors/${id}`);
            const { entities } = normalize<Vendor, Entities>(response, VendorEntity);
            store.setEntities(entities.vendors);
        }
        return store.state.byId[id];
    }

    async function fetchAll() {
        if (!store.state.fetched) {
            const response = await axios.get('/vendors')
            const { result, entities } = normalize<Vendor, Entities>(response, [VendorEntity]);
            store.setAll(result, entities.vendors);
        }
    }

    async function save(data: Record<string, string>) {
        let vendor: Vendor;
        if (data.ID) {
            vendor = await axios.put(`/vendors/${data.ID}`, data);
        } else {
            vendor = await axios.post('/vendors', data);
        }
        store.save(vendor.ID, vendor);
    }

    async function deleteVendor(id: number) {
        await axios.delete(`/vendors/${id}`);
        store.remove(id);
    }

    return {
        save,
        fetch,
        fetchAll,
        delete: deleteVendor,
        setEntities: store.setEntities,
        state: store.state,
        ...getters,
    }
}

export default create();
