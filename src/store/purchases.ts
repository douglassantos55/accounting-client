import { normalize, schema } from "normalizr";
import { Accessor, createMemo, createRoot } from "solid-js";
import { makeStore, Module } from ".";
import axios from "../axios";
import { Account, Entry, Product, Purchase, Transaction, Vendor } from "../types";
import accounts, { AccountEntity } from "./accounts";
import entries, { EntryEntity } from "./entries";
import products, { ProductEntity } from "./products";
import transactions from "./transactions";
import vendors from "./vendors";

export type PurchaseModule = Module<Purchase>;

type Entities = {
    vendors: Record<number, Vendor>;
    products: Record<number, Product>;
    accounts: Record<number, Account>;
    purchases: Record<number, Purchase>;
    entries: Record<number, Entry>;
    transactions: Record<number, Transaction>;
}

export const PurchaseEntity = new schema.Entity('purchases', {
    Product: ProductEntity,
    PaymentEntry: EntryEntity,
    PayableEntry: EntryEntity,
    PaymentAccount: AccountEntity,
    PayableAccount: AccountEntity,
}, { idAttribute: 'ID' });

type Getters = {
    all: Accessor<Purchase[]>;
    get: (id: number) => Purchase;
}

function create(): PurchaseModule & Getters {
    const store = makeStore<Purchase>();

    const getters = createRoot(function() {
        const get = function(id: number) {
            return withRelations(store.state.byId[id]);
        }

        function withRelations(purchase: Purchase) {
            return {
                ...purchase,
                Product: products.get(purchase.ProductID),
                PaymentAccount: accounts.get(purchase.PaymentAccountID),
                PayableAccount: accounts.get(purchase.PayableAccountID),
            }
        }

        const all = createMemo(function() {
            return store.state.ids.map(function(id: number) {
                return get(id);
            });
        });
        return { all, get };

    });

    async function fetch(id: number): Promise<Purchase> {
        if (!store.state.byId[id]) {
            const response = await axios.get(`/purchases/${id}`);
            const { entities } = normalize<Purchase, Entities>(response, PurchaseEntity);

            vendors.setEntities(entities.vendors);
            accounts.setEntities(entities.accounts);
            products.setEntities(entities.products);
            transactions.setEntities(entities.transactions);
            entries.setEntities(entities.entries);
            store.setEntities(entities.purchases);
        }
        return store.state.byId[id];
    }

    async function fetchAll() {
        if (!store.state.fetched) {
            const response = await axios.get('/purchases');
            const { result, entities } = normalize<Purchase, Entities>(response, [PurchaseEntity]);

            vendors.setEntities(entities.vendors);
            accounts.setEntities(entities.accounts);
            products.setEntities(entities.products);
            transactions.setEntities(entities.transactions);
            entries.setEntities(entities.entries);
            store.setAll(result, entities.purchases);
        }
    }

    async function save(data: Record<string, string>) {
        let purchase: Purchase;
        if (data.ID) {
            purchase = await axios.put(`/purchases/${data.ID}`, _normalize(data));
        } else {
            purchase = await axios.post('/purchases', _normalize(data));
        }
        const { entities } = normalize<Purchase, Entities>(purchase, PurchaseEntity);
        vendors.setEntities(entities.vendors);
        transactions.setEntities(entities.transactions);
        entries.setEntities(entities.entries);
        store.save(purchase.ID, purchase);
    }

    function _normalize(data: Record<string, string>) {
        return {
            Paid: data.Paid,
            Qty: parseInt(data.Qty),
            Price: parseFloat(data.Price),
            ProductID: parseInt(data.ProductID),
            PayableAccountID: parseInt(data.PayableAccountID),
            PaymentAccountID: data.Paid ? parseInt(data.PaymentAccountID) : null,
            PaymentDate: data.Paid ? new Date(data.PaymentDate).toISOString() : null,
        };
    }

    async function deletePurchase(id: number) {
        await axios.delete(`/purchases/${id}`);

        const purchase = store.state.byId[id]
        if (purchase.PaymentEntryID) {
            entries.remove(purchase.PaymentEntryID);
        }
        if (purchase.PayableEntryID) {
            entries.remove(purchase.PayableEntryID);
        }

        store.remove(id);
    }

    return {
        save,
        fetch,
        fetchAll,
        state: store.state,
        delete: deletePurchase,
        setEntities: store.setEntities,
        ...getters,
    };
}
export default create();
