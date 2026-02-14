import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Scam {
  id?: number;
  description: string;
  type: string;
  latitude: number;
  longitude: number;
}

@Injectable({
  providedIn: 'root'
})
export class ScamService {

  private baseUrl = 'http://localhost:9090/api/scams';

  constructor(private http: HttpClient) {}

  getAllScams(): Observable<Scam[]> {
    return this.http.get<Scam[]>(this.baseUrl);
  }

  createScam(scam: Scam): Observable<Scam> {
    return this.http.post<Scam>(this.baseUrl, scam);
  }

}
