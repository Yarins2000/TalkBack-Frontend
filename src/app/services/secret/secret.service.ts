import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SecretService {
  baseUrl = environment.serverApi;

  constructor(private http: HttpClient) { }

  getValues(controllerName: string): Observable<string[]>{
    return this.http.get<string[]>(this.baseUrl + controllerName + "/values", this.getHttpOptions());
  }

  //maybe use Interceptor instead
  getHttpOptions() {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + sessionStorage.getItem("token")
      })
    };
    return httpOptions;
  }
}
