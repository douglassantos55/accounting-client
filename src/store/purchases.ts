import { normalize, schema } from "normalizr";
import { makeStore, Module } from ".";
import axios from "../axios";
import { Account, Product, Purchase } from "../types";
import accounts, { AccountEntity } from "./accounts";
import products, { ProductEntity } from "./products";

export type PurchaseModule = Module<Purchase>;

type Entities = {
    products: Record<number, Product>;
    accounts: Record<number, Account>;
    purchases: Record<number, Purchase>;
}

export const PurchaseEntity = new schema.Entity('purchases', {
    Product: ProductEntity,
    PaymentAccount: AccountEntity,
    PayableAccount: AccountEntity,
}, { idAttribute: 'ID' });

function create(): PurchaseModule {
    const store = makeStore<Purchase>();

    async function fetch(id: number): Promise<Purchase> {
        if (!store.state.byId[id]) {
            const response = axios.get(`/purchases/${id}`);
            const { entities } = normalize<Purchase, Entities>(response, PurchaseEntity);

            accounts.setEntities(entities.accounts);
            products.setEntities(entities.products);
            store.setEntities(entities.purchases);
        }
        return store.state.byId[id];
    }

    async function fetchAll() {
        if (!store.state.fetched) {
            const response = axios.get('/purchases');
            const { result, entities } = normalize<Purchase, Entities>(response, [PurchaseEntity]);

            accounts.setEntities(entities.accounts);
            products.setEntities(entities.products);
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
        store.save(purchase.ID, purchase);
    }

    function _normalize(data: Record<string, string>) {
        return {
            Paid: data.Paid,
            Qty: parseInt(data.Qty),
            Price: parseFloat(data.Price),
            ProductID: parseInt(data.ProductID),
            PaymentAccountID: parseInt(data.PaymentAccountID),
            PayableAccountID: parseInt(data.PayableAccountID),
        };
    }

    async function deletePurchase(id: number) {
        await axios.delete(`/purchases/${id}`);
        store.remove(id);
    }

    return {
        save,
        fetch,
        fetchAll,
        state: store.state,
        delete: deletePurchase,
        setEntities: store.setEntities,
    };
}
export default create();
