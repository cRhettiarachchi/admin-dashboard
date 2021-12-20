import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  constructor(private toastr: ToastrService) {}

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  handleErrors<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error.error); // log to console instead
      const msg = error.error ? error.error.message : 'Operation failed';

      // Let the app keep running by returning an empty result.
      this.toastr.error(msg);
      return of(result as T);
    };
  }
}
