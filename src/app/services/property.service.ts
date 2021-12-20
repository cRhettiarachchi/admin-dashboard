import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ErrorService } from './error.service';
import { catchError, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Property } from '../interfaces/Property';

@Injectable({
  providedIn: 'root',
})
export class PropertyService {
  constructor(private http: HttpClient, private errorService: ErrorService) {}

  /**
   * Gets properties with pagination
   * @param queryParams
   */
  public getProperties(queryParams: {
    limit: number;
    page: number;
  }): Observable<{
    limit: number;
    page: number;
    totalPages: number;
    totalResults: number;
    results: Property[];
  }> {
    return this.http
      .get<
        Observable<{
          limit: number;
          page: number;
          totalPages: number;
          totalResults: number;
          results: Property[];
        }>
      >(
        environment.api +
          `/properties?limit=${queryParams.limit}&page=${queryParams.page}`
      )
      .pipe(
        catchError(
          this.errorService.handleErrors<any>('Failed to get properties', {})
        )
      );
  }

  /**
   * Gets the property by id
   * @param id
   */
  public getPropertyById(id: string): Observable<Property> {
    return this.http
      .get<Property>(environment.api + `/properties/${id}`)
      .pipe(catchError(this.errorService.handleErrors<any>('', {})));
  }

  /**
   * Gets properties using search tear
   * @param term
   */
  searchProperty(term: string): Observable<Property[]> {
    return this.http
      .get<Observable<Property[]>>(
        environment.api + `/properties/search?term=${term}`
      )
      .pipe(
        catchError(
          this.errorService.handleErrors<any>('Property search error', [])
        )
      );
  }

  public createProperty(property: Property): Observable<Property> {
    return this.http
      .post<Property>(environment.api + '/properties', property)
      .pipe(
        catchError(
          this.errorService.handleErrors<any>('Property creation failed', [])
        )
      );
  }

  public updateProperty(data: {
    property: Property;
    id: string | undefined;
  }): Observable<Property> {
    const { property, id } = data;
    return this.http
      .patch<Property>(environment.api + `/properties/${id}`, property)
      .pipe(catchError(this.errorService.handleErrors<any>('', [])));
  }

  public deleteProperty(propertyId: string): Observable<any> {
    return this.http
      .delete<any>(environment.api + `/properties/${propertyId}`)
      .pipe(
        catchError(
          this.errorService.handleErrors<any>('Property delete failed', false)
        )
      );
  }
}
