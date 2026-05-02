import { HttpInterceptorFn, HttpRequest, HttpHandler } from '@angular/common/http';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Récupérer le token depuis localStorage
  const token = localStorage.getItem('token');

  let authReq = req;

  if (token) {
    // Cloner la requête et ajouter le header Authorization
    const headers = req.headers
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json'); // si besoin
    authReq = req.clone({ headers });
  }

  // Passer la requête au prochain handler
  return next(authReq);
};
