import { makeStore, Module } from ".";
import axios from "../axios";
import { Product } from "../types";

export type ProductsModule = Module<Product>;

function create(): ProductsModule {
    const store = makeStore<Product>();

    async function fetch(id: number) {
        if (!store.state.byId[id]) {
            store.save(id, await axios.get(`/products/${id}`));
        }
        return store.state.byId[id];
    }

    async function fetchAll() {
        if (!store.state.fetched) {
            store.set(await axios.get('/products'));
        }
    }

    async function save(data: Record<string, string>) {
        let product: Product;
        if (data.ID) {
            product = await axios.put(`/products/${data.ID}`, data);
        } else {
            product = await axios.post('/products', data);
        }
        store.save(product.ID, product);
    }

    async function deleteProduct(id: number) {
        await axios.delete(`/products/${id}`);
        store.remove(id);
    }

    return {
        state: store.state,
        fetch,
        fetchAll,
        save,
        delete: deleteProduct,
    };
}

export default create();
