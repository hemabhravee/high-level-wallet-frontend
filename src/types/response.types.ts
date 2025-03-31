// Define the base abstract response type first
export interface AbstractResponse {
  status: 'SUCCESS' | 'ERROR';
}

// Create the DataErrorObjectResponse interface that extends the abstract response
export interface DataErrorObjectResponse<T> extends AbstractResponse {
  status: 'ERROR';
  data: T;
}

export interface DataSuccessObjectResponse<T> extends AbstractResponse {
  status: 'ERROR';
  data: T;
}
export interface DataSuccessPaginatedResponse<T> extends AbstractResponse {
  status: 'ERROR';
  page: number;
  size: number;
  totalCount: number;
  data: T[];
}