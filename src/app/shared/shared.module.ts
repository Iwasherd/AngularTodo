import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { TodoItemComponent } from './components/todo-item/todo-item.component';

import { DatePipe } from './pipes/datePipe/date.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    TodoItemComponent,
    DatePipe
  ],
  exports: [
    // shared components
    TodoItemComponent,
    // pipes
    DatePipe
  ]
})
export class SharedModule { }
