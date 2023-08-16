import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';

import { Todo } from '../../../shared/todo'
import { TodoService } from '../../../services/todo.service'
import { UserService } from '../../../services/user.service';
import { TodoformComponent } from '../todoform/todoform.component';

//Puntos de mejora General
import { Observable,Observer , Subject, forkJoin, of } from 'rxjs';
import { switchMap, takeUntil, tap, mergeMap} from 'rxjs/operators';

@Component({
  selector: 'app-todolist',
  templateUrl: './todolist.component.html',
  styleUrls: ['./todolist.component.scss'],
})

export class TodolistComponent implements OnInit, OnDestroy  {

  private unsubscribe$ = new Subject<void>(); // Para manejar la desuscripción
  private onDestroy$ = new Subject<void>();

  @ViewChild("formchild")
  public TodoFormComp!: TodoformComponent;

  task!: string;
  todo!: Todo[];
  errorMsg: string = "Loading Todo....";

  title: any = "Lista de tareas";
  today: number = Date.now();

  completeTask: any;
  pendingTask: any;

  constructor(private service: TodoService, private toastr: ToastrService, private router: Router,
    private userApi: UserService, private route: ActivatedRoute, private _element: ElementRef) {
  }
  
  ngOnInit() {
    //console.log(this.userApi.getAccessToken().id);
    this.getItems();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }


  getItems() {
    
    this.service.getTodoList().subscribe(
      {
        next: (response) => {
          this.todo = response.filter(item => item.userId == this.userApi.getAccessToken().id);
          this.completeTask = this.todo.filter(item => item.status === true);
          this.pendingTask = this.todo.filter(item => item.status == false);
          //console.log(this.todo);
        },
        error: (error) => {
          //console.log(error);
          this.errorMsg = error.status + " " + error.statusText;
          if (error.status === 0) { this.router.navigate(['/network-error']); }
        },
        complete: () => { }
      });
  }

  //---------------------------------------------- 
  // Métodos mejorados
  //--------------------------------
  todoItemAdded(todo: { userId: number, id: number; task: string; status: boolean; }) {
    const addTodo$ = this.service.addTodoItem({
      userId: this.userApi.getAccessToken().id, id: todo.id, task: todo.task, status: false
    });

    addTodo$.pipe(
      tap(() => {
        this.toastr.success('La Tarea ha sido agregada');
        this.getItems();
      })
    ).subscribe();
  }

  onDeleteTodoItem(id: number) {
    if (confirm("Está seguro de eliminar la Tarea ")) {
      this.service.deleteTodoById(id).pipe(
        tap(() => {
          this.toastr.success('La tarea ha sido Eliminada');
          this.getItems();
        })
      ).subscribe();
    }
  }

  onDeleteTodoItemCompleted() {
    const completedTasks = this.todo.filter(item => item.status == true);

    if (completedTasks.length <= 0) {
      this.toastr.success("No se han conseguido Tareas Completadas");
      return;
    }

    const deleteObservables: Observable<any>[] = completedTasks.map(item => {
      if (item.id) {
        return this.service.deleteTodoById(item.id);
      }
      return of(null);
    });

    forkJoin(deleteObservables).pipe(
      mergeMap(() => {
        return deleteObservables.filter(obs => obs !== of(null));
      }),
      tap(() => {
        this.toastr.success('Las tareas han sido Eliminadas');
        this.getItems();
      })
    ).subscribe();
  }  

  onUpdateTodoItem(todo: Todo) {
    this.service.updateTodoById(todo.id, {
      userId: todo.userId,
      id: todo.id,
      task: todo.task,
      status: !todo.status
    }).pipe(
      tap(() => {
        this.toastr.success('El estado de la Tarea ha sido modificado');
        this.getItems();
      })
    ).subscribe();
  }

  //---------------
  //  Metodo Asyncrono para evitar suscripciones y desuscripciones  
  //----------------------------------------------------------------

  todolistAction$: Observable<any> = new Observable(); // Inicialización por defecto

  onEditTodoItem(todo: any) {
    this.todolistAction$ = this.service.editTodoById(todo.id, {
      userId: this.userApi.getAccessToken().id,
      id: this.TodoFormComp.todoformtype.id,
      task: todo.task,
      status: todo.status
    }).pipe(
      tap(() => {
        this.toastr.success('La tarea ha sido modificada');
        this.getItems();
      })
    );
  }
//----------------------------------------------------------------


  onEditItem(todo: Todo) {
    this.TodoFormComp.todoformtype.task = todo.task;
    this.TodoFormComp.todoformtype.id = todo.id;
    this.TodoFormComp.onSubmitValue = false;
    //this.TodoFormComp.el.nativeElement.focus();
  }


 //----------------------------------------------------------------
 //
 // Métodos anteriores
 //
 //-----------------------------------------------------------------------------
 
  todoItemAddedOld(todo: { userId: number, id: number; task: string; status: boolean; }) {

    const mytodoItemAdded: Observer<Todo> = {
      next: (value) => {
        // Lógica para manejar el próximo valor
        //console.log('Next:', value);
        this.toastr.success('La Tarea ha sido agregada');
        this.getItems();
      },
      error: (error) => {
        // Lógica para manejar el error
        console.error('Error:', error);
      },
      complete: () => {
        // Lógica para manejar la finalización
        //console.log('Complete');
      }
    };

    this.service.addTodoItem({
      userId: this.userApi.getAccessToken().id, id: todo.id, task: todo.task, status: false
    }).subscribe(mytodoItemAdded);
  }

  onDeleteTodoItemOld(id: number) {

    const myonDeleteTodoItem: Observer<Todo> = {
      next: (value) => {
        // Lógica para manejar el próximo valor
        //console.log('Next:', value);
        this.toastr.success('La tarea ha sido Eliminada');
        this.getItems();
      },
      error: (error) => {
        // Lógica para manejar el error
        console.error('Error:', error);
      },
      complete: () => {
        // Lógica para manejar la finalización
        //console.log('Complete');
      }
    };

    if (confirm("Está seguro de Eliminar la Tarea ")) {
      this.service.deleteTodoById(id)
        .subscribe(myonDeleteTodoItem);
    }
  }

  onDeleteTodoItemCompletedOld() {

    const myonDeleteTodoItemCompleted: Observer<Todo> = {
      next: (value) => {
        // Lógica para manejar el próximo valor
        //console.log('Next:', value);
        this.toastr.success('Las tareas han sido Eliminadas');
        this.getItems();
      },
      error: (error) => {
        // Lógica para manejar el error
        console.error('Error:', error);
      },
      complete: () => {
        // Lógica para manejar la finalización
        //console.log('Complete');
      }
    };

    const completedTasks = this.todo.filter(item => item.status == true);
    if (completedTasks.length <= 0) {
      this.toastr.success("No se han conseguifo Tareas Completadas");
    } else {
      const completedTasks = this.todo.filter(item => item.status == true);
      if (confirm("Está seguro de Eliminar la Tarea")) {
        completedTasks.forEach((item) => {
          if (item.id) {
            this.service.deleteTodoById(item.id)
              .subscribe(myonDeleteTodoItemCompleted);
          }
        });
      }
    }
  }

  onUpdateTodoItemOld(todo: Todo) {

    const myonUpdateTodoItem: Observer<Todo> = {
      next: (value) => {
        // Lógica para manejar el próximo valor
        //console.log('Next:', value);
        this.toastr.success('El estado de la Tarea ha sido modificado');
        this.getItems();
      },
      error: (error) => {
        // Lógica para manejar el error
        console.error('Error:', error);
      },
      complete: () => {
        // Lógica para manejar la finalización
        //console.log('Complete');
      }
    };

    this.service.updateTodoById(todo.id, { userId: todo.userId, id: todo.id, task: todo.task, status: todo.status == false ? true : false })
      .subscribe(myonUpdateTodoItem);
  }

  onEditTodoItemOld(todo: any) {

    const myonEditTodoItem: Observer<Todo> = {
      next: (value) => {
        // Lógica para manejar el próximo valor
        //console.log('Next:', value);
        this.toastr.success('La tarea ha sido modificada');
        this.getItems();
      },
      error: (error) => {
        // Lógica para manejar el error
        console.error('Error:', error);
      },
      complete: () => {
        // Lógica para manejar la finalización
        //console.log('Complete');
      }
    };

    this.service.editTodoById(todo.id, { userId: this.userApi.getAccessToken().id, id: this.TodoFormComp.todoformtype.id, task: todo.task, status: todo.status })
      .subscribe(myonEditTodoItem);

  }

  onEditTodoItemOld2(todo: any) {
    this.service.editTodoById(todo.id, {
      userId: this.userApi.getAccessToken().id,
      id: this.TodoFormComp.todoformtype.id,
      task: todo.task,
      status: todo.status
    }).pipe(
      tap(() => {
        this.toastr.success('La tarea ha sido modificada');
        this.getItems();
      })
    ).subscribe();
  }

}


