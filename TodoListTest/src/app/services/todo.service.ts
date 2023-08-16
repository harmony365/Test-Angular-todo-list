import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Todo } from '../shared/todo'
//import { baseURL } from './baseUrl'

import { environment } from '../../environments/development.environment';

const baseURL = environment.baseURL;

@Injectable({
  providedIn: 'root'
})

export class TodoService {

  globalHttpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };  

  constructor(private http: HttpClient) {   }

  getTodoList(): Observable<Todo[]> {
    return this.http.get<Todo[]>(baseURL + "todo")
      .pipe(catchError((error: HttpErrorResponse) => throwError(() => error.message)));
  }

  addTodoItem(todo: Todo): Observable<Todo> {
    return this.http.post<Todo>(baseURL + "todo", todo, this.globalHttpOptions)
      .pipe(catchError((error: HttpErrorResponse) => throwError(() => error.message)));
  }

  deleteTodoById(id: number): Observable<Todo> {
    return this.http.delete<Todo>(baseURL + "todo" + '/' + id, this.globalHttpOptions)
      .pipe(catchError((error: HttpErrorResponse) => throwError(() => error.message)));
  }

  updateTodoById(id: number, todo: Todo): Observable<Todo> {
    return this.http.put<Todo>(baseURL + "todo" + '/' + id, todo, this.globalHttpOptions)
      .pipe(catchError((error: HttpErrorResponse) => throwError(() => error.message)));
  }

  editTodoById(id: number, todo: Todo): Observable<Todo> {
    return this.http.put<Todo>(baseURL + "todo" + '/' + id, todo, this.globalHttpOptions)
      .pipe(catchError((error: HttpErrorResponse) => throwError(() => error.message)));
  }
}
