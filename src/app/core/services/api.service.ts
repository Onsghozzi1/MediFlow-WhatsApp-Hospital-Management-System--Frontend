import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private userKey = 'user';

  constructor(private http: HttpClient) { }

  getBaseUrl(): string {
    // Solution garantie qui marche
    return (environment as any).basePath || 'http://localhost:8080/api/v1';
  }


  private getHeaders(): HttpHeaders {
    const token = this.getToken();
    let headers = new HttpHeaders().set('Content-Type', 'application/json');

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  get<T>(endpoint: string, params?: HttpParams): Observable<T> {
    return this.http.get<T>(`${this.getBaseUrl()}/${endpoint}`, {
      headers: this.getHeaders(),
      params: params
    });
  }
  getMobile<T>(endpoint: string, params?: HttpParams): Observable<T> {
    return this.http.get<T>(`${this.getBaseUrl()}/${endpoint}`, {
      headers: this.getHeaders(),
      params: params
    });
  }

  post<T>(endpoint: string, body: any, params?: HttpParams): Observable<T> {
    return this.http.post<T>(`${this.getBaseUrl()}/${endpoint}`, body, {
      headers: this.getHeaders(),
      params: params
    });
  }
    /* =========================
     POST (JSON or FormData)
     ========================= */
  post_file<T>(url: string, body: any): Observable<T> {

    // 🔥 IMPORTANT: do NOT set headers here
    // Angular will automatically choose:
    // - application/json
    // - multipart/form-data (with boundary)

    return this.http.post<T>(`${this.getBaseUrl()}/${url}`, body);
  }
   post_data<T>(endpoint: string, body: any, params?: HttpParams): Observable<T> {
    let headers = this.getHeaders();

    // For FormData, do NOT set Content-Type; browser will handle it
    if (body instanceof FormData) {
      headers = headers.delete('Content-Type');
    }

    return this.http.post<T>(`${this.getBaseUrl()}/${endpoint}`, body, {
      headers: headers,
      params: params
    });
  }

  put<T>(endpoint: string, body: any): Observable<T> {
    const url = `${this.getBaseUrl()}/${endpoint}`;
    console.log(`Making PUT request to: ${url}`, body);

    return this.http.put<T>(url, body, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => {
        console.error(`Error in PUT request to ${url}:`, error);
        return throwError(() => error);
      })
    );
  }

putçentity(url: string, body: any): Observable<any> {
      const url_ = `${this.getBaseUrl()}/${url}`;

  return this.http.put(url_, body); // NO HEADERS
}


  put_delete<T>(
  endpoint: string,
  body: any,
  params?: HttpParams
): Observable<T> {
  const url = `${this.getBaseUrl()}/${endpoint}`;

  return this.http.put<T>(url, body, {
    headers: this.getHeaders(),
    params: params    // ✅ correct
  });
}
put_file(url: string, body: any, params?: HttpParams): Observable<any> {
  return this.http.put(this.getBaseUrl()+'/'+ url, body, {
    params,
    responseType: 'text' as 'json'   // 🔥 IMPORTANT !
  });
}


  putImg<T>(endpoint: string, body: any): Observable<T> {
    const url = `${this.getBaseUrl()}/${endpoint}`;
    console.log(`Making PUT request to: ${url}`, body);

    return this.http.put<T>(url, body, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => {
        console.error(`Error in PUT request to ${url}:`, error);
        return throwError(() => error);
      })
    );
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.getBaseUrl()}/${endpoint}`, {
      headers: this.getHeaders(),
      responseType: 'text' as 'json' // Keep this if the API returns a plain text response
    });
  }

  patch<T>(endpoint: string, body: any, params?: HttpParams): Observable<T> {
    const url = `${this.getBaseUrl()}/${endpoint}`;
    console.log(`Making PATCH request to: ${url}`, body);

    return this.http.patch<T>(url, body, {
      headers: this.getHeaders(),
      params: params
    }).pipe(
      catchError(error => {
        console.error(`Error in PATCH request to ${url}:`, error);
        return throwError(() => error);
      })
    );
  }

  getToken(): string | null {
    return this.getUserData()?.access_token || null;
  }

  getRefreshToken(): string | null {
    return this.getUserData()?.refresh_token || null;
  }

  isTokenExpired(): boolean {
    const user = this.getUserData();
    if (!user || !user.expires_in) return true;

    const expiresAt = user.stored_at + user.expires_in * 1000;
    return Date.now() > expiresAt;
  }

  private getUserData(): any {
    const data = localStorage.getItem(this.userKey);
    if (!data) return null;

    try {
      const user = JSON.parse(data);
      if (!user.stored_at) {
        user.stored_at = Date.now();
        localStorage.setItem(this.userKey, JSON.stringify(user));
      }
      return user;
    } catch {
      console.error('Failed to parse user data');
      return null;
    }
  }

  postWithoutAuth<T>(endpoint: string, body: any): Observable<T> {
    return this.http.post<T>(`${this.getBaseUrl()}/${endpoint}`, body, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  putWithoutAuth<T>(endpoint: string, body: any): Observable<T> {
    return this.http.put<T>(`${this.getBaseUrl()}/${endpoint}`, body, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }
  public getRoles(): string[] {
    const userData = this.getUserData();

    if (!userData || !userData.roleTypes) {
      console.log("Roles not found in user data.");
      return [];
    }

    // Handle both string and array cases
    const roles = userData.roleTypes;
    if (typeof roles === 'string') {
      return [roles]; // Convert single role string to array
    } else if (Array.isArray(roles)) {
      return roles; // Already an array
    }

    console.log("Invalid role format in user data.");
    return [];
  }
  public roleMatch(allowedRoles: string[]): boolean {
    const userRoles = this.getRoles();

    if (!userRoles || userRoles.length === 0) {
      return false;
    }

    if (!allowedRoles || allowedRoles.length === 0) {
      return false;
    }

    // Check if user has any of the allowed roles
    for (const userRole of userRoles) {
      if (allowedRoles.includes(userRole)) {
        return true;
      }
    }

    return false;
  }
/*
downloadFile(url: string, fileName: string) {
  console.log("URL: "+ url +" | File: "+ fileName);
        const url_ = `${this.getBaseUrl()}/${url}`;

  this.http.get(url_, { responseType: 'blob' }).subscribe({
    next: (blob: Blob) => {
      if (blob.size === 0) {
        console.error('Empty file received');
        Swal.fire({
          icon: 'error',
          title: 'فشل تحميل الملف',
          text: 'الملف فارغ'
        });
        return;
      }

      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName;
      link.click();
      window.URL.revokeObjectURL(link.href);

      Swal.fire({
        icon: 'success',
        title: 'تم تحميل الملف بنجاح',
        timer: 1500,
        showConfirmButton: false
      });
    },
    error: (err) => {
      console.error('Download error:', err);
      Swal.fire({
        icon: 'error',
        title: 'فشل تحميل الملف',
        text: err.message
      });
    }
  });
}*/

}
