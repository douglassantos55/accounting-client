import { normalize, schema } from "normalizr";
import { Accessor, createMemo, createRoot } from "solid-js";
import { makeStore, Module } from ".";
import axios from "../axios";
import { Account, Product, Vendor } from "../types";
import accounts, { AccountEntity } from "./accounts";
import vendors, { VendorEntity } from "./vendors";

export const ProductEntity = new schema.Entity('products', {
    Vendor: VendorEntity,
    RevenueAccount: AccountEntity,
    InventoryAccount: AccountEntity,
    CostOfSaleAccount: AccountEntity,
}, {
    idAttribute: 'ID',
});

type Entities = {
    vendors: Record<number, Vendor>;
    products: Record<number, Product>;
    accounts: Record<number, Account>;
}

type Getters = {
    all: Accessor<Product[]>;
}

export type ProductsModule = Module<Product> & Getters;

function create(): ProductsModule {
    const store = makeStore<Product>();

    const getters = createRoot(function() {
        const withRelations = function(item: Product) {
            return {
                ...item,
                Vendor: vendors.get(item.VendorID),
                RevenueAccount: accounts.get(item.RevenueAccountID),
                InventoryAccount: accounts.get(item.InventoryAccountID),
                CostOfSaleAccount: accounts.get(item.CostOfSaleAccountID),
            };
        };

        const all = createMemo(function() {
            return store.state.ids.map(function(id: number) {
                return withRelations(store.state.byId[id]);
            });
        });

        return { all };
    });

    async function fetch(id: number) {
        if (!store.state.byId[id]) {
            const response = await axios.get(`/products/${id}`);
            const { entities } = normalize<Product, Entities>(response, ProductEntity);

            store.setEntities(entities.products);
            vendors.setEntities(entities.vendors);
            accounts.setEntities(entities.accounts);
        }
        return store.state.byId[id];
    }

    async function fetchAll() {
        if (!store.state.fetched) {
            const response = await axios.get('/products');
            const { result, entities } = normalize<Product, Entities>(response, [ProductEntity]);

            vendors.setEntities(entities.vendors);
            accounts.setEntities(entities.accounts);
            store.setAll(result, entities.products);
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
        setEntities: store.setEntities,
        delete: deleteProduct,
        ...getters,
    };
}

export default create();
