import { Injectable, TemplateRef } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toasts: any[] = [];

  constructor() { }

  show(textOrTemplate: string | TemplateRef<any>, options: any = {}){
    this.toasts.push({ textOrTemplate, ...options });
  }

  remove(toast: any){
    this.toasts = this.toasts.filter(t => t !== toast);
  }

  clear(){
    this.toasts.splice(0, this.toasts.length);
  }
}
