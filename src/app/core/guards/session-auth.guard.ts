import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SessionAuthGuard implements CanActivate {
  constructor( ) { }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {

    // Siempre autenticado
    return true;
  }
}
