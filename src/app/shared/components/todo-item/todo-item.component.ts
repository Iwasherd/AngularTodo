import {Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef} from '@angular/core';
import {TodoItem} from '../../models/todo-item.model';
import {FormGroup, Validators, FormBuilder} from '@angular/forms';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.css']
})
export class TodoItemComponent implements OnInit {
  dialog = false;
  confirm = false;
  dialogEnter = false;
  dialogLeave = false;
  full = false;
  todoForm: FormGroup;
  statuses = [{value: 0, text: 'ToDo'}, {value: 1, text: 'InProgress'}, {value: 2, text: 'Done'}];
  @Input() item = new TodoItem();
  @Output() remove: EventEmitter<TodoItem> = new EventEmitter();
  @Output() update: EventEmitter<object> = new EventEmitter();
  @ViewChild('dialog') dialogRef: ElementRef;
  @ViewChild('textarea') textareaRef: ElementRef;

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
    this.createForm();
  }

  autoresize() {
    if (this.textareaRef.nativeElement) {
      this.textareaRef.nativeElement.style.height = 0;
      const height = this.textareaRef.nativeElement.scrollHeight;
      const minHeight = parseInt('2', 3) * parseFloat('13');
      this.textareaRef.nativeElement.style.height = Math.max(minHeight, height) + 'px';
    }
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

  checkOnValid(controlName: string): boolean {
    const check = this.todoForm.controls[controlName];
    const result = check.invalid && check.dirty;
    return result;
  }

  dialogClasses() {
    return {
      dialog: true,
      enter: this.dialogEnter,
      leave: this.dialogLeave
    };
  }
  openConfirm() {
    this.full = !this.full;
    this.confirm = !this.confirm;
    this.dialogEnter = true;
    setTimeout(() => {
      this.dialogEnter = false;
    }, 100);
  }
  openDialog() {
    this.full = !this.full;
    this.dialog = !this.dialog;
    this.dialogEnter = true;
    this.todoForm.reset({
      title: this.item.title,
      description: this.item.description,
      deadLine: this.item.deadLine,
      status: this.item.status,
      priority: this.item.priority,
    });

    setTimeout(() => {
      this.autoresize();
      this.dialogEnter = false;
    }, 100);
  }
  closeConfirm(e, dialog) {
    if (e.target === dialog) {
      this.dialogLeave = true;
      setTimeout(() => {
        this.confirm = !this.confirm;
        this.dialogLeave = false;
      }, 400);
    }
  }
  closeDialog(e, dialog) {
    if (e.target === dialog) {
      this.dialogLeave = true;
      setTimeout(() => {
        this.dialog = !this.dialog;
        this.dialogLeave = false;
      }, 400);
    }
  }

  removeItem() {
    this.remove.emit(this.item);
  }

  showFull() {
    this.full = !this.full;
  }

  updateItem() {
    const data = this.todoForm.value;
    data.id = this.item.id;
    this.update.emit(data);
    this.dialogLeave = true;
    setTimeout(() => {
      this.dialog = !this.dialog;
      this.dialogLeave = false;
    }, 400);
  }

}
