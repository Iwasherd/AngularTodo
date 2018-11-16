import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';

import {TodoItem} from './shared/models/todo-item.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  todos: TodoItem[] = [];
  todosTodo = [];
  todosInProgress = [];
  todosDone = [];
  statuses = [{value: 0, text: 'ToDo'}, {value: 1, text: 'InProgress'}, {value: 2, text: 'Done'}];
  todoForm: FormGroup;
  active = false;
  @ViewChild('textarea') textareaRef: ElementRef;

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
    this.createForm();
    this.getFromLocalStorage();
    this.autoresize();
  }

  createForm() {
    this.todoForm = this.fb.group({
      title: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^[а-яА-ЯёЁa-zA-Z][а-яА-ЯёЁa-zA-Z0-9-_/:\s]{1,55}$/
          )
        ]
      ],
      description: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^[а-яА-ЯёЁa-zA-Z][а-яА-ЯёЁa-zA-Z0-9-_/:\s]{1,255}$/
          )
        ]
      ],
      deadLine: [
        '', [
          Validators.required,
          Validators.pattern(/0[1-9]|1[0-9].0[1-9]|1[0-9].[0-9]{4}/),
        ]
      ],
      priority: [
        1, [
          Validators.required,
          Validators.min(1),
          Validators.max(3),
          Validators.pattern(/[1-3]/),
        ]
      ],
      status: '0'
    });
  }

  autoresize() {
    if (this.textareaRef.nativeElement) {
      this.textareaRef.nativeElement.style.height = 0;
      const height = this.textareaRef.nativeElement.scrollHeight;
      const minHeight = parseInt('2', 3) * parseFloat('13');
      this.textareaRef.nativeElement.style.height = Math.max(minHeight, height) + 'px';
    }
  }

  cardClasses(item) {
    let todo = false,
      inProgress = false,
      done = false;
    switch (item.status) {
      case '0':
        todo = true;
        break;
      case '1':
        inProgress = true;
        break;
      case '2' :
        done = true;
    }
    return {
      main__card: true,
      active: this.active,
      todo,
      inProgress,
      done,
    };
  }

  filterTodos() {
    this.todosTodo = [];
    this.todosInProgress = [];
    this.todosDone = [];
    this.todos.sort((a, b) => {
      if (a.deadLine > b.deadLine) {
        return -1;
      }
      if (a.deadLine < b.deadLine) {
        return 1;
      }
      return 0;
    });
    for (let i = 0; i < this.todos.length; i++) {
      if (this.todos[i].status == 0) {
        this.todosTodo.push(this.todos[i]);
      }
      if (this.todos[i].status == 1) {
        this.todosInProgress.push(this.todos[i]);
      }
      if (this.todos[i].status == 2) {
        this.todosDone.push(this.todos[i]);
      }
    }
  }

  addTodo() {
    const collectionOfId = [];
    if (this.todos.length > 0) {
      this.todos.map(todo => collectionOfId.push(todo.id));
      this.todoForm.value.id = Math.max.apply(null, collectionOfId) + 1;
    } else {
      this.todoForm.value.id = 0;
    }
    this.todos.push(this.todoForm.value);
    this.todoForm.reset();
    this.setLocalStorage();
    this.filterTodos();
  }

  setLocalStorage() {
    const value = JSON.stringify(this.todos);
    localStorage.setItem('todos', value);
  }

  getFromLocalStorage() {
    if (localStorage.getItem('todos')) {
      this.todos = JSON.parse(localStorage.getItem('todos'));
    }
    this.filterTodos();
  }

  removeTodo(item: TodoItem) {
    let index = this.todos.indexOf(item);
    this.todos.splice(index, 1);
    this.setLocalStorage();
    this.filterTodos();
  }

  updateTodo(item) {
    for (let i = 0; i < this.todos.length; i++) {
      if (this.todos[i].id === item.id) {
        this.todos[i] = item;
        break;
      }
    }
    this.setLocalStorage();
    this.filterTodos();
  }

  checkOnValid(controlName: string): boolean {
    const check = this.todoForm.controls[controlName];
    const result = check.invalid && check.dirty;
    return result;
  }
}
