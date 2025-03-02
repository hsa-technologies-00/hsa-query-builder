# @hsa-technologies-00/hsa-query-builder

![License](https://img.shields.io/npm/l/@hsa-technologies-00/hsa-query-buildr)
![Version](https://img.shields.io/npm/v/@hsa-technologies-00/hsa-query-builder)
![Downloads](https://img.shields.io/npm/dm/@hsa-technologies-00/hsa-query-builder)

A powerful and flexible MongoDB query builder for Mongoose, designed to simplify the creation of complex queries. This package supports advanced filtering, searching, pagination, sorting, and more, with full TypeScript support.

---

## Features

- **Dynamic Query Building**: Easily build MongoDB queries using a simple and intuitive API.
- **Advanced Filtering**: Supports MongoDB operators like `$gt`, `$lt`, `$in`, `$regex`, and more.
- **Dot Notation Support**: Filter nested objects using dot notation (e.g., `customer.address.city`).
- **Search Functionality**: Perform case-insensitive searches across multiple fields.
- **Pagination & Sorting**: Built-in support for pagination, limiting, selecting fields, and sorting.
- **TypeScript Support**: Fully typed for better developer experience and type safety.

---

## Installation

Install the package using npm:

```bash
npm install @hsa-technologies-00/hsa-query-builder
```

Or using yarn:

```bash
yarn add @hsa-technologies-00/hsa-query-builder
```

---

## Usage

### Basic Example

```typescript
import { MongoQuery } from '@hsa-technologies-00/hsa-query-builder';

const queryParams = {
  search: 'John',
  age_gt: 25,
  'customer.address.city': 'New York',
  page: 2,
  limit: 20,
  select: 'name,age',
  sort: 'age,-name',
};

const filter = new MongoQuery(queryParams, {
  searchFields: ['name', 'email'],
}).build();

const query = filter.getFilterQuery();
const options = filter.getQueryOptions();

console.log('Filter Query:', query);
console.log('Query Options:', options);
```

### Output

```javascript
Filter Query: {
  $or: [
    { name: { $regex: 'John', $options: 'i' } },
    { email: { $regex: 'John', $options: 'i' } }
  ],
  age: { $gt: 25 },
  customer: { address: { city: 'New York' } }
}

Query Options: {
  page: 2,
  limit: 20,
  select: 'name age',
  sort: 'age -name'
}
```

---

## API Documentation

### `MongoQuery`

#### Constructor

```typescript
new MongoQuery(queryParams: QueryParams, options?: MongoQueryOptions)
```

- **`queryParams`**: An object containing query parameters (e.g., `search`, `age_gt`, `page`, `limit`, etc.).
- **`options`**: Optional configuration object with the following properties:
  - **`searchFields`**: An array of fields to search (e.g., `["name", "email"]`).

#### Methods

- **`build()`**: Builds the filter query and query options.
- **`getFilterQuery()`**: Returns the MongoDB filter query.
- **`getQueryOptions()`**: Returns the query options (e.g., `page`, `limit`, `select`, `sort`).

---

### Supported Operators

The following MongoDB operators are supported:

| Operator    | MongoDB Equivalent | Example Usage                           |
| ----------- | ------------------ | --------------------------------------- |
| `or`        | `$or`              | `{ age_or: [20, 25] }`                  |
| `gt`        | `$gt`              | `{ age_gt: 25 }`                        |
| `gte`       | `$gte`             | `{ age_gte: 25 }`                       |
| `lt`        | `$lt`              | `{ age_lt: 30 }`                        |
| `lte`       | `$lte`             | `{ age_lte: 30 }`                       |
| `in`        | `$in`              | `{ age_in: [20, 25] }`                  |
| `nin`       | `$nin`             | `{ age_nin: [20, 25]}`                  |
| `ne`        | `$ne`              | `{ age_ne: 25 }`                        |
| `equals`    | `$eq`              | `{ age_equals: 25 }`                    |
| `regex`     | `$regex`           | `{ name_regex: "John"}`                 |
| `elemMatch` | `$elemMatch`       | `{ tags_elemMatch: { $in: ["tech"] } }` |
| `all`       | `$all`             | `{ tags_all: ["tech", "mongodb"] }`     |

---

### Dot Notation Support

You can filter nested objects using dot notation. For example:

```typescript
const queryParams = {
  'customer.address.city': 'New York',
};
```

This will generate the following MongoDB query:

```javascript
{
  customer: {
    address: {
      city: 'New York';
    }
  }
}
```

---

### Search Functionality

To perform a case-insensitive search across multiple fields, use the `search` parameter and specify the `searchFields` option:

```typescript
const queryParams = {
  search: 'John',
};

const filter = new MongoQuery(queryParams, {
  searchFields: ['name', 'email'],
}).build();
```

This will generate the following MongoDB query:

```javascript
{
  $or: [{ name: { $regex: 'John', $options: 'i' } }, { email: { $regex: 'John', $options: 'i' } }];
}
```

---

### Pagination & Sorting

The following query parameters are supported for pagination and sorting:

- **`page`**: The page number (default: `1`).
- **`limit`**: The number of items per page (default: `10`).
- **`select`**: Fields to include or exclude (e.g., `name,age`).
- **`sort`**: Sorting criteria (e.g., `age,-name` for ascending by `age` and descending by `name`).

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a pull request.

---

## License

This project is licensed under the MIT License.

---

## Author

- **Md Harun Or Rashid**
  - Email: [harun.ru.cse@gmail.com](mailto:harun.ru.cse@gmail.com)
  - Website: [https://harun-dev.vercel.app](https://harun-dev.vercel.app)

---

## Support

If you find this package useful, please consider giving it a ⭐️ on [GitHub](https://github.com/hsa-technologies-00/hsa-query-builder).

---

Enjoy building MongoDB queries with ease! 🚀
