import { makeStore, Module } from ".";
import axios from "../axios";
import { Vendor } from "../types";

export type VendorModule = Module<Vendor>;

function create(): VendorModule {
    const store = makeStore<Vendor>();

    async function fetch(id: number) {
        if (!store.state.byId[id]) {
            store.save(id, await axios.get(`/vendors/${id}`));
        }
        return store.state.byId[id];
    }

    async function fetchAll() {
        if (!store.state.fetched) {
            store.set(await axios.get('/vendors'));
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
        state: store.state,
    }
}

export default create();