import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ErrorService } from './error.service';
import { Payment } from '../interfaces/Payment';
import { catchError, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  constructor(private http: HttpClient, private errorService: ErrorService) {}

  /**
   *
   * @param payment
   */
  public createPayment(payment: Payment): Observable<Payment> {
    return this.http
      .post<Payment>(environment.api + '/payments', payment)
      .pipe(
        catchError(
          this.errorService.handleErrors<any>('Property creation failed', {})
        )
      );
  }

  public getPayments(queryParams: {
    limit: number;
    page: number;
    property?: string;
    user?: string;
  }): Observable<{
    limit: number;
    page: number;
    totalPages: number;
    totalResults: number;
    results: Payment[];
  }> {
    let params = '';
    Object.keys(queryParams).forEach((key) => {
      // @ts-ignore
      if (queryParams[key]) {
        // @ts-ignore
        params = params + `${key}=${queryParams[key]}&`;
      }
    });
    return this.http
      .get<{
        limit: number;
        page: number;
        totalPages: number;
        totalResults: number;
        results: Payment[];
      }>(environment.api + `/payments?${params}`)
      .pipe(
        catchError(
          this.errorService.handleErrors<any>('Failed to get properties', {})
        )
      );
  }
}
