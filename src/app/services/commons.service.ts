import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CommonsService {
  constructor() {}

  public flattenObject(obj: { [key: string]: any }): { [key: string]: any } {
    const result: { [key: string]: any } = {};
    Object.keys(obj).map((key) => {
      if (typeof obj[key] !== 'object') result[key] = obj[key];
      else {
        for (const nestedValue in obj[key]) {
          result[key + '_' + nestedValue] = obj[key][nestedValue];
        }
      }
    });
    return result;
  }
}
