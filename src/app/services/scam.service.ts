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

export interface ScamStats {
  type: string;
  count: number;
}

@Injectable({
  providedIn: 'root'
})
export class ScamService {

  private baseUrl = 'http://localhost:9090/api/scams';
  private classifyUrl = 'http://localhost:9090/api/scams/classify';
  private statsUrl = 'http://localhost:9090/api/scams/stats';

  constructor(private http: HttpClient) {}

  getAllScams(): Observable<Scam[]> {
    return this.http.get<Scam[]>(this.baseUrl);
  }

  createScam(scam: Scam): Observable<Scam> {
    return this.http.post<Scam>(this.baseUrl, scam);
  }

  classifyScam(description: string): Observable<{ type: string }> {
    return this.http.post<{ type: string }>(this.classifyUrl, { description });
  }

  getScamStats(): Observable<ScamStats[]> {
    return this.http.get<ScamStats[]>(this.statsUrl);
  }
}
