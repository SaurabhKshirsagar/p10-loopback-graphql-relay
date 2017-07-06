'use strict';

const expect = require('chai').expect;
const chai = require('chai')
    .use(require('chai-http'));
const server = require('../server/server');
const gql = require('graphql-tag');
const Promise = require('bluebird');
const cpx = require('cpx');

describe('Relations', () => {

  before(() => Promise.fromCallback(cb => cpx.copy('./data.json', './data/', cb)));

  it('should query related entity with nested relational data', () => {
    const query = gql `
              {
                Customer {
                  CustomerFind(first: 2) {
                    edges {
                      node {
                        name
                        age
                        orders {
                          edges {
                            node {
                              date
                              description
                              customer {
                                name
                                age
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }`;
    return chai.request(server)
              .post('/graphql')
              .send({
                query
              })
              .then((res) => {
                expect(res).to.have.status(200);
                expect(res.body.data.Customer.CustomerFind.edges.length).to.equal(2);
              });
  });

  describe('hasManyAndBelongsToMany', () => {
    it('Author should have two books', () => {
      const query = gql `
        {
          node(id: "QXV0aG9yOjEw") {
            ... on Author {
              id
              first_name
              last_name
              books(last: 1) {
                totalCount
                pageInfo {
                  hasNextPage
                  hasPreviousPage
                  startCursor
                  endCursor
                }
                edges {
                  node {
                    id
                    name
                  }
                  cursor
                }
              }
            }
          }
        }`;
      return chai.request(server)
                .post('/graphql')
                .send({
                  query
                })
                .then((res) => {
                  expect(res).to.have.status(200);
                  const result = res.body.data;
                  expect(result.node.first_name).to.equal('Cool');
                  expect(result.node.books.totalCount).to.equal(2);
                  expect(result.node.books.edges.length).to.equal(1);
                  expect(result.node.books.edges[0].node.name).to.equal('Lame Book');
                });
    });
  });

  describe('hasMany', () => {
    it('should have one author and two notes', () => {
      const query = gql `
        {
          Author {
            AuthorFindById(id: 3) {
              id
              first_name
              last_name
              notes {
                edges {
                  node {
                    id
                    title
                  }
                }
              }
            }
          }
        }`;
      return chai.request(server)
                .post('/graphql')
                .send({
                  query
                })
                .then((res) => {
                  expect(res).to.have.status(200);
                  const result = res.body.data;
                  expect(result.Author.AuthorFindById.first_name).to.equal('Virginia');
                  expect(result.Author.AuthorFindById.notes.edges.length).to.equal(2);
                });
    });
  });

  describe('referencesMany', () => {
    it('should have one author and two friendIds', () => {
      const query = gql `
        {
          node(id: "QXV0aG9yOjg=") {
            ... on Author {
              id
              first_name
              last_name
              friendIds
            }
          }
        }`;
      return chai.request(server)
                .post('/graphql')
                .send({
                  query
                })
                .then((res) => {
                  expect(res).to.have.status(200);
                  const result = res.body.data;
                  expect(result.node.first_name).to.equal('Jane');
                  expect(result.node.friendIds.length).to.equal(2);
                });
    });
  });


  describe('embedsMany', () => {
    it('should have one book and two links', () => {
      const query = gql `
        {
          Book {
            BookFindById(id: 1) {
              id
              name
              links {
                id
              }
            }
          }
        }`;
      return chai.request(server)
                .post('/graphql')
                .send({
                  query
                })
                .then((res) => {
                  expect(res).to.have.status(200);
                  const result = res.body.data;
                  expect(result.Book.BookFindById.name).to.equal('Book 1');
                  expect(result.Book.BookFindById.links.length).to.equal(2);
                });
    });
  });

  describe('embedsOne', () => {
    it('should have a billingAddress', () => {
      const query = gql `
        {
          node(id: "Q3VzdG9tZXI6Ng==") {
            ... on Customer {
              id
              billingAddress {
                id
                street
                city
                state
                zipCode
              }
            }
          }
        }`;
      return chai.request(server)
                .post('/graphql')
                .send({
                  query
                })
                .then((res) => {
                  expect(res).to.have.status(200);
                  const result = res.body.data;
                  expect(result.node.billingAddress.zipCode).to.equal('95131');
                });
    });
  });

  describe('belongsTo', () => {
    it('should have a note and its owner', () => {
      const query = gql `
        {
          node(id: "Tm90ZToy") {
            ... on Note {
              id
              title
              author {
                id
                first_name
                last_name
              }
            }
          }
        }`;
      return chai.request(server)
                .post('/graphql')
                .send({
                  query
                })
                .then((res) => {
                  expect(res).to.have.status(200);
                  const result = res.body.data;
                  expect(result.node.title).to.equal('Who is Afraid');
                  expect(result.node.author.first_name).to.equal('Virginia');
                });
    });
  });


  describe('hasOne', () => {
    it('should have orders with its customer', () => {
      const query = gql `
        {
          Order {
            OrderFindById(id: 1) {
              id
              description
              customer {
                id
                name
              }
            }
          }
        }`;
      return chai.request(server)
                .post('/graphql')
                .send({
                  query
                })
                .then((res) => {
                  expect(res).to.have.status(200);
                  const result = res.body.data;
                  expect(result.Order.OrderFindById.customer.name).to.equal('Customer A');
                });
    });
  });
});
