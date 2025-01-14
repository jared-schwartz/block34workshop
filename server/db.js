const pg = require("pg");
const uuid = require("uuid");
const express = require("express");
const app = express();

const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/acme_reservations_db');

const createTables = async () => {
    const SQL = `
      drop table if exists reservations;
      drop table if exists restaurants;
      drop table if exists customers;
      create table customers(
        id uuid primary key,
        name varchar(50) not null unique
      );
      create table restaurants(
        id uuid primary key,
        name varchar(50) not null unique
      );
      create table reservations(
        id uuid primary key,
        date date not null,
        restaurant_id uuid references restaurants(id) not null,
        customer_id uuid references customers(id) not null
      );
    `;
    await client.query(SQL);
};
const seedTables = async () => {
  let SQL = `
    insert into customers(name, id) values
      ('Remi Coopson', $1),
      ('Sam Tattle', $2),
      ('Lauren Parnell', $3),
      ('Jared Schwartz', $4),
      ('Eric Darnell', $5),
      ('Jesse Wiegand', $6),
      ('Johnathan Pedersen', $7)
  `;
  await client.query(SQL, [uuid.v4(), uuid.v4(), uuid.v4(), uuid.v4(), uuid.v4(), uuid.v4(), uuid.v4()]);
  SQL = `
    insert into restaurants(name, id) values
      ('Buckeys', $1),
      ('Kwik Trip', $2),
      ('Popeyes', $3),
      ('Burgers', $4),
      ('Golden Corral', $5),
      ('Buckets', $6),
      ('Mc Donalds', $7)
  `;
  await client.query(SQL, [uuid.v4(), uuid.v4(), uuid.v4(), uuid.v4(), uuid.v4(), uuid.v4(), uuid.v4()]);
};
const createCustomer = async (name) => {
  const SQL = `
    insert into customers(id, name) values ($1, $2) returning *
  `;
  const response = await client.query(SQL, [uuid.v4(), name]);
  return response.rows[0];
};
const createRestaurant = async (name) => {
  const SQL = `
    insert into restaurants(id, name) values($1, $2) returning *  
  `;
  const response = await client.query(SQL, [uuid.v4(), name]);
  return response.rows[0];
};
const fetchCustomers = async () => {
  const SQL = `
    select name, id from customers
  `;
  const response = await client.query(SQL);
  return response.rows[0];
};
const fetchRestaurants = async () => {
  const SQL = `
    select name, id from restaurants
  `;
  const response = await client.query(SQL);
  return response.rows[0];
};
const createReservations = async ({ customer_id, restaurant_id, party_count, date }) => {
  const SQL = `
    insert into reservations(id, restaurant_id, customer_id, party_count, date) values($1, $2, $3, $4, $5)
  `;
  const response = await client.query(SQL, [uuid.v4(), restaurant_id, customer_id, party_count, date]);
  return response.rows[0];
};
const fetchReservations = async () => {
  const SQL = `
    select id, date, party_count, restaurant_id, customer_id
  `;
  const response = await client.query(SQL);
  return response.rows;
};
const destroyReservation = async ({ id, customer_id }) => {
  const SQL = `
    delete from reservations where id=$1 and customer_id=$2
  `;
  await client.query(SQL, [id, customer_id]);
};
module.exports = {
  client,
  createTables,
  seedTables,
  createCustomer,
  createRestaurant,
  createReservations,
  fetchCustomers,
  fetchRestaurants,
  fetchReservations,
  destroyReservation
};