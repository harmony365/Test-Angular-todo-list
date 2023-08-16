import { Component, Input, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Todo } from '../../../shared/todo'

@Component({
  selector: 'app-todoform',
  templateUrl: './todoform.component.html',
  styleUrls: ['./todoform.component.scss']
})
export class TodoformComponent implements OnInit {
  //@ViewChild('task', { read: ElementRef }) el!: ElementRef<HTMLInputElement>;

  @Input() task!: string;

  @Output() todoItemCreated = new EventEmitter<{ userId: number; id: number; task: string; status: boolean }>();
  @Output() todoItemEdited = new EventEmitter<object>();

  //task!: string;
  onSubmitValue: boolean = true;

  todoformtype: any = {
    id: '',
    task: '',
    status: false
  };

  constructor() {
  }

  ngOnInit() {
  }

  onSubmit(todo: Todo) {
    //this.el.nativeElement.focus();
    this.todoItemCreated.emit({ userId: todo.userId, id: todo.id, task: todo.task, status: todo.status });
  }

  edit(todo: Todo) {
    this.todoItemEdited.emit({ userId: todo.userId, id: this.todoformtype.id, task: todo.task, status: this.todoformtype.status });
    this.onSubmitValue = true;
  }
}
