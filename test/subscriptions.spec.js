'use strict';
const ws = require('ws');
const { SubscriptionClient } = require('subscriptions-transport-ws');
const { ApolloClient } = require('apollo-client');
const { HttpLink } = require('apollo-link-http');
const { InMemoryCache } = require('apollo-cache-inmemory');


const Promise = require('bluebird');
const expect = require('chai').expect;
const chai = require('chai').use(require('chai-http'));
const server = require('../server/server');
const gql = require('graphql-tag');


let apollo;
let networkInterface;
const GRAPHQL_ENDPOINT = 'ws://localhost:5000/subscriptions';

/*
describe('Subscription', () => {

    before(async () => {
        networkInterface = new SubscriptionClient(
            GRAPHQL_ENDPOINT, { reconnect: true }, ws);
        apollo = new ApolloClient({
            networkInterface ,
            link: new HttpLink({ uri: 'http://localhost:3000/graphql' }),
            cache: new InMemoryCache()
        });
    });

    after(done => {
        networkInterface.close() ;
    });

    it('subscription', async () => {
        // SUBSCRIBE and make a promise
        const options = {
            query: gql`
                subscription {
                    Customer(input: {create: true,
                        clientSubscriptionId: 112,
                        options: {where: {age: 50}}}) {
                        customer {
                            name
                        }
                    }
                }
            `
        };
        const subscriptionPromise = new Promise((resolve, reject) => {
            const client = () => apollo;
            client().subscribe(options).subscribe({
                next: resolve,
                error: reject
            });
        });

        let execGraphQL;
        // MUTATE
        await execGraphQL(
            `mutation {
              Customer {
                CustomerCreate (input:{data:{name:"Atif 21", age:50}}) {
                  obj {
                    id
                    name
                  }
                }
              }
            }`
        );

        // ASSERT SUBSCRIPTION RECEIVED EVENT
        expect(await subscriptionPromise).to.deep.equal({});

    });
});*/
