import { FilterQuery, QueryOptions } from 'mongoose';

type QueryParams = {
  [key: string]: any;
};

type MongoQueryOptions = {
  searchFields?: string[];
};

type OperatorMap = {
  [key: string]: string;
};

class MongoQuery {
  private queryParams: QueryParams;
  private searchFields: string[];
  private filterQuery: FilterQuery<any> = {};
  private queryOptions: QueryOptions = {
    page: 1,
    limit: 10,
    select: '',
    sort: '',
  };
  private operatorMap: OperatorMap = {
    or: '$or',
    gt: '$gt',
    gte: '$gte',
    options: '$options',
    lt: '$lt',
    lte: '$lte',
    elemMatch: '$elemMatch',
    in: '$in',
    nin: '$nin',
    ne: '$ne',
    equals: '$eq',
    all: '$all',
    regex: '$regex',
  };

  constructor(queryParams: QueryParams, options: MongoQueryOptions = {}) {
    this.queryParams = queryParams;
    this.searchFields = options.searchFields || [];
    this.build();
  }

  build(): MongoQuery {
    this._buildFilterQuery();
    this._buildQueryOptions();

    return this;
  }

  private _buildFilterQuery(): void {
    const { search, ...filters } = this.queryParams;

    // Handle search functionality
    if (search && this.searchFields.length > 0) {
      this.filterQuery.$or = this.searchFields.map((field) => ({
        [field]: { $regex: search, $options: 'i' },
      }));
    }

    // Handle other filters
    Object.keys(filters).forEach((key) => {
      const value = filters[key];
      if (value !== undefined && value !== null && value !== '') {
        this._parseFilter(key, value);
      }
    });
  }

  private _parseFilter(key: string, value: any): void {
    // Handle dot notation for nested objects
    if (key.includes('.')) {
      this._handleNestedFilter(key, value);
      return;
    }

    // Handle operators (e.g., gt, lt, in, etc.)
    const [field, operator] = key.split('_');
    if (operator && this.operatorMap[operator]) {
      this._handleOperatorFilter(field, operator, value);
    } else {
      // Handle simple equality filter
      this.filterQuery[key] = value;
    }
  }

  private _handleNestedFilter(key: string, value: any): void {
    // Convert dot notation to nested object (e.g., "customer.address.city" -> { customer: { address: { city: value } } })
    const keys = key.split('.');
    const lastKey = keys.pop()!;
    const nestedQuery = keys.reduceRight((acc, currentKey) => ({ [currentKey]: acc }), { [lastKey]: value });
    this.filterQuery = { ...this.filterQuery, ...nestedQuery };
  }

  private _handleOperatorFilter(field: string, operator: string, value: any): void {
    const mongoOperator = this.operatorMap[operator];
    if (!mongoOperator) {
      throw new Error(`Unsupported operator: ${operator}`);
    }

    // Handle $or separately since it requires an array
    if (mongoOperator === '$or') {
      this.filterQuery.$or = value.map((condition: any) => ({ [field]: condition }));
      return;
    }

    // Handle other operators
    if (!this.filterQuery[field]) {
      this.filterQuery[field] = {};
    }
    (this.filterQuery[field] as any)[mongoOperator] = value;
  }

  private _buildQueryOptions(): void {
    const { page, limit, select, sort } = this.queryParams;

    if (page) {
      this.queryOptions.page = parseInt(page, 10);
    }

    if (limit) {
      this.queryOptions.limit = parseInt(limit, 10);
    }

    if (select) {
      this.queryOptions.select = select.split(',').join(' ');
    }

    if (sort) {
      this.queryOptions.sort = sort.split(',').join(' ');
    }
  }

  getFilterQuery(): FilterQuery<any> {
    return this.filterQuery;
  }

  getQueryOptions(): QueryOptions {
    return this.queryOptions;
  }
}

export { MongoQuery };
