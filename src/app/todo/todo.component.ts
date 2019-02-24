import {ChangeDetectionStrategy, Component, DoCheck, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';

import {Todo, TodoUtils} from './todo.model';
import {Filter, FilterUtil} from './filter.model';
import {TodoService} from '../todo.service';


@Component({
	selector: 'app-todo',
	templateUrl: './todo.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoComponent implements OnInit, DoCheck, OnDestroy {

	private routeSubscription: Subscription;

	newTodo = '';
	currentTodo: Todo;
	snapshot: Todo;

	filter = Filter.ALL;
	todos: Todo[];
	filteredTodos: Todo[];
	completed: number;
	remaining: number;
	allCompleted: boolean;


	constructor(private todoService: TodoService, private route: ActivatedRoute) {
	}

	// ~ lifecycle

	ngOnInit() {
		this.routeSubscription = this.route.params.subscribe(params => {
			this.filter = FilterUtil.fromString(params['filter']);
		});
	}

	ngDoCheck() {
		this.todos = this.todoService.findAll();
		this.filteredTodos = this.todos.filter((t) => FilterUtil.accepts(t, this.filter));
		this.remaining = this.completed = 0;
		this.todos.forEach(t => t.completed ? this.completed++ : this.remaining++);
		this.allCompleted = this.todos.length === this.completed;
	}

	ngOnDestroy(): void {
		this.routeSubscription.unsubscribe();
	}

	// ~ crud

	create(todo: string) {
		if (todo.trim().length === 0) {
			return;
		}
		this.todoService.create(todo);
		this.newTodo = '';
	}

	edit(todo: Todo) {
		this.currentTodo = todo;
		this.snapshot = TodoUtils.copy(todo);
	}

	cancelEdit() {
		TodoUtils.copyProperties(this.snapshot, this.currentTodo);
		this.currentTodo = null;
		this.snapshot = null;
	}

	update(todo: Todo) {
		this.currentTodo = null;
		this.snapshot = null;
		this.todoService.update(todo);
	}

	delete(todo: Todo) {
		this.todoService.delete(todo);
	}

	toggle(todo: Todo) {
		this.todoService.toggle(todo);
	}

	toggleAll(completed: boolean) {
		this.todoService.toggleAll(completed);
	}

	clearCompleted() {
		this.todoService.clearCompleted();
	}
}
