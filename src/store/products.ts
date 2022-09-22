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

    function _normalize(data: Record<string, string>) {
        return {
            Name: data.Name,
            Purchasable: data.Purchasable,
            Price: parseFloat(data.Price),
            VendorID: parseInt(data.VendorID),
            InventoryAccountID: parseInt(data.InventoryAccountID),
            RevenueAccountID: data.Purchasable ? parseInt(data.RevenueAccountID) : null,
            CostOfSaleAccountID: data.Purchasable ? parseInt(data.CostOfSaleAccountID) : null,
        };
    }

    async function save(data: Record<string, string>) {
        let product: Product;
        if (data.ID) {
            product = await axios.put(`/products/${data.ID}`, _normalize(data));
        } else {
            product = await axios.post('/products', _normalize(data));
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
